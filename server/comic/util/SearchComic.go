package util

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/Folody-Team/Shartube/graphql/model"
)

func SearchComicFromNZ_Datalake(query string) ([]*model.ShortComic, error) {
	result := []*model.ShortComic{}

	url := "https://ai-datalake.nz.io.vn/api/search?query=" + query

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	resMap := map[string]interface{}{}
	err = json.Unmarshal(body, &resMap)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	data := resMap["data"].([]interface{})
	for _, v := range data {
		comic := model.ShortComic{}
		comic.ID = "NZ_Datalake_" + v.(map[string]interface{})["id"].(string)
		comic.Name = v.(map[string]interface{})["name"].(string)
		comic.CreatedAt = jsDateStringToTime(v.(map[string]interface{})["createdDate"].(string))
		comic.UpdatedAt = jsDateStringToTime(v.(map[string]interface{})["updatedDate"].(string))
		comic.CreatedByID = "NZ_Datalake_" + v.(map[string]interface{})["id"].(string)
		content := v.(map[string]interface{})["content"].(string)
		comic.Description = &content
		thumbnail := v.(map[string]interface{})["thumbnail"].(string)
		comic.Thumbnail = &thumbnail
		comic.Background = &thumbnail
		comic.Views = 0
		comic.ChapIDs = []string{}
		fmt.Println(v)

		result = append(result, &comic)
	}

	return result, nil
}

// 2024-03-08T00:03:10.487Z
func jsDateStringToTime(date string) time.Time {
	result, err := time.Parse(time.RFC3339, date)
	if err != nil {
		fmt.Println(err)
		return time.Time{}
	}
	return result
}

func SearchPreviewChapFromNZ_Datalake(comicId string) ([]*model.Chap, error) {
	result := []*model.Chap{}
	url := "https://ai-datalake.nz.io.vn/api/comic/" + comicId

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	resMap := map[string]interface{}{}
	err = json.Unmarshal(body, &resMap)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	data := resMap["data"].(map[string]interface{})["Chapter"].([]interface{})
	for _, v := range data {
		chap := model.Chap{}
		chap.ID = "NZ_Datalake_" + v.(map[string]interface{})["id"].(string)
		chap.ShortComicID = []string{"NZ_Datalake_" + comicId}
		chap.SessionID = []string{}
		chap.Name = v.(map[string]interface{})["name"].(string)
		// fake data
		chap.CreatedAt = time.Now()
		chap.UpdatedAt = time.Now()
		chap.CreatedByID = "NZ_Datalake_" + v.(map[string]interface{})["id"].(string)
		chap.Views = 0
		chap.Images = []*model.ImageResult{}
		result = append(result, &chap)
	}

	return result, nil
}

func SearchChapFromNZ_Datalake(chapID string) (*model.Chap, error) {

	url := "https://ai-datalake.nz.io.vn/api/chapter/" + chapID

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	resMap := map[string]interface{}{}
	err = json.Unmarshal(body, &resMap)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	data := resMap["data"].(map[string]interface{})

	chap := model.Chap{}
	chap.ID = "NZ_Datalake_" + data["id"].(string)
	chap.ShortComicID = []string{"NZ_Datalake_" + data["comicId"].(string)}
	chap.SessionID = []string{}
	chap.Name = data["name"].(string)
	chap.UpdatedAt = jsDateStringToTime(data["updatedDate"].(string))
	// fake data
	chap.CreatedAt = jsDateStringToTime(data["updatedDate"].(string))
	chap.CreatedByID = "NZ_Datalake_" + data["id"].(string)
	chap.Views = 0
	chap.Images = []*model.ImageResult{}
	for _, v := range data["images"].([]string) {
		image := model.ImageResult{}
		image.ID = v
		image.URL = v
		chap.Images = append(chap.Images, &image)
	}
	return &chap, nil
}
