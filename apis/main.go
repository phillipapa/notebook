package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {
	if _, err := godotenv.Read("envs/prod.env"); err != nil {
		log.Println("prod.env not found! Make sure directory of envs/prod.env exists")
	}

	envFile, _ := godotenv.Read("envs/prod.env")
	e := echo.New()
	e.HideBanner = true
	e.HidePort = true

	e.Use(CORSMiddleware())
	e.Use(JWTMiddleware())
	e.Use(HeaderMiddleware())
	e.Use(Headers)

	e.GET("/notes/:id", GetNote)
	e.POST("/notes", CreateNote)

	port := envFile["HTTP_PORT"]
	e.Logger.Fatal(e.Start(":" + port))
}
