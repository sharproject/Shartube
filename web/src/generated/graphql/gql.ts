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
    "fragment ComicInfo on Comic {\n  _id\n  name\n  description\n  background\n  CreatedByID\n}": types.ComicInfoFragmentDoc,
    "fragment userInfo on User {\n  _id\n  email\n  name\n  updatedAt\n  createdAt\n  password\n  profile {\n    _id\n    comics {\n      _id\n      name\n      description\n      thumbnail\n    }\n    ShortComics {\n      _id\n      name\n      description\n      thumbnail\n    }\n  }\n}": types.UserInfoFragmentDoc,
    "mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...userInfo\n    }\n  }\n}": types.LoginDocument,
    "mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...userInfo\n    }\n  }\n}": types.RegisterDocument,
    "query Me {\n  Me {\n    ...userInfo\n  }\n}": types.MeDocument,
    "query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n}": types.TopViewComicsDocument,
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
export function graphql(source: "fragment ComicInfo on Comic {\n  _id\n  name\n  description\n  background\n  CreatedByID\n}"): (typeof documents)["fragment ComicInfo on Comic {\n  _id\n  name\n  description\n  background\n  CreatedByID\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userInfo on User {\n  _id\n  email\n  name\n  updatedAt\n  createdAt\n  password\n  profile {\n    _id\n    comics {\n      _id\n      name\n      description\n      thumbnail\n    }\n    ShortComics {\n      _id\n      name\n      description\n      thumbnail\n    }\n  }\n}"): (typeof documents)["fragment userInfo on User {\n  _id\n  email\n  name\n  updatedAt\n  createdAt\n  password\n  profile {\n    _id\n    comics {\n      _id\n      name\n      description\n      thumbnail\n    }\n    ShortComics {\n      _id\n      name\n      description\n      thumbnail\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...userInfo\n    }\n  }\n}"): (typeof documents)["mutation Login($input: LoginUserInput!) {\n  Login(input: $input) {\n    accessToken\n    user {\n      ...userInfo\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...userInfo\n    }\n  }\n}"): (typeof documents)["mutation Register($input: RegisterUserInput!) {\n  Register(input: $input) {\n    accessToken\n    user {\n      ...userInfo\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  Me {\n    ...userInfo\n  }\n}"): (typeof documents)["query Me {\n  Me {\n    ...userInfo\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n}"): (typeof documents)["query TopViewComics {\n  TopViewComic {\n    ...ComicInfo\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;