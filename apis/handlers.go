package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/idtoken"
	"google.golang.org/api/option"
)

type googleToken struct {
	IDToken     string `json:"id_token"`
	AccessToken string `json:"access_token"`
}

type noteRequest struct {
	Content string `json:"content"`
}

func GoogleLogin(c echo.Context) error {
	var gToken googleToken
	envFile, _ := godotenv.Read("envs/prod.env")
	clientIdSecret := envFile["GOOGLE_OAUTH_CLIENTID"]
	if err := json.NewDecoder(c.Request().Body).Decode(&gToken); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid Payload"})
	}

	payload, err := idtoken.Validate(c.Request().Context(), gToken.IDToken, clientIdSecret)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid Token"})
	}

	resp := map[string]string{
		"name":  payload.Claims["name"].(string),
		"email": payload.Claims["email"].(string),
	}
	return c.JSON(http.StatusOK, resp)
}

func CreateNote(c echo.Context) error {
	auth := c.Request().Header.Get("Authorization")
	if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Unauthorized"})
	}
	accessToken := strings.TrimPrefix(auth, "Bearer ")

	var nr noteRequest
	if err := json.NewDecoder(c.Request().Body).Decode(&nr); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid Payload"})
	}

	srv, err := drive.NewService(c.Request().Context(), option.WithTokenSource(
		oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken}),
	))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error initializing google drive"})
	}

	file := &drive.File{
		Name:     "notebook-note-" + time.Now().Format("20060102T150405") + ".json",
		MimeType: "application/json",
	}
	_, err = srv.Files.Create(file).Media(strings.NewReader(nr.Content)).Do()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error writing to google drive"})
	}

	return c.JSON(http.StatusOK, map[string]string{"fileId": file.Id})
}
