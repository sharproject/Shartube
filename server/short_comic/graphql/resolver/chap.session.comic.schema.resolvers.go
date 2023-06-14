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
	"golang.org/x/exp/slices"
)

// CreateShortComicChap is the resolver for the CreateShortComicChap field.
func (r *mutationResolver) CreateShortComicChap(ctx context.Context, input model.CreateShortComicChapInput) (*model.ShortComicChap, error) {
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
		return nil, gqlerror.Errorf("comic session not found")
	}
	if CreateID != comicDoc.CreatedByID {
		return nil, gqlerror.Errorf("Access Denied")
	}
	comicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
	if err != nil {
		return nil, err
	}

	ChapID, err := comicChapModel.New(&model.CreateShortComicChapInputModel{
		Name:        input.Name,
		Description: input.Description,
		CreatedByID: CreateIDObject.Hex(),
		ComicID:     input.ComicID,
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
			"ChapIDs": ChapID,
		},
	})
	return comicChapModel.FindById(ChapID.Hex())
}

// AddImageToChap is the resolver for the AddImageToChap field.
func (r *mutationResolver) AddImageToChap(ctx context.Context, chapID string) (*string, error) {
	comicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
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
		EmitTo:    "ShortComic",
		EventName: "SocketAddImagesToChap",
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
				return &data.Payload.Token, nil

				// return nil, &gqlerror.Error{
				// 	Message: "500 server error",
				// }

			}
		}
	}
}

// UpdateShortComicChap is the resolver for the updateShortComicChap field.
func (r *mutationResolver) UpdateShortComicChap(ctx context.Context, chapID string, input model.UpdateShortComicChapInput) (*model.ShortComicChap, error) {
	comicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
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
	return comicChapModel.FindOneAndUpdate(bson.M{
		"_id": comicChap.ID,
	}, input)
}

// DeleteShortComicChap is the resolver for the DeleteShortComicChap field.
func (r *mutationResolver) DeleteShortComicChap(ctx context.Context, chapID string) (*model.DeleteResult, error) {
	comicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
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

// DeleteShortComicChapImage is the resolver for the DeleteShortComicChapImage field.
func (r *mutationResolver) DeleteShortComicChapImage(ctx context.Context, chapID string, imageID []string) (*model.ShortComicChap, error) {
	comicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
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
		From:    "ShortComic/RemoveImageForChap",
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

// ChapByShortComic is the resolver for the ChapByShortComic field.
func (r *queryResolver) ChapByShortComic(ctx context.Context, comicID string) ([]*model.ShortComicChap, error) {
	comicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	comicObjectId, err := primitive.ObjectIDFromHex(comicID)
	if err != nil {
		return nil, err
	}
	return comicChapModel.Find(bson.M{
		"ComicID": comicObjectId,
	})
}

// CreatedBy is the resolver for the CreatedBy field.
func (r *shortComicChapResolver) CreatedBy(ctx context.Context, obj *model.ShortComicChap) (*model.User, error) {
	return util.GetUserByID(obj.CreatedByID)
}

// Comic is the resolver for the Comic field.
func (r *shortComicChapResolver) Comic(ctx context.Context, obj *model.ShortComicChap) (*model.ShortComic, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	return comicModel.FindById(obj.ComicID)
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// ShortComicChap returns generated.ShortComicChapResolver implementation.
func (r *Resolver) ShortComicChap() generated.ShortComicChapResolver {
	return &shortComicChapResolver{r}
}

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type shortComicChapResolver struct{ *Resolver }
