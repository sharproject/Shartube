package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/database/comic_session_model"
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

// Session is the resolver for the session field.
func (r *comicResolver) Session(ctx context.Context, obj *model.Comic) ([]*model.ComicSession, error) {
	comicSessionModel, err := comic_session_model.InitComicSessionModel(r.Client)
	if err != nil {
		return nil, err
	}
	AllComicSession := []*model.ComicSession{}
	for _, v := range obj.SessionID {
		data, err := comicSessionModel.FindById(v)
		if err != nil {
			return nil, err
		}
		AllComicSession = append(AllComicSession, data)
	}
	return AllComicSession, nil
}

// CreateComic is the resolver for the createComic field.
func (r *mutationResolver) CreateComic(ctx context.Context, input model.CreateComicInput) (*model.CreateComicResponse, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	if err != nil {
		return nil, err
	}
	ThumbnailUrl := ""

	comicID, err := comicModel.New(&model.CreateComicInputModel{
		CreatedByID: CreateID,
		Name:        input.Name,
		Description: input.Description,
		Thumbnail:   &ThumbnailUrl,
	}).Save()

	if err != nil {
		return nil, err
	}
	comicObjectData := LocalTypes.WsRequest{
		Url:    "user/updateUserComic",
		Header: nil,
		Payload: bson.M{
			"_id":    comicID.Hex(),
			"UserID": CreateID,
		},
		From: "comic/createComic",
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
			EmitTo:    "comic",
			EventName: "SocketChangeComicThumbnail",
		}
		requestData := LocalTypes.WsRequest{
			Url:     "upload_token_registry/genToken",
			Header:  nil,
			Payload: &payload,
			From:    "comic/addImages",
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
					return &model.CreateComicResponse{
						Comic:       comicDoc,
						UploadToken: &data.Payload.Token,
					}, nil

					// return nil, &gqlerror.Error{
					// 	Message: "500 server error",
					// }

				}
			}
		}
	} else {
		return &model.CreateComicResponse{
			Comic:       comicDoc,
			UploadToken: nil,
		}, nil
	}
}

// UpdateComic is the resolver for the updateComic field.
func (r *mutationResolver) UpdateComic(ctx context.Context, comicID string, input model.UpdateComicInput) (*model.UploadComicResponse, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID

	comic, err := comicModel.FindById(comicID)
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

	updateData := bson.M{}
	if input.Description != nil {
		updateData["description"] = input.Description
	}
	if input.Name != nil {
		updateData["name"] = input.Name
	}
	comicObjectId, err := primitive.ObjectIDFromHex(comic.ID)
	if err != nil {
		return nil, err
	}
	comicDoc, err := comicModel.FindOneAndUpdate(bson.M{
		"_id": comicObjectId,
	}, bson.M{
		"$set": updateData,
	})
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
			EmitTo:    "comic",
			EventName: "SocketChangeComicThumbnail",
		}
		requestData := LocalTypes.WsRequest{
			Url:     "upload_token_registry/genToken",
			Header:  nil,
			Payload: &payload,
			From:    "comic/updateComic",
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
				if data.Payload.ID == payload.ID {
					if data.Error != nil {
						return nil, &gqlerror.Error{
							Message: *data.Error,
						}
					}
					return &model.UploadComicResponse{
						Comic:       comicDoc,
						UploadToken: &data.Payload.Token,
					}, nil
				}
			}
		}
	} else {
		return &model.UploadComicResponse{
			Comic:       comicDoc,
			UploadToken: nil,
		}, nil
	}
}

// DeleteComic is the resolver for the DeleteComic field.
func (r *mutationResolver) DeleteComic(ctx context.Context, comicID string) (*model.DeleteResult, error) {
	ComicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	ComicData, err := ComicModel.FindById(comicID)
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
	success, err := deleteUtil.DeleteComic(comicID, r.Client)
	if err != nil {
		return nil, err
	}

	comicObjectData := LocalTypes.WsRequest{
		Url:    "user/DeleteComic",
		Header: nil,
		Payload: bson.M{
			"_id":    comicID,
			"UserID": CreateID,
		},
		From: "comic/DeleteComic",
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

// Comics is the resolver for the Comics field.
func (r *queryResolver) Comics(ctx context.Context) ([]*model.Comic, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	return comicModel.Find(bson.D{})
}

// Comic returns generated.ComicResolver implementation.
func (r *Resolver) Comic() generated.ComicResolver { return &comicResolver{r} }

type comicResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *comicResolver) CreatedBy(ctx context.Context, obj *model.Comic) (*model.User, error) {
	return util.GetUserByID(obj.CreatedByID)
}
