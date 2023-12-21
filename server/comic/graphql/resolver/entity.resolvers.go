package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
)

// FindChapByID is the resolver for the findChapByID field.
func (r *entityResolver) FindChapByID(ctx context.Context, id string) (*model.Chap, error) {
	comicChapModel, err := comic_chap_model.InitChapModel(r.Client)
	if err != nil {
		return nil, err
	}
	return comicChapModel.FindById(id)
}

// FindProfileByCreateID is the resolver for the findProfileByCreateID field.
func (r *entityResolver) FindProfileByCreateID(ctx context.Context, createID string) (*model.Profile, error) {
	return &model.Profile{
		CreateID: createID,
	}, nil
}

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
