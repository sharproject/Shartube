package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/database/comic_session_model"
	"github.com/Folody-Team/Shartube/directives"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/Folody-Team/Shartube/graphql/resolver"
	GraphqlLog "github.com/Folody-Team/Shartube/middleware/log"
	"github.com/Folody-Team/Shartube/middleware/passRequest"
	"github.com/Folody-Team/Shartube/util/getClient"
	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const defaultPort = "8080"

func main() {
	/*
	* Commit by phatdev
	 */
	// create a new router with mux
	router := mux.NewRouter()
	client, err := getClient.GetClient()
	if err != nil {
		log.Fatal(err)
	}
	// middleware
	router.Use(passRequest.PassMiddleware)
	port := os.Getenv("PORT")

	if port == "" {
		port = defaultPort
	}

	err = godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	u := url.URL{
		Scheme: "ws",
		Host:   os.Getenv("WS_HOST") + ":" + os.Getenv("WS_PORT"),
		Path:   "/",
	}
	ws, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatalln(err)
	}
	go func() {
		ws, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
		if err != nil {
			log.Fatalln(err)
		}
		for {
			_, message, err := ws.ReadMessage()
			if err != nil {
				continue
			}
			if _, err := HandleWs(message, ws, client); err != nil {
				continue
			}
		}
	}()
	c := generated.Config{Resolvers: &resolver.Resolver{
		Client: client, Ws: ws,
	}}
	c.Directives.Auth = directives.Auth

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))

	srv.AroundOperations(GraphqlLog.LogMiddleware)
	/*
	* Here we add the playground to the server with mux
	 */
	// handler static/css and js
	router.Use(cors.New(
		cors.Options{
			AllowedOrigins: []string{"*"},
			AllowedMethods: []string{
				http.MethodHead,
				http.MethodGet,
				http.MethodPost,
				http.MethodPut,
				http.MethodPatch,
				http.MethodDelete,
			},
			AllowedHeaders:   []string{"*"},
			AllowCredentials: true,
		},
	).Handler)
	router.Handle("/query", srv)
	// to use mux we need to Handle it with net/http.

	log.Printf("connect to https://localhost:%s/ for GraphQL playground", port)
	if os.Getenv("https") == "true" {
		log.Fatal(http.ListenAndServeTLS(
			":"+port,
			"./secure/cert/ca-cert.pem",
			"./secure/key/key.pem",
			handlers.CORS(
				handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
				handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
			)(router)))
	} else {
		log.Fatal(http.ListenAndServe(":"+port, handlers.CORS(
			handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		)(router)))
	}
}

func HandleWs(message []byte, ws *websocket.Conn, Client *mongo.Client) (*interface{}, error) {
	var data LocalTypes.WsReturnData[interface{}]
	err := json.Unmarshal(message, &data)
	if err != nil {
		return nil, err
	}
	if data.Type == "message" && data.From == "upload_token_registry/user_upload_webhook" {
		if data.Url == "comic/SocketAddImagesToChap" {
			var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadedChapImagesSocketPayload]]
			err := json.Unmarshal(message, &data)
			if err != nil {
				return nil, err
			}
			fmt.Printf("data.Payload.Data.ChapId: %v\n", data.Payload.Data.ChapId)
			comicChapModel, err := comic_chap_model.InitComicChapModel(Client)
			if err != nil {
				return nil, err
			}
			comicChapDoc, err := comicChapModel.FindById(data.Payload.Data.ChapId)
			if err != nil {
				return nil, err
			}
			// ws message handler
			AllImages := comicChapDoc.Images
			var newImagesUrl = []*model.ImageResult{}
			for _, value := range data.Payload.Url {
				id := uuid.New()
				newImagesUrl = append(newImagesUrl, &model.ImageResult{
					ID:  id.String(),
					URL: value,
				})
			}
			AllImages = append(AllImages, newImagesUrl...)
			ComicChapObjectId, err := primitive.ObjectIDFromHex(comicChapDoc.ID)
			if err != nil {
				return nil, err
			}
			if _, err := comicChapModel.FindOneAndUpdate(bson.M{
				"_id": ComicChapObjectId,
			}, bson.M{
				"$set": bson.M{
					"Images": AllImages,
				},
			}); err != nil {
				return nil, err
			}

			if err != nil {
				return nil, err
			}

			comicObjectData := LocalTypes.WsRequest{
				Url:     "subtitle/GenerationSubtitle",
				Header:  nil,
				Payload: AllImages,
				From:    "comic/AddImageForChap",
				Type:    "message",
			}

			comicObject, err := json.Marshal(comicObjectData)
			if err != nil {
				return nil, err
			}
			ws.WriteMessage(websocket.TextMessage, comicObject)
		} else if data.Url == "comic/SocketChangeComicThumbnail" {
			var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadedComicThumbnailPayload]]
			err := json.Unmarshal(message, &data)
			if err != nil {
				return nil, err
			}
			comicModel, err := comic_model.InitComicModel(Client)
			if err != nil {
				return nil, err
			}
			comicDocObjectId, err := primitive.ObjectIDFromHex(data.Payload.Data.ComicId)
			if err != nil {
				return nil, err
			}
			_, err = comicModel.FindOneAndUpdate(bson.M{
				"_id": comicDocObjectId,
			}, bson.M{
				"$set": bson.M{"thumbnail": data.Payload.Url[0]},
			})
			if err != nil {
				return nil, err
			}
		} else if data.Url == "comic/SocketChangeComicSessionThumbnail" {
			var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadSessionComicThumbnailPayload]]
			err := json.Unmarshal(message, &data)
			if err != nil {
				return nil, err
			}
			comicSessionModel, err := comic_session_model.InitComicSessionModel(Client)
			if err != nil {
				return nil, err
			}
			comicSessionDocObjectId, err := primitive.ObjectIDFromHex(data.Payload.Data.ComicSessionId)
			if err != nil {
				return nil, err
			}
			_, err = comicSessionModel.FindOneAndUpdate(bson.M{
				"_id": comicSessionDocObjectId,
			}, bson.M{
				"$set": bson.M{"thumbnail": data.Payload.Url[0]},
			})
			if err != nil {
				return nil, err
			}
		}
	}

	return nil, nil
}
