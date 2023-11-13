/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment ComicInfo on Comic {\n  _id\n  name\n  description\n  background\n  CreatedByID\n  createdAt\n  sessionId\n  thumbnail\n  updatedAt\n  views\n}": types.ComicInfoFragmentDoc,
    "fragment ShortComicInfo on ShortComic {\n  _id\n  ChapIDs\n  CreatedByID\n  background\n  createdAt\n  description\n  name\n  thumbnail\n  updatedAt\n  views\n}": types.ShortComicInfoFragmentDoc,
    "fragment UserInfo on User {\n  _id\n  email\n  name\n  updatedAt\n  createdAt\n  password\n  profile {\n    _id\n    comics {\n      ...ComicInfo\n    }\n    ShortComics {\n      ...ShortComicInfo\n    }\n  }\n}": types.UserInfoFragmentDoc,
    "mutation CreateComic($input: CreateComicInput!) {\n  createComic(input: $input) {\n    UploadToken\n    comic {\n      ...ComicInfo\n    }\n  }\n}": types.CreateComicDocument,
    "mutation CreateShortComic($input: CreateShortComicInput!) {\n  createShortComic(input: $input) {\n    ShortComic {\n      ...ShortComicInfo\n    }\n    UploadToken\n  }\n}": types.CreateShortComicDocument,
    "mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}": types.LoginDocument,
    "mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}": types.RegisterDocument,
    "query Me {\n  Me {\n    ...UserInfo\n  }\n}": types.MeDocument,
    "query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n  TopViewShortComics {\n    ...ShortComicInfo\n  }\n}": types.TopViewComicsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ComicInfo on Comic {\n  _id\n  name\n  description\n  background\n  CreatedByID\n  createdAt\n  sessionId\n  thumbnail\n  updatedAt\n  views\n}"): (typeof documents)["fragment ComicInfo on Comic {\n  _id\n  name\n  description\n  background\n  CreatedByID\n  createdAt\n  sessionId\n  thumbnail\n  updatedAt\n  views\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ShortComicInfo on ShortComic {\n  _id\n  ChapIDs\n  CreatedByID\n  background\n  createdAt\n  description\n  name\n  thumbnail\n  updatedAt\n  views\n}"): (typeof documents)["fragment ShortComicInfo on ShortComic {\n  _id\n  ChapIDs\n  CreatedByID\n  background\n  createdAt\n  description\n  name\n  thumbnail\n  updatedAt\n  views\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UserInfo on User {\n  _id\n  email\n  name\n  updatedAt\n  createdAt\n  password\n  profile {\n    _id\n    comics {\n      ...ComicInfo\n    }\n    ShortComics {\n      ...ShortComicInfo\n    }\n  }\n}"): (typeof documents)["fragment UserInfo on User {\n  _id\n  email\n  name\n  updatedAt\n  createdAt\n  password\n  profile {\n    _id\n    comics {\n      ...ComicInfo\n    }\n    ShortComics {\n      ...ShortComicInfo\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateComic($input: CreateComicInput!) {\n  createComic(input: $input) {\n    UploadToken\n    comic {\n      ...ComicInfo\n    }\n  }\n}"): (typeof documents)["mutation CreateComic($input: CreateComicInput!) {\n  createComic(input: $input) {\n    UploadToken\n    comic {\n      ...ComicInfo\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateShortComic($input: CreateShortComicInput!) {\n  createShortComic(input: $input) {\n    ShortComic {\n      ...ShortComicInfo\n    }\n    UploadToken\n  }\n}"): (typeof documents)["mutation CreateShortComic($input: CreateShortComicInput!) {\n  createShortComic(input: $input) {\n    ShortComic {\n      ...ShortComicInfo\n    }\n    UploadToken\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}"): (typeof documents)["mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}"): (typeof documents)["mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...UserInfo\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  Me {\n    ...UserInfo\n  }\n}"): (typeof documents)["query Me {\n  Me {\n    ...UserInfo\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n  TopViewShortComics {\n    ...ShortComicInfo\n  }\n}"): (typeof documents)["query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n  TopViewShortComics {\n    ...ShortComicInfo\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;