package LocalTypes

import "time"

type AuthSessionDataReturn struct {
	ID        string    `json:"_id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	CreatorID string    `json:"creatorID"`
	UserID    string    `json:"userID"`
}
type WsRequest struct {
	Url     string       `json:"url"`
	Header  *interface{} `json:"header"`
	Payload any          `json:"payload"`
	From    string       `json:"from"`
	Type    string       `json:"type"`
}

type BaseReturn struct {
	ID string `json:"id"`
}

type AuthPayloadReturn struct {
	BaseReturn
	SessionData *AuthSessionDataReturn `json:"sessionData"`
}

type WsReturnData[T any] struct {
	Url     string       `json:"url"`
	Header  *interface{} `json:"header"`
	Payload T            `json:"payload"`
	Type    string       `json:"type"`
	Error   *string      `json:"error"`
	From    string       `json:"from"`
}

type GetUploadTokenReturn struct {
	BaseReturn
	Token string `json:"token"`
}

type BaseUploadedSocketPayload[T any] struct {
	BaseReturn
	Data T        `json:"data"`
	Url  []string `json:"url"`
}
type UploadedChapImagesSocketPayload struct {
	ChapId string `json:"chapId"`
}

type UploadedComicThumbnailPayload struct {
	ComicId string `json:"comicId"`
}

type UploadSessionComicThumbnailPayload struct {
	ComicSessionId string `json:"comicSessionId"`
}

type CheckIdRealPayload struct {
	Id string `json:"objectId"`
	ObjectType string `json:"objectType"`
}
