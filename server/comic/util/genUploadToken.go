package util

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/Folody-Team/Shartube/LocalTypes"
)

var genTokenUrl = "http://shartube-upload-server:3000/private/gen_token"

type GenSingleUploadTokenPayload[T any] struct {
	ID        string `json:"id"`
	SaveData  T      `json:"data"`
	EmitTo    string `json:"emit_to"`
	EventName string `json:"event_name"`
}


func GenSingleUploadToken[T any](payload GenSingleUploadTokenPayload[T]) (*string, error) {
	jsonBody, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	bodyReader := bytes.NewReader(jsonBody)
	req, err := http.NewRequest(http.MethodPost, genTokenUrl, bodyReader)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	if res.StatusCode != 200 {
		return nil, err
	}
	var data LocalTypes.GetUploadTokenReturn
	err = json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	return &data.Token, nil
}

func GenMultiUploadToken[T any](payload []GenSingleUploadTokenPayload[T]) (*([]string), error) {
	jsonBody, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	bodyReader := bytes.NewReader(jsonBody)
	req, err := http.NewRequest(http.MethodPost, genTokenUrl, bodyReader)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	if res.StatusCode != 200 {
		return nil, err
	}
	var data LocalTypes.GetUploadTokensReturn
	err = json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	return &data.Token, nil
}
