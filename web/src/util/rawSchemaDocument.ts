import { graphql } from "@graphql";

export const meQueryDocument = graphql(`query Me {\n  Me {\n    ...UserInfo\n  }\n}`)

export const loginMutationDocument = graphql(`mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}`)

export const registerMutationDocument = graphql(`mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}`)

export const TopViewComicsQueryDocument = graphql(`query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n  TopViewShortComics {\n    ...ShortComicInfo\n  }\n}`)

export const CreateComicMutationDocument = graphql(`mutation CreateComic($input: CreateComicInput!) {\n  createComic(input: $input) {\n    UploadToken\n    comic {\n      ...ComicInfo\n    }\n  }\n}`)

export const CreateShortComicMutationDocument = graphql(`mutation CreateShortComic($input: CreateShortComicInput!) {\n  createShortComic(input: $input) {\n    ShortComic {\n      ...ShortComicInfo\n    }\n    UploadToken\n  }\n}`)
export const EditPageComicByIDQueryDocument = graphql(
	'query EditPageComicByID($id: String!) {\n  ComicByID(ID: $id) {\n    CreatedByID\n    _id\n    background\n    createdAt\n    description\n    name\n    sessionId\n    thumbnail\n    updatedAt\n    views\n    session {\n      comicID\n      CreatedByID\n      Chaps {\n        _id\n        name\n        description\n        createdAt\n        updatedAt\n        views\n        CreatedByID\n        SessionID\n        ShortComicID\n      }\n      ChapIds\n      _id\n      createdAt\n      description\n      name\n      thumbnail\n      updatedAt\n      views\n    }\n  }\n}'
)