package LocalTypes

import "time"

type AuthSessionDataReturn struct {
	ID        string    `json:"_id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	CreatorID string    `json:"creatorID"`
	UserID    string    `json:"userID"`
}
type ServiceRequest struct {
	Url     string       `json:"url"`     // to service
	Header  *interface{} `json:"header"`  // header
	Payload any          `json:"payload"` // payload
	From    string       `json:"from"`    // from service ( alway is comic or shortComic )
	Type    string       `json:"type"`    // type of message ( req, message )
	ID      string       `json:"id"`      // request id
}

type BaseReturn struct {
	// ID string `json:"id,omitempty"` //because server don't validate this field
}

type AuthPayloadReturn struct {
	BaseReturn
	SessionData *AuthSessionDataReturn `json:"sessionData"`
}

type ServiceReturnData[T any, ht any] struct {
	Url     string  `json:"url"`
	Header  ht      `json:"header"`
	Payload T       `json:"payload"`
	Type    string  `json:"type"`
	Error   *string `json:"error"`
	From    string  `json:"from"`
	ID      string  `json:"id"`
}

type GetUploadTokenReturn struct {
	BaseReturn
	Token string `json:"token"`
}
type GetUploadTokensReturn struct {
	BaseReturn
	Token []string `json:"token"`
}

type BaseUploadedSocketPayload[T any] struct {
	BaseReturn
	Data T        `json:"data"`
	Url  []string `json:"url"`
}
type UploadedChapImagesSocketPayload struct {
	ChapId string `json:"chapId"`
}

type UploadComicThumbnailAndBackgroundPayload struct {
	ComicId string `json:"comicId"`
}

type UploadSessionComicThumbnailPayload struct {
	ComicSessionId string `json:"comicSessionId"`
}

type CheckIdRealPayload struct {
	Id         string `json:"objectId"`
	ObjectType string `json:"objectType"`
}

type ClientGetCdnImagePayload struct {
	RequestId string            `json:"request_id"`
	Headers   map[string]string `json:"headers"`
	ImageID   string            `json:"image_id"`
	Message   []byte            `json:"message"`
	ImageUrl  string            `json:"image_url"`
}
