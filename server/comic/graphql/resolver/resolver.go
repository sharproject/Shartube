package resolver

import (
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
)

//go:generate go run github.com/Folody-Team/Shartube/plugins
// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Client *mongo.Client
	Redis  *redis.Client
}
