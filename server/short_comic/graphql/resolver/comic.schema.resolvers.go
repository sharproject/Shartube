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
	"github.com/sacOO7/gowebsocket"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.mongodb.org/mongo-driver/bson"
)

// CreateShortComic is the resolver for the createShortComic field.
func (r *mutationResolver) CreateShortComic(ctx context.Context, input model.CreateShortComicInput) (*model.ShortComic, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	CreateID := ctx.Value(directives.AuthString("session")).(*LocalTypes.AuthSessionDataReturn).CreatorID
	if err != nil {
		return nil, err
	}
	ThumbnailUrl := ""
	if input.Thumbnail != nil {
		ThumbnailUrlPointer, err := util.UploadImageForGraphql(*input.Thumbnail)
		if err != nil {
			return nil, err
		}
		ThumbnailUrl = *ThumbnailUrlPointer
	}
	comicID, err := comicModel.New(&model.CreateShortComicInputModel{
		CreatedByID: CreateID,
		Name:        input.Name,
		Description: input.Description,
		Thumbnail:   &ThumbnailUrl,
	}).Save()

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
		Url:    "user/UpdateUserShortComic",
		Header: nil,
		Payload: bson.M{
			"_id":    comicID.Hex(),
			"UserID": CreateID,
		},
		From: "ShortComic/CreateShortComic",
		Type: "message",
	}

	comicObject, err := json.Marshal(comicObjectData)
	if err != nil {
		return nil, err
	}
	comicObjectString := string(comicObject)
	socket.SendText(comicObjectString)

	socket.Close()
	return comicModel.FindById(comicID.Hex())
}

// UpdateShortComic is the resolver for the updateShortComic field.
func (r *mutationResolver) UpdateShortComic(ctx context.Context, shortComicID string, input model.UpdateShortComicInput) (*model.ShortComic, error) {
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

	return comicModel.FindOneAndUpdate(bson.M{
		"_id": comic.ID,
	}, input)
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
	comicObjectString := string(comicObject)
	socket.SendText(comicObjectString)

	socket.Close()

	// send to user service to pull comic
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
	ComicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	AllComicSession := []*model.ShortComicChap{}
	for _, v := range obj.ChapIDs {
		data, err := ComicChapModel.FindById(v)
		if err != nil {
			return nil, err
		}
		AllComicSession = append(AllComicSession, data)
	}
	return AllComicSession, nil
}

// ShortComic returns generated.ShortComicResolver implementation.
func (r *Resolver) ShortComic() generated.ShortComicResolver { return &shortComicResolver{r} }

type shortComicResolver struct{ *Resolver }
