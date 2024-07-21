package util

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/Folody-Team/Shartube/graphql/model"
)

func SearchComicFromNZ_Datalake(query string) []*model.Comic {
	result := []*model.Comic{}

	url := "https://ai-datalake.nz.io.vn/api/search?query=" + query

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		fmt.Println(err)
		return result
	}

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(err)
		return result
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)

	if err != nil {
		fmt.Println(err)
		return result
	}

	resMap := map[string]interface{}{}
	err = json.Unmarshal(body, &resMap)

	if err != nil {
		fmt.Println(err)
		return result
	}

	data := resMap["data"].([]interface{})
	for _, v := range data {
		comic := model.Comic{}
		comic.ID = v.(map[string]interface{})["id"].(string)
		comic.Name = v.(map[string]interface{})["name"].(string)
		comic.CreatedAt = jsDateStringToTime(v.(map[string]interface{})["createdDate"].(string))
		comic.UpdatedAt = jsDateStringToTime(v.(map[string]interface{})["updatedDate"].(string))
		comic.CreatedByID = "NZ_Datalake" + v.(map[string]interface{})["url"].(string)
		content := v.(map[string]interface{})["content"].(string)
		comic.Description = &content
		comic.SessionID = []string{}
		thumbnail := v.(map[string]interface{})["thumbnail"].(string)
		comic.Thumbnail = &thumbnail
		comic.Background = &thumbnail
		originalAuthor := ""
		for k := range v.(map[string]interface{})["author"].(map[string]string) {
			originalAuthor += k
		}
		comic.OriginalAuthor = &originalAuthor
		comic.Views = 0
		fmt.Println(v)

		result = append(result, &comic)
	}

	return result
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
