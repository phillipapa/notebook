package main

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/joho/godotenv"
)

func supabaseRequest(method, path string, body interface{}) (*http.Response, error) {
	envFile, _ := godotenv.Read("envs/prod.env")
	supabaseURL := envFile["SUPABASE_URL"]
	supabasePublishKey := envFile["SUPABASE_PUB_KEY"]

	var buf bytes.Buffer
	if body != nil {
		if err := json.NewEncoder(&buf).Encode(body); err != nil {
			return nil, err
		}
	}
	req, err := http.NewRequest(method, supabaseURL+"/rest/v1/"+path, &buf)
	if err != nil {
		return nil, err
	}
	req.Header.Set("apikey", supabasePublishKey)
	req.Header.Set("Content-Type", "application/json")
	return http.DefaultClient.Do(req)
}
