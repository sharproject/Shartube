package meme_model

import (
	"meme_server/database/base_model"

	"go.mongodb.org/mongo-driver/mongo"
)

type CreateMemeInputModel struct{}
type Meme struct{}

func InitMemeModel(client *mongo.Client) (*base_model.BaseModel[CreateMemeInputModel, Meme], error) {
	var UserModel = base_model.BaseModel[CreateMemeInputModel, Meme]{
		BaseModelInitValue: &base_model.BaseModelInitValue{
			Client:         client,
			CollectionName: "meme_server",
			Timestamp:      true,
			DeleteAfter:    nil,
		},
	}
	return &UserModel, nil
}
