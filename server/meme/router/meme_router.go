package router

import "github.com/gofiber/fiber/v2"

func SetMemeRoute(route fiber.Router) {
	route.Get("/", func(c *fiber.Ctx) error {
		c.WriteString("fpi open the door")
		return nil
	})
}
