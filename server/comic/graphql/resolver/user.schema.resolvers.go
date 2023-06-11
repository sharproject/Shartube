package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/database/short_comic_model"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
	"go.mongodb.org/mongo-driver/bson"
)

// Comics is the resolver for the comics field.
func (r *userResolver) Comics(ctx context.Context, obj *model.User) ([]*model.Comic, error) {
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	return comicModel.Find(bson.M{
		"createdbyid": obj.ID,
	})
}

// ShortComics is the resolver for the ShortComics field.
func (r *userResolver) ShortComics(ctx context.Context, obj *model.User) ([]*model.ShortComic, error) {
	ShortComicModel, err := short_comic_model.InitShortComicModel(r.Client)
	if err != nil {
		return nil, err
	}

	return ShortComicModel.Find(bson.M{
		"createdbyid": obj.ID,
	})
}

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type userResolver struct{ *Resolver }
