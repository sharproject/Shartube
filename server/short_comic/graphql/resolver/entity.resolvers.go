package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
)

// FindShortComicChapByID is the resolver for the findShortComicChapByID field.
func (r *entityResolver) FindShortComicChapByID(ctx context.Context, id string) (*model.ShortComicChap, error) {
	ComicChapModel, err := comic_chap_model.InitComicChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	return ComicChapModel.FindOneAndDeleteById(id)
}

// FindUserByID is the resolver for the findUserByID field.
func (r *entityResolver) FindUserByID(ctx context.Context, id string) (*model.User, error) {
	return &model.User{
		ID: id,
	}, nil
}

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
