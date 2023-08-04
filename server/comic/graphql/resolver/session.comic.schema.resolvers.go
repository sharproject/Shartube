package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/database/comic_session_model"
	"github.com/Folody-Team/Shartube/directives"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/Folody-Team/Shartube/util/deleteUtil"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Comic is the resolver for the Comic field.
func (r *comicSessionResolver) Comic(ctx context.Context, obj *model.ComicSession) (*model.Comic, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	return comicModel.FindById(obj.ComicID)
}

// Chaps is the resolver for the Chaps field.
func (r *comicSessionResolver) Chaps(ctx context.Context, obj *model.ComicSession) ([]*model.Chap, error) {
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	AllChaps := []*model.Chap{}
	for _, ChapId := range obj.ChapIds {
		data, err := comicChapModel.FindById(ChapId)
		if err != nil {
			return nil, err
		}
		AllChaps = append(AllChaps, data)
	}
	return AllChaps, nil
}

// CreateComicSession is the resolver for the CreateComicSession field.
func (r *mutationResolver) CreateComicSession(ctx context.Context, input model.CreateComicSessionInput) (*model.CreateComicSessionResponse, error) {
	comicSessionModel, err := comic_session_model.InitComicSessionModel(r.Client)
	if err != nil {
		return nil, err
	}
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	CreateIDObject, err := primitive.ObjectIDFromHex(CreateID)
	if err != nil {
		return nil, err
	}
	comicDoc, err := comicModel.FindById(input.ComicID)
	if err != nil {
		return nil, err
	}
	if comicDoc == nil {
		return nil, gqlerror.Errorf("comic not found")
	}
	if CreateID != comicDoc.CreatedByID {
		return nil, gqlerror.Errorf("Access Denied")
	}
	ThumbnailUrl := ""

	sessionID, err := comicSessionModel.New(&model.CreateComicSessionInputModel{
		Name:        input.Name,
		Description: input.Description,
		CreatedByID: CreateIDObject.Hex(),
		ComicID:     input.ComicID,
		Thumbnail:   &ThumbnailUrl,
		Views:       0,
	}).Save()
	if err != nil {
		return nil, err
	}
	ComicObjectId, err := primitive.ObjectIDFromHex(input.ComicID)

	if err != nil {
		return nil, err
	}
	comicModel.UpdateOne(bson.M{
		"_id": ComicObjectId,
	}, bson.M{
		"$push": bson.M{
			"sessionId": sessionID,
		},
	})
	comicSessionDoc, err := comicSessionModel.FindById(sessionID.Hex())
	if err != nil {
		return nil, err
	}

	if input.Thumbnail != nil && *input.Thumbnail {
		requestId := uuid.New().String()
		payload := struct {
			ID        string                                        `json:"id"`
			SaveData  LocalTypes.UploadSessionComicThumbnailPayload `json:"data"`
			EmitTo    string                                        `json:"emit_to"`
			EventName string                                        `json:"event_name"`
		}{
			ID: requestId,
			SaveData: LocalTypes.UploadSessionComicThumbnailPayload{
				ComicSessionId: comicSessionDoc.ID,
			},
			EmitTo:    "comic",
			EventName: "SocketChangeComicSessionThumbnail",
		}
		requestData := LocalTypes.WsRequest{
			Url:     "upload_token_registry/genToken",
			Header:  nil,
			Payload: &payload,
			From:    "comic/addImages",
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
			var data LocalTypes.WsReturnData[LocalTypes.GetUploadTokenReturn, *any]
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
					return &model.CreateComicSessionResponse{
						ComicSession: comicSessionDoc,
						UploadToken:  &data.Payload.Token,
					}, nil

					// return nil, &gqlerror.Error{
					// 	Message: "500 server error",
					// }

				}
			}
		}
	} else {
		return &model.CreateComicSessionResponse{
			ComicSession: comicSessionDoc,
			UploadToken:  nil,
		}, nil
	}
}

