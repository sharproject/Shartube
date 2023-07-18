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
