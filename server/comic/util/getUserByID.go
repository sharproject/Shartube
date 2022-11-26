package util

import (
	"github.com/Folody-Team/Shartube/graphql/model"
)

func GetUserByID(id string) (*model.User, error) {
	return &model.User{
		ID: id,
	}, nil
}
