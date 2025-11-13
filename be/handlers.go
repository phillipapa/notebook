package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetNote(c echo.Context) error {
	id := c.Param("id")
	resp, err := supabaseRequest("GET", fmt.Sprintf("notes?id=eq.%s", id), nil)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}
	defer resp.Body.Close()
	return c.Stream(resp.StatusCode, "application/json", resp.Body)
}

func CreateNote(c echo.Context) error {
	var note struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.Bind(&note); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
	}
	resp, err := supabaseRequest("POST", "notes", note)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": err.Error()})
	}
	defer resp.Body.Close()
	return c.Stream(resp.StatusCode, "application/json", resp.Body)
}
