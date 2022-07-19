package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"log"

	"github.com/Folody-Team/Shartube/database/session_model"
	"github.com/Folody-Team/Shartube/database/user_model"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// Login is the resolver for the Login field.
func (r *authOpsResolver) Login(ctx context.Context, obj *model.AuthOps, input model.LoginUserInput) (*model.UserLoginOrRegisterResponse, error) {
	UserModel, err := user_model.InitUserModel()
	if err != nil {
		return nil, err
	}
	user, err := UserModel.FindOne(bson.D{
		{Key: "$or", Value: []interface{}{
			bson.D{{Key: "email", Value: input.UsernameOrEmail}},
			bson.D{{Key: "username", Value: input.UsernameOrEmail}},
		}},
	})
	if err != nil {
		if err == bson.ErrDecodeToNil {
			return nil, gqlerror.Errorf("user not found")
		}
		return nil, err
	}
	fmt.Println(*user.Password)
	err = bcrypt.CompareHashAndPassword([]byte(*user.Password), []byte(input.Password))
	if err != nil {
		if err == bcrypt.ErrMismatchedHashAndPassword {
			return nil, gqlerror.Errorf("password or email or user name is incorrect")
		}
		return nil, err
	}
	return nil, nil
}

// Register is the resolver for the Register field.
func (r *authOpsResolver) Register(ctx context.Context, obj *model.AuthOps, input model.RegisterUserInput) (*model.UserLoginOrRegisterResponse, error) {
	UserModel, err := user_model.InitUserModel()
	if err != nil {
		return nil, err
	}

	SessionModel, err := session_model.InitSessionModel()
	if err != nil {
		return nil, err
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	input.Password = string(hashedPassword)
	id, err := UserModel.New(&input).Save()
	if err != nil {
		return nil, err
	}
	_id := id.Hex()
	user := UserModel.FindById(string(_id))
	user.Password = nil

	sessionSaveData := &session_model.SaveSessionDataInput{
		UserID: _id,
	}
	Session, err := SessionModel.New(sessionSaveData).Save()
	if err != nil {
		return nil, err
	}
	SessionID := Session.Hex()
	// clams := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.MapClaims{})
	log.Println(SessionID)

	return &model.UserLoginOrRegisterResponse{
		User:        user,
		AccessToken: "aajfklajflkjafkjsljfl",
	}, nil
}

// AuthOps returns generated.AuthOpsResolver implementation.
func (r *Resolver) AuthOps() generated.AuthOpsResolver { return &authOpsResolver{r} }

type authOpsResolver struct{ *Resolver }
