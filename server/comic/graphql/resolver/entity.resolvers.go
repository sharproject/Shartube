package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
)

// FindComicChapByID is the resolver for the findComicChapByID field.
func (r *entityResolver) FindComicChapByID(ctx context.Context, id string) (*model.ComicChap, error) {
	panic(fmt.Errorf("not implemented"))
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
