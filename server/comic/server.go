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
	"github.com/Folody-Team/Shartube/directives"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/resolver"
	GraphqlLog "github.com/Folody-Team/Shartube/middleware/log"
	"github.com/Folody-Team/Shartube/middleware/passRequest"
	"github.com/Folody-Team/Shartube/util/getClient"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
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
		for {
			_, message, err := ws.ReadMessage()
			if err != nil {
				continue
			}
			if _, err := HandleWs(message); err != nil {
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

func HandleWs(message []byte) (*interface{}, error) {
	var data LocalTypes.WsReturnData[interface{}]
	err := json.Unmarshal(message, &data)
	if err != nil {
		return nil, err
	}
	if data.Type == "rep" {
		fmt.Printf("data: %v+\n", data)
	}
	return nil, nil
}
