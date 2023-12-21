import { graphql } from "@graphql";

export const meQueryDocument = graphql(`query Me {\n  Me {\n    ...UserInfo\n  }\n}`)

export const loginMutationDocument = graphql(`mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}`)

export const registerMutationDocument = graphql(`mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}`)

export const TopViewComicsQueryDocument = graphql(`query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n  TopViewShortComics {\n    ...ShortComicInfo\n  }\n}`)

export const CreateComicMutationDocument = graphql(`mutation CreateComic($input: CreateComicInput!) {\n  createComic(input: $input) {\n    UploadToken\n    comic {\n      ...ComicInfo\n    }\n  }\n}`)

export const CreateShortComicMutationDocument = graphql(`mutation CreateShortComic($input: CreateShortComicInput!) {\n  createShortComic(input: $input) {\n    ShortComic {\n      ...ShortComicInfo\n    }\n    UploadToken\n  }\n}`)
export const EditPageComicByIDQueryDocument = graphql(`query EditPageComicByID($id: String!) {\n  ComicByID(ID: $id) {\n    ...EditPageComicInfo\n  }\n}`
)
export const UserProfileDocument = graphql(`fragment UserProfile on Profile {\n  _id\n  comics {\n    ...ComicInfo\n  }\n  ShortComics {\n    ...ShortComicInfo\n  }\n}`)