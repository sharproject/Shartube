package ws

import (
	"encoding/json"
	"fmt"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/database/comic_session_model"
	"github.com/Folody-Team/Shartube/database/short_comic_model"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func HandleWs(message []byte, ws *websocket.Conn, Client *mongo.Client) (*interface{}, error) {
	var data LocalTypes.WsReturnData[interface{}]
	err := json.Unmarshal(message, &data)
	if err != nil {
		return nil, err
	}
	if data.Type == "message" {
		if data.From == "upload_token_registry/user_upload_webhook" {
			if data.Url == "comic/SocketAddImagesToChap" {
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadedChapImagesSocketPayload]]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				fmt.Printf("data.Payload.Data.ChapId: %v\n", data.Payload.Data.ChapId)
				comicChapModel, err := comic_chap_model.InitChapModel(Client)
				if err != nil {
					return nil, err
				}
				comicChapDoc, err := comicChapModel.FindById(data.Payload.Data.ChapId)
				if err != nil {
					return nil, err
				}
				// ws message handler
				AllImages := comicChapDoc.Images
				var newImagesUrl = []*model.ImageResult{}
				for _, value := range data.Payload.Url {
					id := uuid.New()
					newImagesUrl = append(newImagesUrl, &model.ImageResult{
						ID:  id.String(),
						URL: value,
					})
				}
				AllImages = append(AllImages, newImagesUrl...)
				ComicChapObjectId, err := primitive.ObjectIDFromHex(comicChapDoc.ID)
				if err != nil {
					return nil, err
				}
				if _, err := comicChapModel.FindOneAndUpdate(bson.M{
					"_id": ComicChapObjectId,
				}, bson.M{
					"$set": bson.M{
						"Images": AllImages,
					},
				}); err != nil {
					return nil, err
				}

				if err != nil {
					return nil, err
				}

				comicObjectData := LocalTypes.WsRequest{
					Url:     "subtitle/GenerationSubtitle",
					Header:  nil,
					Payload: AllImages,
					From:    "comic/AddImageForChap",
					Type:    "message",
					ID:      uuid.NewString(),
				}

				comicObject, err := json.Marshal(comicObjectData)
				if err != nil {
					return nil, err
				}
				ws.WriteMessage(websocket.TextMessage, comicObject)
			} else if data.Url == "comic/SocketChangeComicThumbnail" {
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadComicThumbnailAndBackgroundPayload]]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				comicModel, err := comic_model.InitComicModel(Client)
				if err != nil {
					return nil, err
				}
				comicDocObjectId, err := primitive.ObjectIDFromHex(data.Payload.Data.ComicId)
				if err != nil {
					return nil, err
				}
				_, err = comicModel.FindOneAndUpdate(bson.M{
					"_id": comicDocObjectId,
				}, bson.M{
					"$set": bson.M{"thumbnail": data.Payload.Url[0]},
				})
				if err != nil {
					return nil, err
				}
			} else if data.Url == "comic/SocketChangeComicBackground" {
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadComicThumbnailAndBackgroundPayload]]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				comicModel, err := comic_model.InitComicModel(Client)
				if err != nil {
					return nil, err
				}
				comicDocObjectId, err := primitive.ObjectIDFromHex(data.Payload.Data.ComicId)
				if err != nil {
					return nil, err
				}
				_, err = comicModel.FindOneAndUpdate(bson.M{
					"_id": comicDocObjectId,
				}, bson.M{
					"$set": bson.M{"background": data.Payload.Url[0]},
				})
				if err != nil {
					return nil, err
				}
			} else if data.Url == "comic/SocketChangeComicSessionThumbnail" {
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadSessionComicThumbnailPayload]]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				comicSessionModel, err := comic_session_model.InitComicSessionModel(Client)
				if err != nil {
					return nil, err
				}
				comicSessionDocObjectId, err := primitive.ObjectIDFromHex(data.Payload.Data.ComicSessionId)
				if err != nil {
					return nil, err
				}
				_, err = comicSessionModel.FindOneAndUpdate(bson.M{
					"_id": comicSessionDocObjectId,
				}, bson.M{
					"$set": bson.M{"thumbnail": data.Payload.Url[0]},
				})
				if err != nil {
					return nil, err
				}
			} else if data.Url == "ShortComic/SocketAddImagesToChap" {
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadedChapImagesSocketPayload]]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				fmt.Printf("data.Payload.Data.ChapId: %v\n", data.Payload.Data.ChapId)
				comicChapModel, err := comic_chap_model.InitChapModel(Client)
				if err != nil {
					return nil, err
				}
				comicChapDoc, err := comicChapModel.FindById(data.Payload.Data.ChapId)
				if err != nil {
					return nil, err
				}
				// ws message handler
				AllImages := comicChapDoc.Images
				var newImagesUrl = []*model.ImageResult{}
				for _, value := range data.Payload.Url {
					id := uuid.New()
					newImagesUrl = append(newImagesUrl, &model.ImageResult{
						ID:  id.String(),
						URL: value,
					})
				}
				AllImages = append(AllImages, newImagesUrl...)
				ComicChapObjectId, err := primitive.ObjectIDFromHex(comicChapDoc.ID)
				if err != nil {
					return nil, err
				}
				if _, err := comicChapModel.FindOneAndUpdate(bson.M{
					"_id": ComicChapObjectId,
				}, bson.M{
					"$set": bson.M{
						"Images": AllImages,
					},
				}); err != nil {
					return nil, err
				}

				if err != nil {
					return nil, err
				}

				comicObjectData := LocalTypes.WsRequest{
					Url:     "subtitle/GenerationSubtitle",
					Header:  nil,
					Payload: AllImages,
					From:    "ShortComic/AddImageForChap",
					Type:    "message",
					ID:      uuid.NewString(),
				}

				comicObject, err := json.Marshal(comicObjectData)
				if err != nil {
					return nil, err
				}
				ws.WriteMessage(websocket.TextMessage, comicObject)
			} else if data.Url == "ShortComic/SocketChangeComicThumbnail" {
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadComicThumbnailAndBackgroundPayload]]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				comicModel, err := comic_model.InitComicModel(Client)
				if err != nil {
					return nil, err
				}
				comicDocObjectId, err := primitive.ObjectIDFromHex(data.Payload.Data.ComicId)
				if err != nil {
					return nil, err
				}
				_, err = comicModel.FindOneAndUpdate(bson.M{
					"_id": comicDocObjectId,
				}, bson.M{
					"$set": bson.M{"thumbnail": data.Payload.Url[0]},
				})
				if err != nil {
					return nil, err
				}
			}
		} else if data.Url == "all/CheckIDReal" {
			var data LocalTypes.WsReturnData[LocalTypes.CheckIdRealPayload]
			err := json.Unmarshal(message, &data)
			if err != nil {
				return nil, err
			}
			isReal := checkIdReal(Client, data.Payload.ObjectType, data.Payload.Id)
			if isReal {
				writeCheckIDRealMessage(ws, data.From, data.Payload.ObjectType, true, data.Payload.Id)
			}
		}
	}

	return nil, nil
}

