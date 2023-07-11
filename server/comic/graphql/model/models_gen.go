// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)

type CreateChap interface {
	IsCreateChap()
}

type CreateComic interface {
	IsCreateComic()
}

type CreateComicSession interface {
	IsCreateComicSession()
}

type CreateShortComic interface {
	IsCreateShortComic()
}

type Chap struct {
	ID           string         `json:"_id" bson:"_id"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	CreatedByID  string         `json:"CreatedByID"`
	Name         string         `json:"name"`
	Description  *string        `json:"description"`
	SessionID    *string        `json:"SessionID"`
	ShortComicID *string        `json:"ShortComicID"`
	Session      *ComicSession  `json:"Session"`
	ShortComic   *ShortComic    `json:"ShortComic"`
	Images       []*ImageResult `json:"Images"`
}

func (Chap) IsCreateChap() {}
func (Chap) IsEntity()     {}

type Comic struct {
	ID          string          `json:"_id" bson:"_id"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
	CreatedByID string          `json:"CreatedByID"`
	Name        string          `json:"name"`
	Description *string         `json:"description"`
	SessionID   []string        `json:"sessionId"`
	Session     []*ComicSession `json:"session"`
	Thumbnail   *string         `json:"thumbnail"`
}

func (Comic) IsCreateComic() {}

type ComicSession struct {
	ID          string    `json:"_id" bson:"_id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	CreatedByID string    `json:"CreatedByID"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	ComicID     string    `json:"comicID"`
	Comic       *Comic    `json:"Comic"`
	Chaps       []*Chap   `json:"Chaps"`
	ChapIds     []string  `json:"ChapIds"`
	Thumbnail   *string   `json:"thumbnail"`
}

func (ComicSession) IsCreateComicSession() {}

type CreateChapInput struct {
	Name         string  `json:"name"`
	Description  *string `json:"description"`
	SessionID    *string `json:"SessionID"`
	ShortComicID *string `json:"ShortComicID"`
}

type CreateChapInputModel struct {
	Name         string  `json:"name"`
	Description  *string `json:"description"`
	CreatedByID  string  `json:"CreatedByID"`
	SessionID    *string `json:"SessionID"`
	ShortComicID *string `json:"ShortComicID"`
}

func (CreateChapInputModel) IsCreateChap() {}

type CreateComicInput struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	Thumbnail   *bool   `json:"thumbnail"`
}

type CreateComicInputModel struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	CreatedByID string  `json:"CreatedByID"`
	Thumbnail   *string `json:"thumbnail"`
}

func (CreateComicInputModel) IsCreateComic() {}

type CreateComicResponse struct {
	Comic       *Comic  `json:"comic"`
	UploadToken *string `json:"UploadToken"`
}

type CreateComicSessionInput struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	ComicID     string  `json:"comicID"`
	Thumbnail   *bool   `json:"thumbnail"`
}

type CreateComicSessionInputModel struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	CreatedByID string  `json:"CreatedByID"`
	ComicID     string  `json:"comicID"`
	Thumbnail   *string `json:"thumbnail"`
}

func (CreateComicSessionInputModel) IsCreateComicSession() {}

type CreateComicSessionResponse struct {
	ComicSession *ComicSession `json:"ComicSession"`
	UploadToken  *string       `json:"UploadToken"`
}

type CreateShortComicInput struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	Thumbnail   *bool   `json:"thumbnail"`
}

type CreateShortComicInputModel struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	CreatedByID string  `json:"CreatedByID"`
	Thumbnail   *string `json:"thumbnail"`
}

func (CreateShortComicInputModel) IsCreateShortComic() {}

type CreateShortComicResponse struct {
	ShortComic  *ShortComic `json:"ShortComic"`
	UploadToken *string     `json:"UploadToken"`
}

type DeleteResult struct {
	Success bool   `json:"success"`
	ID      string `json:"id"`
}

type ImageResult struct {
	ID  string `json:"ID"`
	URL string `json:"Url"`
}

type Profile struct {
	CreateID    string        `json:"CreateID"`
	Comics      []*Comic      `json:"comics"`
	ShortComics []*ShortComic `json:"ShortComics"`
}

func (Profile) IsEntity() {}

type ShortComic struct {
	ID          string    `json:"_id" bson:"_id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	CreatedByID string    `json:"CreatedByID"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	ChapIDs     []string  `json:"ChapIDs"`
	Chap        []*Chap   `json:"Chap"`
	Thumbnail   *string   `json:"thumbnail"`
}

func (ShortComic) IsCreateShortComic() {}

type UpdateChapInput struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
}

type UpdateComicInput struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	Thumbnail   *bool   `json:"thumbnail"`
}

type UpdateComicInputModel struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	Thumbnail   *string `json:"thumbnail"`
}

type UpdateComicSessionInput struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	Thumbnail   *bool   `json:"thumbnail"`
}

type UpdateComicSessionInputModel struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	Thumbnail   *string `json:"thumbnail"`
}

type UpdateComicSessionResponse struct {
	ComicSession *ComicSession `json:"ComicSession"`
	UploadToken  *string       `json:"UploadToken"`
}

type UpdateShortComicInput struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	Thumbnail   *bool   `json:"thumbnail"`
}

type UpdateShortComicInputModel struct {
	Name        *string `json:"name"`
	Description *string `json:"description"`
	Thumbnail   *string `json:"thumbnail"`
}

type UpdateShortComicResponse struct {
	ShortComic  *ShortComic `json:"ShortComic"`
	UploadToken *string     `json:"UploadToken"`
}

type UploadComicResponse struct {
	Comic       *Comic  `json:"comic"`
	UploadToken *string `json:"UploadToken"`
}
