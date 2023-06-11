package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/short_comic_model"
	"github.com/Folody-Team/Shartube/directives"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.mongodb.org/mongo-driver/bson"
)

// CreateShortComic is the resolver for the createShortComic field.
func (r *mutationResolver) CreateShortComic(ctx context.Context, input model.CreateShortComicInput) (*model.CreateShortComicResponse, error) {
	ShortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	if err != nil {
		return nil, err
	}
	ThumbnailUrl := ""

	ShortcomicID, err := ShortComicModel.New(&model.CreateShortComicInputModel{
		CreatedByID: CreateID,
		Name:        input.Name,
		Description: input.Description,
		Thumbnail:   &ThumbnailUrl,
	}).Save()

	if err != nil {
		return nil, err
	}
	ShortComicObjectData := LocalTypes.WsRequest{
		Url:    "user/UpdateUserShortShortComic",
		Header: nil,
		Payload: bson.M{
			"_id":    ShortcomicID.Hex(),
			"UserID": CreateID,
		},
		From: "ShortShortComic/createShortComic",
		Type: "message",
	}

	ShortComicObject, err := json.Marshal(ShortComicObjectData)
	if err != nil {
		return nil, err
	}
	r.Ws.WriteMessage(websocket.TextMessage, []byte(ShortComicObject))
	// get data from Shortcomic model
	ShortComicDoc, err := ShortComicModel.FindById(ShortcomicID.Hex())
	if err != nil {
		return nil, err
	}
	if input.Thumbnail != nil && *input.Thumbnail {
		requestId := uuid.New().String()
		payload := struct {
			ID        string                                   `json:"id"`
			SaveData  LocalTypes.UploadedComicThumbnailPayload `json:"data"`
			EmitTo    string                                   `json:"emit_to"`
			EventName string                                   `json:"event_name"`
		}{
			ID: requestId,
			SaveData: LocalTypes.UploadedComicThumbnailPayload{
				ComicId: ShortComicDoc.ID,
			},
			EmitTo:    "ShortComic",
			EventName: "SocketChangeComicThumbnail",
		}
		requestData := LocalTypes.WsRequest{
			Url:     "upload_token_registry/genToken",
			Header:  nil,
			Payload: &payload,
			From:    "ShortComic/addImages",
			Type:    "message",
		}
		requestDataBytes, err := json.Marshal(requestData)
		if err != nil {
			return nil, err
		}
		if err != nil {
			return nil, err
		}
		r.Ws.WriteMessage(websocket.TextMessage, requestDataBytes)
		for {
			_, message, err := r.Ws.ReadMessage()
			if err != nil {
				return nil, err
			}
			var data LocalTypes.WsReturnData[LocalTypes.GetUploadTokenReturn]
			err = json.Unmarshal(message, &data)
			if err != nil {
				return nil, err
			}
			if data.Type == "rep" {
				if data.Payload.ID == requestId {
					if data.Error != nil {
						return nil, &gqlerror.Error{
							Message: *data.Error,
						}
					}
					return &model.CreateShortComicResponse{
						ShortComic:  ShortComicDoc,
						UploadToken: &data.Payload.Token,
					}, nil

					// return nil, &gqlerror.Error{
					// 	Message: "500 server error",
					// }

				}
			}
		}
	} else {
		return &model.CreateShortComicResponse{
			ShortComic:  ShortComicDoc,
			UploadToken: nil,
		}, nil
	}
}

// UpdateShortComic is the resolver for the updateShortComic field.
func (r *mutationResolver) UpdateShortComic(ctx context.Context, shortComicID string, input model.UpdateShortComicInput) (*model.UpdateShortComicResponse, error) {
	panic(fmt.Errorf("not implemented"))
}

// DeleteShortComic is the resolver for the DeleteShortComic field.
func (r *mutationResolver) DeleteShortComic(ctx context.Context, shortComicID string) (*model.DeleteResult, error) {
	panic(fmt.Errorf("not implemented"))
}

// ShortComics is the resolver for the ShortComics field.
func (r *queryResolver) ShortComics(ctx context.Context) ([]*model.ShortComic, error) {
	panic(fmt.Errorf("not implemented"))
}

// CreatedBy is the resolver for the CreatedBy field.
func (r *shortComicResolver) CreatedBy(ctx context.Context, obj *model.ShortComic) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

// Chap is the resolver for the Chap field.
func (r *shortComicResolver) Chap(ctx context.Context, obj *model.ShortComic) ([]*model.Chap, error) {
	panic(fmt.Errorf("not implemented"))
}

// ShortComic returns generated.ShortComicResolver implementation.
func (r *Resolver) ShortComic() generated.ShortComicResolver { return &shortComicResolver{r} }

type shortComicResolver struct{ *Resolver }
