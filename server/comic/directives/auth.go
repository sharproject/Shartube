package directives

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/middleware/passRequest"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type AuthString string

func AuthDirective(ctx context.Context, _ interface{}, next graphql.Resolver) (interface{}, error) {
	request := passRequest.CtxValue(ctx)

	auth := request.Header.Clone().Get("Authorization")
	if auth == "" {
		return nil, &gqlerror.Error{
			Message: "Access Denied",
		}
	}
	bearer := "Bearer "
	auth = strings.Trim(strings.Replace(auth, bearer, "", -1), " ")

	teamID := request.Header.Clone().Get("team-id")
	fmt.Printf("teamID: %v\n", teamID)
	// requestId := uuid.New().String()
	// payload := struct {
	// 	Token  string `json:"token"`
	// 	ID     string `json:"id"`
	// 	TeamId string `json:"teamID"`
	// }{
	// 	Token:  auth,
	// 	ID:     requestId,
	// 	TeamId: teamID,
	// }
	// requestData := LocalTypes.ServiceRequest{
	// 	Url:     "user/decodeToken",
	// 	Header:  nil,
	// 	Payload: &payload,
	// 	From:    "comic/auth",
	// 	Type:    "message",
	// 	ID:      requestId,
	// }

	// data, err := util.ServiceSender[LocalTypes.AuthPayloadReturn, *interface{}](redis, requestData, true)
	// if err != nil {
	// 	return nil, err
	// }

	// if data.Type == "rep" {
	// 	if data.ID == requestId && data.Url == requestData.From && data.From == requestData.Url {
	// 		if data.Error != nil {
	// 			return nil, &gqlerror.Error{
	// 				Message: "Access Denied",
	// 			}
	// 		}
	// 		if data.Payload.SessionData != nil {
	// 			return next(context.WithValue(ctx, AuthString("session"), data.Payload.SessionData))
	// 		}

	// 		return nil, &gqlerror.Error{
	// 			Message: "Access Denied",
	// 		}

	// 	}
	// }

	// return nil, &gqlerror.Error{
	// 	Message: "500 Server Error",
	// }
	// make request to user server to decode token using the header authorization and team-id
	req, err := http.NewRequest(http.MethodGet, "http://shartube-user-server:8080/private/decodeToken", bytes.NewBuffer([]byte(nil)))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", auth)
	req.Header.Set("team-id", teamID)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return nil, &gqlerror.Error{
			Message: "Access Denied",
		}
	}
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var payload LocalTypes.AuthPayloadReturn
	err = json.Unmarshal(respBody, &payload)
	if err != nil {
		return nil, err
	}
	if payload.SessionData != nil {
		return next(context.WithValue(ctx, AuthString("session"), payload.SessionData))
	}

	return nil, &gqlerror.Error{
		Message: "Access Denied",
	}
}
