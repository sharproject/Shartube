package main

import (
	"crypto/tls"
	"encoding/json"
	"log"
	"net/url"
	"os"
	"path"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"github.com/valyala/fasthttp"

	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func setupProxy(app *fiber.App) {
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

	configFile, err := os.ReadFile(path.Join(get__dirname(), "config.json"))
	if err != nil {
		panic(err)
	}

	var serviceList []ServiceInfo
	err = json.Unmarshal([]byte(configFile), &serviceList)
	if err != nil {
		panic(err)
	}
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

func main() {
	app := fiber.New()

	app.Use(logger.New())
	app.Use(compress.New())
	app.Use(cors.New())

	setupProxy(app)
	app.Listen(":" + os.Getenv("PORT"))
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
