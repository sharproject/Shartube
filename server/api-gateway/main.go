package main

import (
	"crypto/tls"
	"log"
	"net/url"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"github.com/valyala/fasthttp"
)

func setupProxy(app *fiber.App) {
	// if target https site uses a self-signed certificate, you should
	// call WithTlsConfig before Do and Forward
	proxy.WithTlsConfig(&tls.Config{
		InsecureSkipVerify: true,
	})
	// if you need to use global self-custom client, you should use proxy.WithClient.
	proxy.WithClient(&fasthttp.Client{
		NoDefaultUserAgentHeader: true,
		DisablePathNormalizing:   false,
	})

	api := app.Group("/api") // /api

	app.Use("/meme/*", ProxyHandler(os.Getenv("MEME_SERVER")))
	api.Use("/meme/*", ProxyHandler(os.Getenv("MEME_SERVER")))

	// proxy.Forward
	app.Use("/graphql/*", ProxyHandler(os.Getenv("GRAPHQL_SERVER")))
	api.Use("/graphql/*", ProxyHandler(os.Getenv("GRAPHQL_SERVER")))
}

func main() {
	app := fiber.New()

	setupProxy(app)

	app.Listen(":" + os.Getenv("PORT"))
}

func ProxyHandler(path string) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		originUrl := strings.Clone(c.OriginalURL())
		url, err := url.JoinPath(strings.Clone(path), strings.Join(strings.Split(originUrl, "/")[2:], "/"))
		if err != nil {
			log.Println(err)
			return err
		}

		if err := proxy.Do(c, url); err != nil {
			return err
		}
		// Remove Server header from response
		c.Response().Header.Del(fiber.HeaderServer)
		return nil
	}
}
