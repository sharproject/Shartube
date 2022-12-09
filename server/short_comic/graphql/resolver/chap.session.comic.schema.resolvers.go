package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"log"
	"net/url"
	"os"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/directives"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/Folody-Team/Shartube/util"
	"github.com/Folody-Team/Shartube/util/deleteUtil"
	"github.com/google/uuid"
	"github.com/sacOO7/gowebsocket"
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

// AddImageToShortComicChap is the resolver for the AddImageToShortComicChap field.
func (r *mutationResolver) AddImageToShortComicChap(ctx context.Context, req []*model.UploadFile, chapID string) (*model.ShortComicChap, error) {
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

	AllImages := comicChapDoc.Images
	for _, v := range req {
		url, err := util.UploadImageForGraphql(v.File)
		if err != nil {
			return nil, err
		}

		AllImages = append(AllImages, &model.ImageResult{
			ID:  uuid.New().String(),
			URL: *url,
		})
	}
	ComicChapObjectId, err := primitive.ObjectIDFromHex(comicChapDoc.ID)
	if err != nil {
		return nil, err
	}
	if _, err := comicChapModel.FindOneAndUpdate(bson.M{
		"_id": ComicChapObjectId,
	}, bson.M{
		"$set": bson.M{
			"Images": AllImages,
		},
	}); err != nil {
		return nil, err
	}

	// get data from comic model
	u := url.URL{
		Scheme: "ws",
		Host:   os.Getenv("WS_HOST") + ":" + os.Getenv("WS_PORT"),
		Path:   "/",
	}
	socket := gowebsocket.New(u.String())

	socket.OnConnected = func(socket gowebsocket.Socket) {
		log.Println("Connected to server")
	}

	socket.OnTextMessage = func(message string, socket gowebsocket.Socket) {
		log.Println("Got messages " + message)
	}

	socket.Connect()

	if err != nil {
		return nil, err
	}

	comicObjectData := LocalTypes.WsRequest{
		Url:     "subtitle/GenerationSubtitle",
		Header:  nil,
		Payload: AllImages,
		From:    "ShortComic/AddImageForChap",
		Type:    "message",
	}

	comicObject, err := json.Marshal(comicObjectData)
	if err != nil {
		return nil, err
	}
	comicObjectString := string(comicObject)
	socket.SendText(comicObjectString)

	socket.Close()

	return comicChapModel.FindById(comicChapDoc.ID)
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
	u := url.URL{
		Scheme: "ws",
		Host:   os.Getenv("WS_HOST") + ":" + os.Getenv("WS_PORT"),
		Path:   "/",
	}
	socket := gowebsocket.New(u.String())

	socket.OnConnected = func(socket gowebsocket.Socket) {
		log.Println("Connected to server")
	}

	socket.OnTextMessage = func(message string, socket gowebsocket.Socket) {
		log.Println("Got messages " + message)
	}

	socket.Connect()

	if err != nil {
		return nil, err
	}

	comicObjectData := LocalTypes.WsRequest{
		Url:     "subtitle/DeleteSubtitle",
		Header:  nil,
		Payload: imageID,
		From:    "comic/RemoveImageForChap",
		Type:    "message",
	}

	comicObject, err := json.Marshal(comicObjectData)
	if err != nil {
		return nil, err
	}
	comicObjectString := string(comicObject)
	socket.SendText(comicObjectString)

	socket.Close()

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

// ChapByComic is the resolver for the ChapByComic field.
func (r *queryResolver) ChapByComic(ctx context.Context, comicID string) ([]*model.ShortComicChap, error) {
	ComicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	return ComicChapModel.Find(bson.M{"ComicID": comicID})
}

// CreatedBy is the resolver for the CreatedBy field.
func (r *shortComicChapResolver) CreatedBy(ctx context.Context, obj *model.ShortComicChap) (*model.User, error) {
	return util.GetUserByID(obj.CreatedByID)
}

// Comic is the resolver for the Comic field.
func (r *shortComicChapResolver) Comic(ctx context.Context, obj *model.ShortComicChap) (*model.ShortComic, error) {
	ComicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	return ComicModel.FindOneAndDeleteById(obj.ComicID)
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
