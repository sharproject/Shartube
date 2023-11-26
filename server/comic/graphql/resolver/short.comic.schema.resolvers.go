package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/database/short_comic_model"
	"github.com/Folody-Team/Shartube/directives"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/Folody-Team/Shartube/util/deleteUtil"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	BackgroundUrl := ""

	ShortcomicID, err := ShortComicModel.New(&model.CreateShortComicInputModel{
		CreatedByID: CreateID,
		Name:        input.Name,
		Description: input.Description,
		Thumbnail:   &ThumbnailUrl,
		Background:  &BackgroundUrl,
		Views:       0,
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
		ID:   uuid.NewString(),
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
	requestTokensList := []string{}
	if (input.Thumbnail != nil && *input.Thumbnail) || (input.Background != nil && *input.Background) {
		if *input.Thumbnail {
			requestTokensList = append(requestTokensList, "Thumbnail")
		}
		if *input.Background {
			requestTokensList = append(requestTokensList, "Background")
		}
	} else {
		return &model.CreateShortComicResponse{
			ShortComic:  ShortComicDoc,
			UploadToken: nil,
		}, nil
	}
	requestId := uuid.New().String()
	type GenUploadTokenPayload struct {
		ID        string                                              `json:"id"`
		SaveData  LocalTypes.UploadComicThumbnailAndBackgroundPayload `json:"data"`
		EmitTo    string                                              `json:"emit_to"`
		EventName string                                              `json:"event_name"`
	}
	payload := []GenUploadTokenPayload{}
	for _, v := range requestTokensList {
		payload = append(payload, GenUploadTokenPayload{
			ID: requestId,
			SaveData: LocalTypes.UploadComicThumbnailAndBackgroundPayload{
				ComicId: ShortComicDoc.ID,
			},
			EmitTo:    "ShortComic",
			EventName: fmt.Sprintf("SocketChangeComic%s", v),
		})
	}
	requestData := LocalTypes.WsRequest{
		Url:     "upload_token_registry/genToken",
		Header:  nil,
		Payload: &payload,
		From:    "ShortComic/addImages",
		Type:    "message",
		ID:      requestId,
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
		var tmp_data LocalTypes.WsReturnData[any, *any]
		err = json.Unmarshal(message, &tmp_data)
		if err != nil {
			return nil, err
		}
		if tmp_data.Type == "rep" {
			if tmp_data.ID == requestId && tmp_data.From == requestData.Url {
				var data LocalTypes.WsReturnData[LocalTypes.GetUploadTokensReturn, *interface{}]
				err = json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				if data.Error != nil {
					return nil, &gqlerror.Error{
						Message: *data.Error,
					}
				}
				return &model.CreateShortComicResponse{
					ShortComic:  ShortComicDoc,
					UploadToken: data.Payload.Token,
				}, nil
			}
		}
	}
}

// UpdateShortComic is the resolver for the updateShortComic field.
func (r *mutationResolver) UpdateShortComic(ctx context.Context, shortComicID string, input model.UpdateShortComicInput) (*model.UpdateShortComicResponse, error) {
	ShortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID

	ShortComic, err := ShortComicModel.FindById(shortComicID)
	if err != nil {
		return nil, err
	}
	if ShortComic == nil {
		return nil, &gqlerror.Error{
			Message: "comic not found",
		}
	}
	if ShortComic.CreatedByID != CreateID {
		return nil, &gqlerror.Error{
			Message: "Access Denied",
		}
	}
	ShortComicObjectId, err := primitive.ObjectIDFromHex(ShortComic.ID)
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
	ShortComicDoc, err := ShortComicModel.FindOneAndUpdate(bson.M{
		"_id": ShortComicObjectId,
	}, bson.M{"$set": updateData})
	if err != nil {
		return nil, err
	}
	requestTokensList := []string{}
	if (input.Thumbnail != nil && *input.Thumbnail) || (input.Background != nil && *input.Background) {
		if *input.Thumbnail {
			requestTokensList = append(requestTokensList, "Thumbnail")
		}
		if *input.Background {
			requestTokensList = append(requestTokensList, "Background")
		}
	} else {
		return &model.UpdateShortComicResponse{
			ShortComic:  ShortComicDoc,
			UploadToken: nil,
		}, nil
	}
	requestId := uuid.New().String()
	type GenUploadTokenPayload struct {
		ID        string                                              `json:"id"`
		SaveData  LocalTypes.UploadComicThumbnailAndBackgroundPayload `json:"data"`
		EmitTo    string                                              `json:"emit_to"`
		EventName string                                              `json:"event_name"`
	}
	payload := []GenUploadTokenPayload{}
	for _, v := range requestTokensList {
		payload = append(payload, GenUploadTokenPayload{
			ID: requestId,
			SaveData: LocalTypes.UploadComicThumbnailAndBackgroundPayload{
				ComicId: ShortComicDoc.ID,
			},
			EmitTo:    "ShortComic",
			EventName: fmt.Sprintf("SocketChangeComic%s", v),
		})
	}
	requestData := LocalTypes.WsRequest{
		Url:     "upload_token_registry/genToken",
		Header:  nil,
		Payload: &payload,
		From:    "ShortComic/updateShortComic",
		Type:    "message",
		ID:      requestId,
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
		var tmp_data LocalTypes.WsReturnData[any, *any]
		err = json.Unmarshal(message, &tmp_data)
		if err != nil {
			return nil, err
		}
		if tmp_data.Type == "rep" {
			if tmp_data.ID == requestId && tmp_data.From == requestData.Url {
				var data LocalTypes.WsReturnData[LocalTypes.GetUploadTokensReturn, *interface{}]
				err = json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				if data.Error != nil {
					return nil, &gqlerror.Error{
						Message: *data.Error,
					}
				}
				return &model.UpdateShortComicResponse{
					ShortComic:  ShortComicDoc,
					UploadToken: data.Payload.Token,
				}, nil
			}
		}
	}
}

// DeleteShortComic is the resolver for the DeleteShortComic field.
func (r *mutationResolver) DeleteShortComic(ctx context.Context, shortComicID string) (*model.DeleteResult, error) {
	ShortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	ShortComicData, err := ShortComicModel.FindById(shortComicID)
	if err != nil {
		return nil, err
	}
	if ShortComicData == nil {
		return nil, &gqlerror.Error{
			Message: "comic not found",
		}
	}
	if ShortComicData.CreatedByID != CreateID {
		return nil, &gqlerror.Error{
			Message: "Access Denied",
		}
	}
	success, err := deleteUtil.DeleteShortComic(shortComicID, r.Client)
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
		ID:   uuid.NewString(),
	}

	comicObject, err := json.Marshal(comicObjectData)
	if err != nil {
		return nil, err
	}
	r.Ws.WriteMessage(websocket.TextMessage, comicObject)

	return &model.DeleteResult{
		Success: success,
		ID:      ShortComicData.ID,
	}, nil
}

// ShortComics is the resolver for the ShortComics field.
func (r *queryResolver) ShortComics(ctx context.Context) ([]*model.ShortComic, error) {
	ShortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	return ShortComicModel.Find(bson.D{})
}

// TopViewShortComics is the resolver for the TopViewShortComics field.
func (r *queryResolver) TopViewShortComics(ctx context.Context) ([]*model.ShortComic, error) {
	shortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	limit := int64(20)
	return shortComicModel.Find(bson.M{}, &options.FindOptions{
		Sort: bson.M{
			"views": 1,
		},
		Limit: &limit,
	})
}

// ShortComicByID is the resolver for the ShortComicByID field.
func (r *queryResolver) ShortComicByID(ctx context.Context, id string) (*model.ShortComic, error) {
	ShortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	return ShortComicModel.FindById(id)
}

// Chap is the resolver for the Chap field.
func (r *shortComicResolver) Chap(ctx context.Context, obj *model.ShortComic) ([]*model.Chap, error) {
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}

	comicChaps := []*model.Chap{}

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
