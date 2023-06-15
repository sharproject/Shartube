package comic_chap_model

import (
	"github.com/Folody-Team/Shartube/database/base_model"
	"github.com/Folody-Team/Shartube/graphql/model"
	"go.mongodb.org/mongo-driver/mongo"
)

func InitChapModel(client *mongo.Client) (*base_model.BaseModel[model.CreateChapInputModel, model.Chap], error) {

	var UserModel = base_model.BaseModel[model.CreateChapInputModel, model.Chap]{
		BaseModelInitValue: &base_model.BaseModelInitValue{
			Client:         client,
			CollectionName: "comic_chaps",
			Timestamp:      true,
			DeleteAfter:    nil,
		},
	}
	return &UserModel, nil
}
