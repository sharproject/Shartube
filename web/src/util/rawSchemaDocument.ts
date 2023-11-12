import { graphql } from "@graphql";

export const meQueryDocument = graphql(`query Me {\n  Me {\n    ...UserInfo\n  }\n}`)

export const loginMutationDocument = graphql(`mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}`)

export const registerMutationDocument = graphql(`mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}`)

export const TopViewComicsQueryDocument = graphql(`query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n  TopViewShortComics {\n    ...ShortComicInfo\n  }\n}`)
