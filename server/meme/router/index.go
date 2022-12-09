package router

import (
	"github.com/gofiber/fiber/v2"
)

func SetRoute(app *fiber.App) {
	meme_api := app.Group("/api")
	SetMemeRoute(meme_api)
}
