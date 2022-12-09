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

type AuthPayloadReturn struct {
	SessionData *AuthSessionDataReturn `json:"sessionData"`
	ID          string                 `json:"id"`
}

type WsReturnData[T any] struct {
	Url     string       `json:"url"`
	Header  *interface{} `json:"header"`
	Payload T            `json:"payload"`
	Type    string       `json:"type"`
	Error   *string      `json:"error"`
}
