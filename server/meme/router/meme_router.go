package router

import (
	"encoding/json"
	"log"
	"meme_server/database/meme_model"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetMemeRoute(route fiber.Router) {
	route.Post("/", checkAuth, createMeme)
}

func createMeme(ctx *fiber.Ctx) error {
	_, err := meme_model.InitMemeModel(ctx.Locals("database_connect").(*mongo.Client))
	if err != nil {
		log.Println(err)
	}
	requestData := new(meme_model.CreateMemeInputModel)
	if err := ctx.BodyParser(requestData); err != nil {
		return err
	}
	return nil
}

func checkAuth(ctx *fiber.Ctx) error {

	type SessionDataReturn struct {
		ID        string    `json:"_id"`
		CreatedAt time.Time `json:"createdAt"`
		UpdatedAt time.Time `json:"updatedAt"`
		UserID    string    `json:"userID"`
	}

	type WsRequest struct {
		Url     string       `json:"url"`
		Header  *interface{} `json:"header"`
		Payload any          `json:"payload"`
		From    string       `json:"from"`
		Type    string       `json:"message"`
	}

	type PayloadReturn struct {
		SessionData *SessionDataReturn `json:"sessionData"`
		ID          string             `json:"id"`
	}

	type ReturnData struct {
		Url     string        `json:"url"`
		Header  *interface{}  `json:"header"`
		Payload PayloadReturn `json:"payload"`
		Type    string        `json:"type"`
		Error   *string       `json:"error"`
	}

	token := ctx.GetReqHeaders()["Authorization"]
	if len(strings.TrimSpace(token)) < 1 {
		ctx.Status(403)
		ctx.WriteString("UnAuthorization")
	}

	bearer := "Bearer "
	token = strings.Trim(strings.Replace(token, bearer, "", -1), " ")
	u := url.URL{
		Scheme: "ws",
		Host:   os.Getenv("WS_HOST") + ":" + os.Getenv("WS_PORT"),
		Path:   "/",
	}
	requestId := uuid.New().String()
	payload := struct {
		Token string `json:"token"`
		ID    string `json:"id"`
	}{
		Token: token,
		ID:    requestId,
	}
	requestData := WsRequest{
		Url:     "user/decodeToken",
		Header:  nil,
		Payload: &payload,
		From:    "comic/auth",
		Type:    "message",
	}
	requestDataBytes, err := json.Marshal(requestData)
	if err != nil {
		return err
	}
	ws, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()
	ws.WriteMessage(websocket.TextMessage, requestDataBytes)

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			return err
		}
		var data ReturnData
		err = json.Unmarshal(message, &data)
		if err != nil {
			return err
		}
		if data.Type == "rep" {
			if data.Payload.ID == requestId {
				if data.Error != nil {

					ctx.Status(403)
					ctx.WriteString("UnAuthorization")
				}
				if data.Payload.SessionData != nil {
					ctx.Locals("session", data.Payload.SessionData)
					return ctx.Next()
				}

				ctx.Status(403)
				ctx.WriteString("UnAuthorization")
			}
		}
	}

	return nil
}
