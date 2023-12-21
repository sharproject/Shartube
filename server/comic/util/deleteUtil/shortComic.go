package deleteUtil

import (
	"github.com/Folody-Team/Shartube/database/short_comic_model"
	"go.mongodb.org/mongo-driver/mongo"
)

func DeleteShortComic(id string, client *mongo.Client) (bool, error) {
	ShortComicModel, err := short_comic_model.InitShortComicModel(client)
	if err != nil {
		return false, err
	}
	ComicData, err := ShortComicModel.FindById(id)
	if err != nil {
		return false, err
	}
	if ComicData == nil {
		return false, nil
	}
	for _, ChapID := range ComicData.ChapIDs {
		DeleteChap(ChapID, client, false)
	}
	_, err = ShortComicModel.FindOneAndDeleteById(id)
	if err != nil {
		return false, err
	}
	return true, nil
}
