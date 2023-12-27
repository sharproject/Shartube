package short_comic_model
import (
	"github.com/Folody-Team/Shartube/database/base_model"
	"github.com/Folody-Team/Shartube/graphql/model"
	"go.mongodb.org/mongo-driver/mongo"
)

func InitShortComicModel(client *mongo.Client) (*base_model.BaseModel[model.CreateShortComicInputModel, model.ShortComic], error) {

	var UserModel = base_model.BaseModel[model.CreateShortComicInputModel, model.ShortComic]{
		BaseModelInitValue: &base_model.BaseModelInitValue{
			Client:         client,
			CollectionName: "short_comic",
			Timestamp:      true,
			DeleteAfter:    nil,
		},
	}
	return &UserModel, nil
}
