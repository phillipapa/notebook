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
	e.Use(BodyLimitMiddleware("10M"))
	e.Use(Headers)

	e.POST("/api/auth/google", GoogleLogin)
	e.POST("/api/notes", CreateNote)

	port := envFile["HTTP_PORT"]
	log.Printf("Service started at port: %s", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatal(err)
	}
}