func writeCheckIDRealMessage(
	ws *websocket.Conn,
	from string,
	objetType string,
	real bool,
	objectId string,
) (interface{}, error) {
	requestId := uuid.New().String()
	payload := struct {
		ID         string `json:"id"`
		ObjectType string `json:"type"`
		IsReal     bool   `json:"real"`
		ObjectId   string `json:"objectID"`
	}{
		ID:         requestId,
		ObjectType: objetType,
		ObjectId:   objectId,
		IsReal:     real,
	}
	requestData := LocalTypes.WsReturnData[any]{
		Url:     from,
		Header:  nil,
		Payload: &payload,
		From:    "comic/CheckIdReal",
		Type:    "message",
	}
	requestDataBytes, err := json.Marshal(requestData)
	if err != nil {
		return nil, err
	}
	if err != nil {
		return nil, err
	}
	return nil, ws.WriteMessage(websocket.TextMessage, requestDataBytes)
}

func checkIdReal(client *mongo.Client, objectType string, id string) bool {
	if objectType == "comic" { // case comic
		comicModel, err := comic_model.InitComicModel(client)
		if err != nil {
			return false
		}
		comics, err := comicModel.Find(bson.M{
			"_id": id,
		})
		if err != nil {
			return false
		}
		if len(comics) > 0 {
			return true
		}
	} else if objectType == "comic_sessions" {
		comicSessionModel, err := comic_session_model.InitComicSessionModel(client)
		if err != nil {
			return false
		}
		comicSessions, err := comicSessionModel.Find(bson.M{
			"_id": id,
		})
		if err != nil {
			return false
		}
		if len(comicSessions) > 0 {
			return true
		}
	} else if objectType == "comic_chap" {
		comicChapModel, err := comic_chap_model.InitChapModel(client)
		if err != nil {
			return false
		}
		comicChaps, err := comicChapModel.Find(bson.M{
			"_id": id,
		})
		if err != nil {
			return false
		}
		if len(comicChaps) > 0 {
			return true
		}
	} else if objectType == "short_comic" {
		ShortComicModel, err := short_comic_model.InitShortComicModel(client)
		if err != nil {
			return false
		}
		ShortComics, err := ShortComicModel.Find(bson.M{
			"_id": id,
		})
		if err != nil {
			return false
		}
		if len(ShortComics) > 0 {
			return true
		}
	}
	return false
}
