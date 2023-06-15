package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/database/comic_session_model"
	"github.com/Folody-Team/Shartube/database/short_comic_model"
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
	"golang.org/x/exp/slices"
)

// CreatedBy is the resolver for the CreatedBy field.
func (r *chapResolver) CreatedBy(ctx context.Context, obj *model.Chap) (*model.User, error) {
	return util.GetUserByID(obj.CreatedByID)
}

// Session is the resolver for the Session field.
func (r *chapResolver) Session(ctx context.Context, obj *model.Chap) (*model.ComicSession, error) {
	comicSessionModel, err := comic_session_model.InitComicSessionModel(r.Client)
	if err != nil {
		return nil, err
	}
	if obj.SessionID == nil {
		return nil, nil
	}
	return comicSessionModel.FindById(*obj.SessionID)
}

// ShortComic is the resolver for the ShortComic field.
func (r *chapResolver) ShortComic(ctx context.Context, obj *model.Chap) (*model.ShortComic, error) {
	ShortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	if obj.SessionID == nil {
		return nil, nil
	}
	return ShortComicModel.FindById(*obj.SessionID)
}

// CreateChap is the resolver for the CreateChap field.
func (r *mutationResolver) CreateChap(ctx context.Context, input model.CreateChapInput) (*model.Chap, error) {
	if input.ShortComicID == nil && input.SessionID == nil {
		return nil, gqlerror.Errorf("you need provider ShorComicID or SessionID")
	}
	comicSessionModel, err := comic_session_model.InitComicSessionModel(r.Client)
	if err != nil {
		return nil, err
	}
	ShortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	CreateIDObject, err := primitive.ObjectIDFromHex(CreateID)
	if err != nil {
		return nil, err
	}
	var comicSessionDoc *model.ComicSession
	if input.SessionID == nil {
		comicSessionDoc = nil
	} else {
		comicSessionDoc, err = comicSessionModel.FindById(*input.SessionID)
		if err != nil {
			return nil, err
		}
		if comicSessionDoc == nil {
			return nil, gqlerror.Errorf("comic session not found")
		}
		if CreateID != comicSessionDoc.CreatedByID {
			return nil, gqlerror.Errorf("Access Denied")
		}
	}
	var ShortComicDoc *model.ShortComic
	if input.ShortComicID == nil {
		ShortComicDoc = nil
	} else {
		ShortComicDoc, err = ShortComicModel.FindById(*input.ShortComicID)
		if err != nil {
			return nil, err
		}
		if ShortComicDoc == nil {
			return nil, gqlerror.Errorf("comic session not found")
		}
		if CreateID != ShortComicDoc.CreatedByID {
			return nil, gqlerror.Errorf("Access Denied")
		}
	}
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}

	ChapID, err := comicChapModel.New(&model.CreateChapInputModel{
		Name:         input.Name,
		Description:  input.Description,
		CreatedByID:  CreateIDObject.Hex(),
		SessionID:    input.SessionID,
		ShortComicID: input.ShortComicID,
	}).Save()
	if err != nil {
		return nil, err
	}
	if comicSessionDoc != nil {
		ComicSessionObjectId, err := primitive.ObjectIDFromHex(comicSessionDoc.ID)
		if err != nil {
			return nil, err
		}
		comicSessionModel.UpdateOne(bson.M{
			"_id": ComicSessionObjectId,
		}, bson.M{
			"$push": bson.M{
				"ChapIds": ChapID,
			},
		})
	}
	if ShortComicDoc != nil {
		ShortComicObjectId, err := primitive.ObjectIDFromHex(ShortComicDoc.ID)
		if err != nil {
			return nil, err
		}
		ShortComicModel.UpdateOne(bson.M{
			"_id": ShortComicObjectId,
		}, bson.M{
			"$push": bson.M{
				"ChapIds": ChapID,
			},
		})
	}
	return comicChapModel.FindById(ChapID.Hex())
}

