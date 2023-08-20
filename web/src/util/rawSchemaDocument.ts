import { graphql } from "@graphql";

export const meQueryDocument = graphql(`query Me {
  Me {
    ...userInfo
  }
}`)

export const loginMutationDocument = graphql(`mutation Login($input: LoginUserInput!) {
  Login(input: $input) {
    accessToken
    user {
      ...userInfo
    }
  }
}`)

export const registerMutationDocument= graphql(`mutation Register($input: RegisterUserInput!) {
  Register(input: $input) {
    accessToken
    user {
      ...userInfo
    }
  }
}`)
export const TopViewComicsQueryDocument = graphql(`query TopViewComics {
  TopViewComic {
    ...ComicInfo
  }
}`)
