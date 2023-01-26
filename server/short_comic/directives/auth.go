package directives

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/Folody-Team/Shartube/middleware/passRequest"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/vektah/gqlparser/v2/gqlerror"

	"github.com/Folody-Team/Shartube/LocalTypes"
)

type AuthString string

func Auth(ctx context.Context, _ interface{}, next graphql.Resolver) (interface{}, error) {
	request := passRequest.CtxValue(ctx)

	auth := request.Header.Clone().Get("Authorization")
	if auth == "" {
		return nil, &gqlerror.Error{
			Message: "Access Denied",
		}
	}
	bearer := "Bearer "
	auth = strings.Trim(strings.Replace(auth, bearer, "", -1), " ")
	u := url.URL{
		Scheme: "ws",
		Host:   os.Getenv("WS_HOST") + ":" + os.Getenv("WS_PORT"),
		Path:   "/",
	}
	teamID := request.Header.Clone().Get("team-id")
	fmt.Printf("teamID: %v\n", teamID)
	requestId := uuid.New().String()
	payload := struct {
		Token  string `json:"token"`
		ID     string `json:"id"`
		TeamId string `json:"teamID"`
	}{
		Token:  auth,
		ID:     requestId,
		TeamId: teamID,
	}
	requestData := LocalTypes.WsRequest{
		Url:     "user/decodeToken",
		Header:  nil,
		Payload: &payload,
		From:    "comic/auth",
		Type:    "message",
	}
	requestDataBytes, err := json.Marshal(requestData)
	if err != nil {
		return nil, err
	}
	ws, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		return nil, err
	}
	defer ws.Close()
	ws.WriteMessage(websocket.TextMessage, requestDataBytes)

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			return nil, err
		}
		var data LocalTypes.WsReturnData[LocalTypes.AuthPayloadReturn]
		err = json.Unmarshal(message, &data)
		if err != nil {
			return nil, err
		}
		if data.Type == "rep" {
			if data.Payload.ID == requestId {
				if data.Error != nil {
					return nil, &gqlerror.Error{
						Message: "Access Denied",
					}
				}
				if data.Payload.SessionData != nil {
					return next(context.WithValue(ctx, AuthString("session"), data.Payload.SessionData))
				}

				return nil, &gqlerror.Error{
					Message: "Access Denied",
				}

			}
		}
	}

}