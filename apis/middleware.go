package main

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type CustomClaims struct {
	Spb string `json:"spb"`
	jwt.RegisteredClaims
}

func HeaderMiddleware() echo.MiddlewareFunc {
	return middleware.SecureWithConfig(middleware.SecureConfig{
		XFrameOptions:         "DENY",
		ContentTypeNosniff:    "nosniff",
		ContentSecurityPolicy: "default-src 'none'",
	})
}

func Headers(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		return next(c)
	}
}

func JWTMiddleware() echo.MiddlewareFunc {
	supabaseJwtSecret, _ := godotenv.Read("envs/prod.env")
	actualSecret := "supersecret" // use your actual key of: SUPABASE_JWT_SECRET (HS256 shared secret) in directory envs/prod.env
	if len(supabaseJwtSecret["SUPABASE_JWT_SECRET"]) > 0 {
		actualSecret = supabaseJwtSecret["SUPABASE_JWT_SECRET"]
	}

	return echojwt.WithConfig(echojwt.Config{
		SigningKey: []byte(actualSecret),
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(CustomClaims)
		},
	})
}

func CORSMiddleware() echo.MiddlewareFunc {
	return middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAuthorization},
	})
}

func BodyLimitMiddleware(limit string) echo.MiddlewareFunc {
	return middleware.BodyLimit(limit)
}
