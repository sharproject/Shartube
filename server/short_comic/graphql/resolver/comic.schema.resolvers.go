package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/directives"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/Folody-Team/Shartube/util"
	"github.com/Folody-Team/Shartube/util/deleteUtil"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreateShortComic is the resolver for the createShortComic field.
func (r *mutationResolver) CreateShortComic(ctx context.Context, input model.CreateShortComicInput) (*model.CreateShortComicResponse, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	if err != nil {
		return nil, err
	}
	ThumbnailUrl := ""

	comicID, err := comicModel.New(&model.CreateShortComicInputModel{
		CreatedByID: CreateID,
		Name:        input.Name,
		Description: input.Description,
		Thumbnail:   &ThumbnailUrl,
	}).Save()

	if err != nil {
		return nil, err
	}
	comicObjectData := LocalTypes.WsRequest{
		Url:    "user/UpdateUserShortComic",
		Header: nil,
		Payload: bson.M{
			"_id":    comicID.Hex(),
			"UserID": CreateID,
		},
		From: "ShortComic/createComic",
		Type: "message",
	}

	comicObject, err := json.Marshal(comicObjectData)
	if err != nil {
		return nil, err
	}
	r.Ws.WriteMessage(websocket.TextMessage, []byte(comicObject))
	// get data from comic model
	comicDoc, err := comicModel.FindById(comicID.Hex())
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
				ComicId: comicDoc.ID,
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
						ShortComic:  comicDoc,
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
			ShortComic:  comicDoc,
			UploadToken: nil,
		}, nil
	}
}

// UpdateShortComic is the resolver for the updateShortComic field.
func (r *mutationResolver) UpdateShortComic(ctx context.Context, shortComicID string, input model.UpdateShortComicInput) (*model.UpdateShortComicResponse, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID

	comic, err := comicModel.FindById(shortComicID)
	if err != nil {
		return nil, err
	}
	if comic == nil {
		return nil, &gqlerror.Error{
			Message: "comic not found",
		}
	}
	if comic.CreatedByID != CreateID {
		return nil, &gqlerror.Error{
			Message: "Access Denied",
		}
	}
	comicObjectId, err := primitive.ObjectIDFromHex(comic.ID)
	if err != nil {
		return nil, err
	}
	updateData := bson.M{}
	if input.Description != nil {
		updateData["description"] = input.Description
	}
	if input.Name != nil {
		updateData["name"] = input.Name
	}
	comicDoc, err := comicModel.FindOneAndUpdate(bson.M{
		"_id": comicObjectId,
	}, bson.M{"$set": updateData})
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
				ComicId: comicDoc.ID,
			},
			EmitTo:    "ShortComic",
			EventName: "SocketChangeComicThumbnail",
		}
		requestData := LocalTypes.WsRequest{
			Url:     "upload_token_registry/genToken",
			Header:  nil,
			Payload: &payload,
			From:    "ShortComic/updateShortComic",
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
					return &model.UpdateShortComicResponse{
						ShortComic:  comicDoc,
						UploadToken: &data.Payload.Token,
					}, nil
				}
			}
		}
	} else {
		return &model.UpdateShortComicResponse{
			ShortComic:  comicDoc,
			UploadToken: nil,
		}, nil
	}
}

// DeleteShortComic is the resolver for the DeleteShortComic field.
func (r *mutationResolver) DeleteShortComic(ctx context.Context, shortComicID string) (*model.DeleteResult, error) {
	ComicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	ComicData, err := ComicModel.FindById(shortComicID)
	if err != nil {
		return nil, err
	}
	if ComicData == nil {
		return nil, &gqlerror.Error{
			Message: "comic not found",
		}
	}
	if ComicData.CreatedByID != CreateID {
		return nil, &gqlerror.Error{
			Message: "Access Denied",
		}
	}
	success, err := deleteUtil.DeleteComic(shortComicID, r.Client)
	if err != nil {
		return nil, err
	}

	comicObjectData := LocalTypes.WsRequest{
		Url:    "user/DeleteShortComic",
		Header: nil,
		Payload: bson.M{
			"_id":    shortComicID,
			"UserID": CreateID,
		},
		From: "ShortComic/DeleteComic",
		Type: "message",
	}

	comicObject, err := json.Marshal(comicObjectData)
	if err != nil {
		return nil, err
	}
	r.Ws.WriteMessage(websocket.TextMessage, comicObject)

	return &model.DeleteResult{
		Success: success,
		ID:      ComicData.ID,
	}, nil
}

// ShortComics is the resolver for the ShortComics field.
func (r *queryResolver) ShortComics(ctx context.Context) ([]*model.ShortComic, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	return comicModel.Find(bson.D{})
}

// CreatedBy is the resolver for the CreatedBy field.
func (r *shortComicResolver) CreatedBy(ctx context.Context, obj *model.ShortComic) (*model.User, error) {
	return util.GetUserByID(obj.CreatedByID)
}

// Chap is the resolver for the Chap field.
func (r *shortComicResolver) Chap(ctx context.Context, obj *model.ShortComic) ([]*model.ShortComicChap, error) {
	comicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
	if err != nil {
		return nil, err
	}

	comicChaps := []*model.ShortComicChap{}

	for _, id := range obj.ChapIDs {
		chap, err := comicChapModel.FindById(id)
		if err != nil {
			return nil, err
		}
		comicChaps = append(comicChaps, chap)
	}

	return comicChaps, nil
}

// ShortComic returns generated.ShortComicResolver implementation.
func (r *Resolver) ShortComic() generated.ShortComicResolver { return &shortComicResolver{r} }

type shortComicResolver struct{ *Resolver }
