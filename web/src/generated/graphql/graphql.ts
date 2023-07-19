/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AddUserToTeamInput = {
  TeamID: Scalars['String']['input'];
  UserID: Scalars['String']['input'];
};

export type Chap = CreateChap & {
  __typename?: 'Chap';
  CreatedBy?: Maybe<User>;
  CreatedByID: Scalars['String']['output'];
  Images: Array<ImageResult>;
  Session?: Maybe<ComicSession>;
  SessionID?: Maybe<Scalars['String']['output']>;
  ShortComic?: Maybe<ShortComic>;
  ShortComicID?: Maybe<Scalars['String']['output']>;
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['Time']['output'];
};

export type Comic = CreateComic & {
  __typename?: 'Comic';
  CreatedBy?: Maybe<User>;
  CreatedByID: Scalars['String']['output'];
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  session?: Maybe<Array<ComicSession>>;
  sessionId?: Maybe<Array<Scalars['String']['output']>>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
};

export type ComicSession = CreateComicSession & {
  __typename?: 'ComicSession';
  ChapIds?: Maybe<Array<Scalars['String']['output']>>;
  Chaps?: Maybe<Array<Chap>>;
  Comic: Comic;
  CreatedBy?: Maybe<User>;
  CreatedByID: Scalars['String']['output'];
  _id: Scalars['ID']['output'];
  comicID: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
};

