package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/Folody-Team/Shartube/util"
)

// Search is the resolver for the Search field.
func (r *queryResolver) Search(ctx context.Context, query string) (*model.SearchResult, error) {
	shortComic, err := util.SearchComicFromNZ_Datalake(query)
	if err != nil {
		return nil, err
	}
	return &model.SearchResult{
		ShortComics: shortComic,
		Comics:      []*model.Comic{},
	}, nil
}
