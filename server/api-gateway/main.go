package main

import (
	"crypto/tls"
	"encoding/json"
	"log"
	"net/url"
	"os"
	"path"
	"strings"

	fiberWebsocket "github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/gorilla/websocket"
)

func setupProxy(app *fiber.App, serviceList []ServiceInfo) {
	// if target https site uses a self-signed certificate, you should
	// call WithTlsConfig before Do and Forward
	proxy.WithTlsConfig(&tls.Config{
		InsecureSkipVerify: true,
	})
	// if you need to use global self-custom client, you should use proxy.WithClient.
	proxy.WithClient(&fasthttp.Client{
		NoDefaultUserAgentHeader: true,
		DisablePathNormalizing:   false,
	})

	api := app.Group("/api") // /api

	env_prefix := "env_"
	// proxy.Forward
	for _, v := range serviceList {
		// if don't provide url
		if strings.HasPrefix(v.Url, env_prefix) {
			v.Url = strings.TrimSpace(os.Getenv(v.Url[len(env_prefix):]))
		}
		// byteArray, err := json.MarshalIndent(v, "", "  ")
		// if err != nil {
		// 	fmt.Println(err)
		// }
		// fmt.Println(string(byteArray))
		if len(v.Url) <= 0 {
			continue
		}

		app.Use(v.Endpoint, ProxyHandler(v.Url))
		api.Use(v.Endpoint, ProxyHandler(v.Url))
	}

}

type ServiceInfo struct {
	Endpoint string `json:"endpoint"`
	Url      string `json:"url"`
}
type WsServiceInfo struct {
	Endpoint string   `json:"endpoint"`
	SendTo   string   `json:"sendTo"`
	Headers  []string `json:"headers"`
}

type ConfigFileData struct {
	Http []ServiceInfo   `json:"http"`
	Ws   []WsServiceInfo `json:"ws"`
}

func main() {
	app := fiber.New()

	u := url.URL{
		Scheme: "ws",
		Host:   os.Getenv("WS_HOST") + ":" + os.Getenv("WS_PORT"),
		Path:   "/",
	}
	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
		AllowOrigins:     "*",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))
	app.Use(logger.New())
	app.Use(compress.New())

	configFileContent, err := os.ReadFile(path.Join(get__dirname(), "config.json"))
	if err != nil {
		panic(err)
	}

	var configFile ConfigFileData
	err = json.Unmarshal([]byte(configFileContent), &configFile)
	if err != nil {
		panic(err)
	}
	setupProxy(app, configFile.Http)
	setupWsProxy(app, c, configFile.Ws)
	app.Listen(":" + os.Getenv("PORT"))
}
func setupWsProxy(app *fiber.App, ws *websocket.Conn, wsServiceList []WsServiceInfo) {
	app.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if fiberWebsocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			c.Locals("requestID", uuid.New().String())
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	for _, v := range wsServiceList {
		app.Get("/ws"+v.Endpoint, fiberWebsocket.New(func(c *fiberWebsocket.Conn) {

			requestID := c.Locals("requestID")
			// websocket.Conn bindings https://pkg.go.dev/github.com/fasthttp/websocket?tab=doc#pkg-index
			headers := map[string]string{}
			for _, hn := range v.Headers {
				headers[hn] = c.Headers(hn)
			}
			var (
				mt  int
				msg []byte
				err error
			)
			wsRequestIDs := []string{}
			go func() {
				for {
					_, message, err := ws.ReadMessage()
					if err != nil {
						d, err := json.Marshal(map[string]interface{}{
							"Error": "Server Decode Message Error",
						})
						if err != nil {
							break
						}
						c.WriteMessage(mt, d)
						break
					}
					var data WsReturnData[WsMessageResponse]
					err = json.Unmarshal(message, &data)
					if err != nil {
						log.Println("write:", err)
						d, err := json.Marshal(map[string]interface{}{
							"Error": "Server Error",
						})
						if err != nil {
							break
						}
						c.WriteMessage(mt, d)
						break
					}
					if data.Type == "rep" {
						if Contains(wsRequestIDs, data.ID) {
							if data.Error != nil {
								d, err := json.Marshal(map[string]interface{}{
									"Error": data.Error,
								})
								if err != nil {
									break
								}
								c.WriteMessage(mt, d)
								break
							}
							if err = c.WriteMessage(mt, data.Payload.Message); err != nil {
								log.Println("write:", err)
								break
							}

						}
					}
				}
			}()
			for {
				if mt, msg, err = c.ReadMessage(); err != nil {
					log.Println("read:", err)
					break
				}
				// send message and wait response
				log.Printf("recv: %s", msg)
				log.Printf("requestID: %v\n", requestID)
				payload := WsRequestMessagePayload{}
				wsRequestID := uuid.NewString()
				wsRequest := WsRequest[WsRequestMessagePayload]{
					Payload: payload,
					Url:     v.SendTo,
					From:    "api-gateway/wsGateway",
					Header:  nil,
					Type:    "message",
					ID:      wsRequestID,
				}
				requestDataBytes, err := json.Marshal(wsRequest)
				if err != nil {
					log.Println("write:", err)
					break
				}
				ws.WriteMessage(websocket.TextMessage, requestDataBytes)
				wsRequestIDs = append(wsRequestIDs, wsRequestID)
			}

		}))
	}

}

func ProxyHandler(path string) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		originUrl := strings.Clone(c.OriginalURL())
		url, err := url.JoinPath(strings.Clone(path), strings.Join(strings.Split(originUrl, "/")[2:], "/"))
		if err != nil {
			log.Println(err)
			return err
		}
		url = strings.ReplaceAll(url, "%3F", "?")
		if err := proxy.Do(c, url); err != nil {
			return err
		}
		// Remove Server header from response
		c.Response().Header.Del(fiber.HeaderServer)
		return nil
	}
}

// =>> js name
func get__dirname() string {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	exPath := path.Dir(ex)
	return exPath
}

func Index[S ~[]E, E comparable](s S, v E) int {
	for i := range s {
		if v == s[i] {
			return i
		}
	}
	return -1
}
func Contains[S ~[]E, E comparable](s S, v E) bool {
	return Index(s, v) >= 0
}

type WsRequest[pt any] struct {
	Url     string       `json:"url"`
	Header  *interface{} `json:"header"`
	Payload pt           `json:"payload"`
	From    string       `json:"from"`
	Type    string       `json:"type"`
	ID      string       `json:"id"`
}
type WsReturnData[T any] struct {
	Url     string       `json:"url"`
	Header  *interface{} `json:"header"`
	Payload T            `json:"payload"`
	Type    string       `json:"type"`
	Error   *string      `json:"error"`
	From    string       `json:"from"`
	ID      string       `json:"id"`
}

type WsRequestMessagePayload struct {
	Headers   map[string]string `json:"headers"`
	RequestID string            `json:"requestID"`
	Message   []byte            `json:"message"`
}

type WsMessageResponse struct {
	Message []byte `json:"message"`
}
