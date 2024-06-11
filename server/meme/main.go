package main

import (
	"fmt"
	"log"
	"os"

	"meme_server/router"
	"meme_server/util/GetDbClient"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	client, err := GetDbClient.GetDbClient()
	if err != nil {
		log.Fatal(err)
	}

	app.Use(func(c *fiber.Ctx) error {
		fmt.Println(c.BaseURL())
		c.Locals("database_connect", client)
		return c.Next()
	})

	router.SetRoute(app)

	app.Listen(":" + os.Getenv("PORT"))
}
