package directives

import (
	"context"
	"fmt"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/Folody-Team/Shartube/middleware/passRequest"
	"github.com/Folody-Team/Shartube/util"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/vektah/gqlparser/v2/gqlerror"

	"github.com/Folody-Team/Shartube/LocalTypes"
)

type AuthString string

func AuthDirective(redis *redis.Client) func(ctx context.Context, _ interface{}, next graphql.Resolver) (interface{}, error) {
	return func(ctx context.Context, _ interface{}, next graphql.Resolver) (interface{}, error) {
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
		requestData := LocalTypes.ServiceRequest{
			Url:     "user/decodeToken",
			Header:  nil,
			Payload: &payload,
			From:    "comic/auth",
			Type:    "message",
			ID:      requestId,
		}

		data, err := util.ServiceSender[LocalTypes.AuthPayloadReturn, *interface{}](redis, requestData, true)
		if err != nil {
			return nil, err
		}

		if data.Type == "rep" {
			if data.ID == requestId && data.Url == requestData.From && data.From == requestData.Url {
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

		return nil, &gqlerror.Error{
			Message: "500 Server Error",
		}
	}
}
