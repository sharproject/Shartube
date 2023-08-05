package ws

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/Folody-Team/Shartube/LocalTypes"
	"github.com/Folody-Team/Shartube/database/comic_chap_model"
	"github.com/Folody-Team/Shartube/database/comic_model"
	"github.com/Folody-Team/Shartube/database/comic_session_model"
	"github.com/Folody-Team/Shartube/database/short_comic_model"
	"github.com/Folody-Team/Shartube/graphql/model"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const REDIS_KEY_PREFIX = "shartube_comic:"

func HandleWs(message []byte, ws *websocket.Conn, MongoClient *mongo.Client, RedisClient *redis.Client) (*interface{}, error) {
	ctx := context.Background()
	var data LocalTypes.WsReturnData[interface{}, *interface{}]
	err := json.Unmarshal(message, &data)
	if err != nil {
		return nil, err
	}
	if data.Type == "message" {
		if data.From == "upload_token_registry/user_upload_webhook" {
			if data.Url == "comic/SocketAddImagesToChap" {
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadedChapImagesSocketPayload], *interface{}]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				fmt.Printf("data.Payload.Data.ChapId: %v\n", data.Payload.Data.ChapId)
				comicChapModel, err := comic_chap_model.InitChapModel(MongoClient)
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
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadComicThumbnailAndBackgroundPayload], *interface{}]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				comicModel, err := comic_model.InitComicModel(MongoClient)
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
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadComicThumbnailAndBackgroundPayload], *interface{}]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				comicModel, err := comic_model.InitComicModel(MongoClient)
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
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadSessionComicThumbnailPayload], *interface{}]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				comicSessionModel, err := comic_session_model.InitComicSessionModel(MongoClient)
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
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadedChapImagesSocketPayload], *interface{}]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				fmt.Printf("data.Payload.Data.ChapId: %v\n", data.Payload.Data.ChapId)
				comicChapModel, err := comic_chap_model.InitChapModel(MongoClient)
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
				var data LocalTypes.WsReturnData[LocalTypes.BaseUploadedSocketPayload[LocalTypes.UploadComicThumbnailAndBackgroundPayload], *interface{}]
				err := json.Unmarshal(message, &data)
				if err != nil {
					return nil, err
				}
				comicModel, err := comic_model.InitComicModel(MongoClient)
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
			var data LocalTypes.WsReturnData[LocalTypes.CheckIdRealPayload, *interface{}]
			err := json.Unmarshal(message, &data)
			if err != nil {
				return nil, err
			}
			isReal := checkIdReal(MongoClient, data.Payload.ObjectType, data.Payload.Id)
			if isReal {
				writeCheckIDRealMessage(ws, data.From, data.Payload.ObjectType, true, data.Payload.Id)
			}
		} else if data.Url == "all/client_get_cdn_image" {
			var data LocalTypes.WsReturnData[LocalTypes.ClientGetCdnImagePayload, map[string]string]
			err := json.Unmarshal(message, &data)
			if err != nil {
				return nil, err
			}
			chapModel, err := comic_chap_model.InitChapModel(MongoClient)
			if err != nil {
				return nil, err
			}
			chapDoc, err := chapModel.FindOne(bson.M{"Images": bson.M{
				"Url": data.Payload.ImageID,
			}})
			if err != nil {
				return nil, err
			}

			remoteIp := data.Header["RemoteAddr"]
			redisKey := REDIS_KEY_PREFIX + remoteIp
			remoteHistory, err := RedisClient.HGetAll(ctx, redisKey).Result()
			if err != nil {
				switch {
				case err == redis.Nil:
					log.Println("key does not exist key: ", redisKey)
					remoteHistory = map[string]string{
						"imagesWatch": "",
						"chapsWatch":  "",
					}
				case err != nil:
					return nil, err
				}
			}
			imagesWatch := strings.Split(remoteHistory["imagesWatch"], ",")
			if imagesWatch[len(imagesWatch)-1] == data.Payload.ImageID {
				return nil, nil
			}
			imagesWatch = append(imagesWatch, data.Payload.ImageID)

			chapsWatch := strings.Split(remoteHistory["chapsWatch"], ",")

			if chapsWatch[len(chapsWatch)-1] != chapDoc.ID {
				chapModel.UpdateOne(bson.M{
					"_id": chapDoc.ID,
				}, bson.M{
					"$inc": bson.M{
						"views": 1,
					},
				})
				if chapDoc.SessionID != nil {
					// update session and comic
					comicSessionModel, err := comic_session_model.InitComicSessionModel(MongoClient)
					if err != nil {
						return nil, err
					}
					comicSessionDoc, err := comicSessionModel.FindOneAndUpdate(bson.M{
						"_id": chapDoc.SessionID,
					}, bson.M{
						"$inc": bson.M{
							"views": 1,
						},
					})
					if err != nil {
						return nil, err
					}
					comicModel, err := comic_model.InitComicModel(MongoClient)
					if err != nil {
						return nil, err
					}
					_, err = comicModel.FindOneAndUpdate(bson.M{
						"_id": comicSessionDoc.ComicID,
					}, bson.M{"$inc": bson.M{
						"views": 1,
					}})
					if err != nil {
						return nil, err
					}
				}
				if chapDoc.ShortComicID != nil {
					// update short comic
					ShortComicModel, err := short_comic_model.InitShortComicModel(MongoClient)
					if err != nil {
						return nil, err
					}
					_, err = ShortComicModel.FindOneAndUpdate(bson.M{
						"_id": chapDoc.SessionID,
					}, bson.M{
						"$inc": bson.M{
							"views": 1,
						},
					})
					if err != nil {
						return nil, err
					}
				}
				chapsWatch = append(chapsWatch, chapDoc.ID)
			}
			RedisClient.HSet(ctx, redisKey, map[string]interface{}{
				"imagesWatch": strings.Join(imagesWatch, ","),
				"chapsWatch":  strings.Join(chapsWatch, ","),
			})
			_, err = RedisClient.Expire(ctx, remoteIp, 4*time.Hour).Result()
			if err != nil {
				return nil, err
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
	requestData := LocalTypes.WsReturnData[any, *any]{
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
