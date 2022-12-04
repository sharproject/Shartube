package deleteUtil

import (
	"github.com/Folody-Team/Shartube/database/comic_model"
	"go.mongodb.org/mongo-driver/mongo"
)

func DeleteComic(id string, client *mongo.Client) (bool, error) {
	ComicModel, err := comic_model.InitComicModel(client)
	if err != nil {
		return false, err
	}
	ComicData, err := ComicModel.FindById(id)
	if err != nil {
		return false, err
	}
	if ComicData == nil {
		return false, nil
	}
	for _, ChapID := range ComicData.ChapIDs {
		DeleteChap(ChapID, client, false)
	}
	_, err = ComicModel.FindOneAndDeleteById(id)
	if err != nil {
		return false, err
	}
	return true, nil
}