export type CreateChap = {
  SessionID?: Maybe<Scalars['String']['output']>;
  ShortComicID?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type CreateChapInput = {
  SessionID?: InputMaybe<Scalars['String']['input']>;
  ShortComicID?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateChapInputModel = CreateChap & {
  __typename?: 'CreateChapInputModel';
  CreatedByID: Scalars['String']['output'];
  SessionID?: Maybe<Scalars['String']['output']>;
  ShortComicID?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type CreateComic = {
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CreateComicInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateComicInputModel = CreateComic & {
  __typename?: 'CreateComicInputModel';
  CreatedByID: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CreateComicResponse = {
  __typename?: 'CreateComicResponse';
  UploadToken?: Maybe<Scalars['String']['output']>;
  comic: Comic;
};

export type CreateComicSession = {
  comicID: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CreateComicSessionInput = {
  comicID: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateComicSessionInputModel = CreateComicSession & {
  __typename?: 'CreateComicSessionInputModel';
  CreatedByID: Scalars['String']['output'];
  comicID: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CreateComicSessionResponse = {
  __typename?: 'CreateComicSessionResponse';
  ComicSession: ComicSession;
  UploadToken?: Maybe<Scalars['String']['output']>;
};

export type CreateShortComic = {
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CreateShortComicInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateShortComicInputModel = CreateShortComic & {
  __typename?: 'CreateShortComicInputModel';
  CreatedByID: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CreateShortComicResponse = {
  __typename?: 'CreateShortComicResponse';
  ShortComic: ShortComic;
  UploadToken?: Maybe<Scalars['String']['output']>;
};

export type CreateTeamInput = {
  name: Scalars['String']['input'];
};

export type DeleteResult = {
  __typename?: 'DeleteResult';
  id: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ImageResult = {
  __typename?: 'ImageResult';
  ID: Scalars['String']['output'];
  Url: Scalars['String']['output'];
};

export type LikeMutationInput = {
  objectId: Scalars['String']['input'];
  /** type of object like comic, short_comic, comic_session, comic_chap, short_comic_chap */
  type: Scalars['String']['input'];
};

export type LikeServiceQueryReturn = {
  __typename?: 'LikeServiceQueryReturn';
  sdl: Scalars['String']['output'];
};

export type LoginUserInput = {
  UsernameOrEmail: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  AddImageToChap?: Maybe<Scalars['String']['output']>;
  AddUserToTeam: User;
  CreateChap: Chap;
  CreateComicSession: CreateComicSessionResponse;
  CreateTeam: User;
  DeleteChap: DeleteResult;
  DeleteChapImage: Chap;
  DeleteComic: DeleteResult;
  DeleteComicSession: DeleteResult;
  DeleteShortComic: DeleteResult;
  Login: UserLoginOrRegisterResponse;
  Register: UserLoginOrRegisterResponse;
  RemoveUserInTeam?: Maybe<User>;
  UpdateChap: Chap;
  _empty?: Maybe<Scalars['String']['output']>;
  createComic: CreateComicResponse;
  createShortComic: CreateShortComicResponse;
  like: Scalars['String']['output'];
  updateComic: UploadComicResponse;
  updateComicSession: UpdateComicSessionResponse;
  updateShortComic: UpdateShortComicResponse;
};


export type MutationAddImageToChapArgs = {
  chapID: Scalars['String']['input'];
};


export type MutationAddUserToTeamArgs = {
  input: AddUserToTeamInput;
};


export type MutationCreateChapArgs = {
  input: CreateChapInput;
};


export type MutationCreateComicSessionArgs = {
  input: CreateComicSessionInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationDeleteChapArgs = {
  chapID: Scalars['String']['input'];
};


export type MutationDeleteChapImageArgs = {
  chapID: Scalars['String']['input'];
  imageID: Array<Scalars['String']['input']>;
};


export type MutationDeleteComicArgs = {
  comicID: Scalars['String']['input'];
};


export type MutationDeleteComicSessionArgs = {
  sessionID: Scalars['String']['input'];
};


export type MutationDeleteShortComicArgs = {
  ShortComicID: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginUserInput;
};


export type MutationRegisterArgs = {
  input: RegisterUserInput;
};


export type MutationRemoveUserInTeamArgs = {
  input: AddUserToTeamInput;
};


export type MutationUpdateChapArgs = {
  chapID: Scalars['String']['input'];
  input: UpdateChapInput;
};


export type MutationCreateComicArgs = {
  input: CreateComicInput;
};


export type MutationCreateShortComicArgs = {
  input: CreateShortComicInput;
};


export type MutationLikeArgs = {
  input: LikeMutationInput;
};


export type MutationUpdateComicArgs = {
  comicID: Scalars['String']['input'];
  input: UpdateComicInput;
};


export type MutationUpdateComicSessionArgs = {
  input?: InputMaybe<UpdateComicSessionInput>;
  sessionID: Scalars['String']['input'];
};


export type MutationUpdateShortComicArgs = {
  ShortComicID: Scalars['String']['input'];
  input: UpdateShortComicInput;
};

export type Query = {
  __typename?: 'Query';
  ChapBySession?: Maybe<Array<Chap>>;
  Comics: Array<Comic>;
  Me: User;
  PageFromId?: Maybe<User>;
  SessionByComic?: Maybe<Array<ComicSession>>;
  ShortComicByID?: Maybe<ShortComic>;
  ShortComics: Array<ShortComic>;
  apiVersion: Scalars['String']['output'];
};


export type QueryChapBySessionArgs = {
  SessionID: Scalars['String']['input'];
};


export type QueryPageFromIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySessionByComicArgs = {
  comicID: Scalars['String']['input'];
};


export type QueryShortComicByIdArgs = {
  id: Scalars['String']['input'];
};

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ShortComic = CreateShortComic & {
  __typename?: 'ShortComic';
  Chap?: Maybe<Array<Chap>>;
  ChapIDs?: Maybe<Array<Scalars['String']['output']>>;
  CreatedBy?: Maybe<User>;
  CreatedByID: Scalars['String']['output'];
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
};

export type UpdateChapInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateComicInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateComicInputModel = {
  __typename?: 'UpdateComicInputModel';
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type UpdateComicSessionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateComicSessionInputModel = {
  __typename?: 'UpdateComicSessionInputModel';
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type UpdateComicSessionResponse = {
  __typename?: 'UpdateComicSessionResponse';
  ComicSession: ComicSession;
  UploadToken?: Maybe<Scalars['String']['output']>;
};

export type UpdateShortComicInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateShortComicInputModel = {
  __typename?: 'UpdateShortComicInputModel';
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type UpdateShortComicResponse = {
  __typename?: 'UpdateShortComicResponse';
  ShortComic: ShortComic;
  UploadToken?: Maybe<Scalars['String']['output']>;
};

export type UploadComicResponse = {
  __typename?: 'UploadComicResponse';
  UploadToken?: Maybe<Scalars['String']['output']>;
  comic: Comic;
};

export type User = {
  __typename?: 'User';
  ShortComicIDs: Array<Maybe<Scalars['String']['output']>>;
  ShortComics: Array<Maybe<ShortComic>>;
  _id: Scalars['ID']['output'];
  comicIDs: Array<Maybe<Scalars['String']['output']>>;
  comics: Array<Maybe<Comic>>;
  createdAt: Scalars['Time']['output'];
  email: Scalars['String']['output'];
  isTeam?: Maybe<Scalars['Boolean']['output']>;
  member?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name: Scalars['String']['output'];
  owner?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
};

export type UserLoginOrRegisterResponse = {
  __typename?: 'UserLoginOrRegisterResponse';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type UserInfoFragment = { __typename?: 'User', _id: string, email: string, name: string, ShortComicIDs: Array<string | null>, comicIDs: Array<string | null>, updatedAt: any, createdAt: any, password?: string | null } & { ' $fragmentName'?: 'UserInfoFragment' };

export type LoginMutationVariables = Exact<{
  input: LoginUserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', Login: { __typename?: 'UserLoginOrRegisterResponse', accessToken: string, user: (
      { __typename?: 'User' }
      & { ' $fragmentRefs'?: { 'UserInfoFragment': UserInfoFragment } }
    ) } };

export type RegisterMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', Register: { __typename?: 'UserLoginOrRegisterResponse', accessToken: string, user: (
      { __typename?: 'User' }
      & { ' $fragmentRefs'?: { 'UserInfoFragment': UserInfoFragment } }
    ) } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', Me: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'UserInfoFragment': UserInfoFragment } }
  ) };

export const UserInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ShortComicIDs"}},{"kind":"Field","name":{"kind":"Name","value":"comicIDs"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]} as unknown as DocumentNode<UserInfoFragment, unknown>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ShortComicIDs"}},{"kind":"Field","name":{"kind":"Name","value":"comicIDs"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ShortComicIDs"}},{"kind":"Field","name":{"kind":"Name","value":"comicIDs"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ShortComicIDs"}},{"kind":"Field","name":{"kind":"Name","value":"comicIDs"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;