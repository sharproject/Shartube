package meme_model

import (
	"meme_server/database/base_model"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

type CreateMemeInputModel struct {
	MemeImage   []string
	Description string
	Name        string
	CreatedByID string
}
type Meme struct {
	ID          string    `json:"_id" bson:"_id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	CreatedByID string    `json:"CreatedByID"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
}

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