// AddImageToChap is the resolver for the AddImageToChap field.
func (r *mutationResolver) AddImageToChap(ctx context.Context, chapID string) (*string, error) {
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}

	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	if err != nil {
		return nil, err
	}
	comicChapDoc, err := comicChapModel.FindById(chapID)
	if err != nil {
		return nil, err
	}
	if comicChapDoc == nil {
		return nil, gqlerror.Errorf("comic chap not found")
	}
	if CreateID != comicChapDoc.CreatedByID {
		return nil, gqlerror.Errorf("Access Denied")
	}

	requestId := uuid.New().String()
	payload := struct {
		ID        string                                     `json:"id"`
		SaveData  LocalTypes.UploadedChapImagesSocketPayload `json:"data"`
		EmitTo    string                                     `json:"emit_to"`
		EventName string                                     `json:"event_name"`
	}{
		ID: requestId,
		SaveData: LocalTypes.UploadedChapImagesSocketPayload{
			ChapId: chapID,
		},
		EmitTo:    "comic",
		EventName: "SocketAddImagesToChap",
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
				return &data.Payload.Token, nil

				// return nil, &gqlerror.Error{
				// 	Message: "500 server error",
				// }

			}
		}
	}
}

// UpdateChap is the resolver for the UpdateChap field.
func (r *mutationResolver) UpdateChap(ctx context.Context, chapID string, input model.UpdateChapInput) (*model.Chap, error) {
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	comicChap, err := comicChapModel.FindById(chapID)
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID

	if err != nil {
		return nil, err
	}
	if comicChap == nil {
		return nil, &gqlerror.Error{
			Message: "comic chap not found",
		}
	}
	if CreateID != comicChap.CreatedByID {
		return nil, gqlerror.Errorf("Access Denied")
	}
	// TODO: check if no provider ShortComicID or SessionID
	return comicChapModel.FindOneAndUpdate(bson.M{
		"_id": comicChap.ID,
	}, input)
}

// DeleteChap is the resolver for the DeleteChap field.
func (r *mutationResolver) DeleteChap(ctx context.Context, chapID string) (*model.DeleteResult, error) {
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	comicChap, err := comicChapModel.FindById(chapID)
	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	if err != nil {
		return nil, err
	}
	if comicChap == nil {
		return nil, &gqlerror.Error{
			Message: "comic chap not found",
		}
	}
	if CreateID != comicChap.CreatedByID {
		return nil, gqlerror.Errorf("Access Denied")
	}
	success, err := deleteUtil.DeleteChap(comicChap.ID, r.Client, true)
	if err != nil {
		return nil, err
	}
	return &model.DeleteResult{
		Success: success,
		ID:      comicChap.ID,
	}, nil
}

// DeleteChapImage is the resolver for the DeleteChapImage field.
func (r *mutationResolver) DeleteChapImage(ctx context.Context, chapID string, imageID []string) (*model.Chap, error) {
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}

	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	if err != nil {
		return nil, err
	}
	comicChapDoc, err := comicChapModel.FindById(chapID)
	if err != nil {
		return nil, err
	}
	if comicChapDoc == nil {
		return nil, gqlerror.Errorf("comic chap not found")
	}
	if CreateID != comicChapDoc.CreatedByID {
		return nil, gqlerror.Errorf("Access Denied")
	}
	ComicChapObjectId, err := primitive.ObjectIDFromHex(comicChapDoc.ID)
	if err != nil {
		return nil, err
	}
	// get data from comic model

	chapObjectData := LocalTypes.WsRequest{
		Url:     "subtitle/DeleteSubtitle",
		Header:  nil,
		Payload: imageID,
		From:    "comic/RemoveImageForChap",
		Type:    "message",
	}

	chapObject, err := json.Marshal(chapObjectData)
	if err != nil {
		return nil, err
	}
	r.Ws.WriteMessage(websocket.TextMessage, chapObject)

	for _, v := range imageID {
		imageIndex := slices.IndexFunc(comicChapDoc.Images, func(ir *model.ImageResult) bool {
			return ir.ID == v
		})
		if imageIndex == -1 {
			// return nil, gqlerror.Errorf("image not found")
			continue
		}
		comicChapDoc.Images = util.RemoveIndex(comicChapDoc.Images, imageIndex)
	}
	if _, err := comicChapModel.FindOneAndUpdate(bson.M{
		"_id": ComicChapObjectId,
	}, bson.M{
		"$set": bson.M{
			"Images": comicChapDoc.Images,
		},
	}); err != nil {
		return nil, err
	}
	return comicChapModel.FindById(comicChapDoc.ID)
}

// ChapBySession is the resolver for the ChapBySession field.
func (r *queryResolver) ChapBySession(ctx context.Context, sessionID string) ([]*model.Chap, error) {
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	return comicChapModel.Find(bson.M{"SessionID": sessionID})
}

// Chap returns generated.ChapResolver implementation.
func (r *Resolver) Chap() generated.ChapResolver { return &chapResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type chapResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
