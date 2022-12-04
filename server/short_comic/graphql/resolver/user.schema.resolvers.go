package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
)

// ShortComics is the resolver for the ShortComics field.
func (r *userResolver) ShortComics(ctx context.Context, obj *model.User) ([]*model.ShortComic, error) {
	panic(fmt.Errorf("not implemented"))
}

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type userResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *userResolver) Comics(ctx context.Context, obj *model.User) ([]*model.ShortComic, error) {
	userHost := os.Getenv("UserHost")
	// make http request to userHost
	getUserPath := "/user/comics?id="
	getUserUrl := "http://" + userHost + ":8080" + getUserPath + obj.ID
	resp, err := http.Get(getUserUrl)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var comicIDs []*string
	err = json.NewDecoder(resp.Body).Decode(&comicIDs)
	if err != nil {
		return nil, err
	}
	comicModel, err := comic_model.InitComicModel(r.Client)
	if err != nil {
		return nil, err
	}
	AllComic := []*model.ShortComic{}
	for _, v := range comicIDs {
		if v != nil {
			data, err := comicModel.FindById(*v)
			if err != nil {
				return nil, err
			}
			AllComic = append(AllComic, data)
		}

	}
	return AllComic, nil
}