// UpdateComicSession is the resolver for the updateComicSession field.
func (r *mutationResolver) UpdateComicSession(ctx context.Context, sessionID string, input *model.UpdateComicSessionInput) (*model.UpdateComicSessionResponse, error) {
	comicSessionModel, err := comic_session_model.InitComicSessionModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID

	comicSession, err := comicSessionModel.FindById(sessionID)
	if err != nil {
		return nil, err
	}
	if comicSession == nil {
		return nil, &gqlerror.Error{
			Message: "comic session not found",
		}
	}
	if CreateID != comicSession.CreatedByID {
		return nil, gqlerror.Errorf("Access Denied")
	}

	updateData := bson.M{}
	if input.Description != nil {
		updateData["description"] = input.Description
	}
	if input.Name != nil {
		updateData["name"] = input.Name
	}

	comicSessionObjectId, err := primitive.ObjectIDFromHex(comicSession.ID)
	if err != nil {
		return nil, err
	}
	comicSessionDoc, err := comicSessionModel.FindOneAndUpdate(bson.M{
		"_id": comicSessionObjectId,
	}, bson.M{
		"$set": updateData,
	})
	if err != nil {
		return nil, err
	}
	if input.Thumbnail != nil && *input.Thumbnail {
		requestId := uuid.New().String()
		payload := struct {
			ID        string                                        `json:"id"`
			SaveData  LocalTypes.UploadSessionComicThumbnailPayload `json:"data"`
			EmitTo    string                                        `json:"emit_to"`
			EventName string                                        `json:"event_name"`
		}{
			ID: requestId,
			SaveData: LocalTypes.UploadSessionComicThumbnailPayload{
				ComicSessionId: comicSessionDoc.ID,
			},
			EmitTo:    "comic",
			EventName: "SocketChangeComicSessionThumbnail",
		}
		requestData := LocalTypes.WsRequest{
			Url:     "upload_token_registry/genToken",
			Header:  nil,
			Payload: &payload,
			From:    "comic/updateComicSession",
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
			var data LocalTypes.WsReturnData[LocalTypes.GetUploadTokenReturn, *any]
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
					return &model.UpdateComicSessionResponse{
						ComicSession: comicSession,
						UploadToken:  &data.Payload.Token,
					}, nil

				}
			}
		}
	} else {
		return &model.UpdateComicSessionResponse{
			ComicSession: comicSessionDoc,
			UploadToken:  nil,
		}, nil
	}
}

// DeleteComicSession is the resolver for the DeleteComicSession field.
func (r *mutationResolver) DeleteComicSession(ctx context.Context, sessionID string) (*model.DeleteResult, error) {
	ComicSessionModel, err := comic_session_model.InitComicSessionModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	comicSession, err := ComicSessionModel.FindById(sessionID)
	if err != nil {
		return nil, err
	}
	if comicSession == nil {
		return nil, &gqlerror.Error{
			Message: "comic session not found",
		}
	}
	if CreateID != comicSession.CreatedByID {
		return nil, gqlerror.Errorf("Access Denied")
	}
	success, err := deleteUtil.DeleteComicSession(sessionID, r.Client, true)
	if err != nil {
		return nil, err
	}
	return &model.DeleteResult{
		Success: success,
		ID:      comicSession.ID,
	}, nil
}

// SessionByComic is the resolver for the SessionByComic field.
func (r *queryResolver) SessionByComic(ctx context.Context, comicID string) ([]*model.ComicSession, error) {
	comicSessionModel, err := comic_session_model.InitComicSessionModel(r.Client)
	if err != nil {
		return nil, err
	}
	return comicSessionModel.Find(bson.M{"ComicID": comicID})
}

// SessionByID is the resolver for the SessionByID field.
func (r *queryResolver) SessionByID(ctx context.Context, id string) (*model.ComicSession, error) {
	comicSessionModel, err := comic_session_model.InitComicSessionModel(r.Client)
	if err != nil {
		return nil, err
	}
	return comicSessionModel.FindById(id)
}

// ComicSession returns generated.ComicSessionResolver implementation.
func (r *Resolver) ComicSession() generated.ComicSessionResolver { return &comicSessionResolver{r} }

type comicSessionResolver struct{ *Resolver }
