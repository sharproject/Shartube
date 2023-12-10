package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/Folody-Team/Shartube/directives"
	"github.com/Folody-Team/Shartube/graphql/generated"
	"github.com/Folody-Team/Shartube/graphql/resolver"
	GraphqlLog "github.com/Folody-Team/Shartube/middleware/log"
	"github.com/Folody-Team/Shartube/middleware/passRequest"
	"github.com/Folody-Team/Shartube/service_event"
	"github.com/Folody-Team/Shartube/util/getClient"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	/*
	* Commit by phatdev
	 */
	// create a new router with mux
	router := mux.NewRouter()
	MongoDbClient, err := getClient.GetClient()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("MongoDbClient connected")

	redisOpts := redis.Options{
		Addr:     os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
		Password: os.Getenv("REDIS_PASSWORD"), // no password set
		DB:       0,                           // use default DB

	}

	log.Println("RedisClient connected at ", redisOpts.Addr)

	RedisClient := redis.NewClient(&redisOpts)
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

	go func() {
		service_event.HandleServiceEvent(RedisClient, MongoDbClient)

	}()
	c := generated.Config{Resolvers: &resolver.Resolver{
		Client: MongoDbClient, Redis: RedisClient,
	}}
	c.Directives.Auth = directives.AuthDirective(RedisClient)

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
