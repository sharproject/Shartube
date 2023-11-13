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
  views: Scalars['Int']['output'];
};

export type Comic = CreateComic & {
  __typename?: 'Comic';
  CreatedByID: Scalars['String']['output'];
  _id: Scalars['ID']['output'];
  background?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  session?: Maybe<Array<ComicSession>>;
  sessionId?: Maybe<Array<Scalars['String']['output']>>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
  views: Scalars['Int']['output'];
};

export type ComicSession = CreateComicSession & {
  __typename?: 'ComicSession';
  ChapIds?: Maybe<Array<Scalars['String']['output']>>;
  Chaps?: Maybe<Array<Chap>>;
  Comic: Comic;
  CreatedByID: Scalars['String']['output'];
  _id: Scalars['ID']['output'];
  comicID: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
  views: Scalars['Int']['output'];
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
  views: Scalars['Int']['output'];
};

export type CreateComic = {
  background?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CreateComicInput = {
  background?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateComicInputModel = CreateComic & {
  __typename?: 'CreateComicInputModel';
  CreatedByID: Scalars['String']['output'];
  background?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  views: Scalars['Int']['output'];
};

export type CreateComicResponse = {
  __typename?: 'CreateComicResponse';
  UploadToken?: Maybe<Array<Scalars['String']['output']>>;
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
  views: Scalars['Int']['output'];
};

export type CreateComicSessionResponse = {
  __typename?: 'CreateComicSessionResponse';
  ComicSession: ComicSession;
  UploadToken?: Maybe<Scalars['String']['output']>;
};

export type CreateShortComic = {
  background?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CreateShortComicInput = {
  background?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateShortComicInputModel = CreateShortComic & {
  __typename?: 'CreateShortComicInputModel';
  CreatedByID: Scalars['String']['output'];
  background?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  views: Scalars['Int']['output'];
};

export type CreateShortComicResponse = {
  __typename?: 'CreateShortComicResponse';
  ShortComic: ShortComic;
  UploadToken?: Maybe<Array<Scalars['String']['output']>>;
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

export type LikeAndDislikeResult = {
  __typename?: 'LikeAndDislikeResult';
  likeInfo: LikeInfoResult;
  likes: LikeResult;
};

export type LikeInfoResult = {
  __typename?: 'LikeInfoResult';
  _id: Scalars['String']['output'];
  likeNumber: Scalars['Int']['output'];
  likesId: Scalars['String']['output'];
  objectId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type LikeMutationInput = {
  objectId: Scalars['String']['input'];
  /** type of object like comic, short_comic, comic_session, comic_chap, short_comic_chap */
  type: Scalars['String']['input'];
};

export type LikeResult = {
  __typename?: 'LikeResult';
  _id: Scalars['String']['output'];
  likeInfoIds: Array<Scalars['String']['output']>;
  numberOfLike: Scalars['Int']['output'];
  objectId: Scalars['String']['output'];
  objectType: Scalars['String']['output'];
};

export type LikeServiceQueryReturn = {
  __typename?: 'LikeServiceQueryReturn';
  sdl: Scalars['String']['output'];
};

export type LikesByObjectIdResult = {
  __typename?: 'LikesByObjectIdResult';
  likes: LikeResult;
  myLikeInfo?: Maybe<LikeInfoResult>;
};

export type LoginUserInput = {
  UsernameOrEmail: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  AddImageToChap?: Maybe<Scalars['String']['output']>;
  AddUserToTeam: Team;
  CreateChap: Chap;
  CreateComicSession: CreateComicSessionResponse;
  CreateTeam: Team;
  DeleteChap: DeleteResult;
  DeleteChapImage: Chap;
  DeleteComic: DeleteResult;
  DeleteComicSession: DeleteResult;
  DeleteShortComic: DeleteResult;
  Login: UserLoginOrRegisterResponse;
  Register: UserLoginOrRegisterResponse;
  RemoveUserInTeam: Team;
  UpdateChap: Chap;
  createComic: CreateComicResponse;
  createShortComic: CreateShortComicResponse;
  dislike: LikeAndDislikeResult;
  like: LikeAndDislikeResult;
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


export type MutationDislikeArgs = {
  input: LikeMutationInput;
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

export type Profile = {
  __typename?: 'Profile';
  CreateID: Scalars['ID']['output'];
  ShortComics: Array<Maybe<ShortComic>>;
  _id: Scalars['ID']['output'];
  comics: Array<Maybe<Comic>>;
};

export type Query = {
  __typename?: 'Query';
  ChapByID?: Maybe<Chap>;
  ChapBySession?: Maybe<Array<Chap>>;
  ComicByID?: Maybe<Comic>;
  Comics: Array<Comic>;
  FindProfileById: Profile;
  LikesByObjectId: LikesByObjectIdResult;
  Me: User;
  PageFromId?: Maybe<UserOrTeam>;
  SessionByComic?: Maybe<Array<ComicSession>>;
  SessionByID?: Maybe<ComicSession>;
  ShortComicByID?: Maybe<ShortComic>;
  ShortComics: Array<ShortComic>;
  TopViewComic: Array<Maybe<Comic>>;
  TopViewShortComics: Array<ShortComic>;
  apiVersion: Scalars['String']['output'];
};


export type QueryChapByIdArgs = {
  ID: Scalars['String']['input'];
};


export type QueryChapBySessionArgs = {
  SessionID: Scalars['String']['input'];
};


export type QueryComicByIdArgs = {
  ID: Scalars['String']['input'];
};


export type QueryFindProfileByIdArgs = {
  UserOrTeamId: Scalars['String']['input'];
};


export type QueryLikesByObjectIdArgs = {
  objectId: Scalars['String']['input'];
};


export type QueryPageFromIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySessionByComicArgs = {
  comicID: Scalars['String']['input'];
};


export type QuerySessionByIdArgs = {
  ID: Scalars['String']['input'];
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
  CreatedByID: Scalars['String']['output'];
  _id: Scalars['ID']['output'];
  background?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
  views: Scalars['Int']['output'];
};

export type Team = {
  __typename?: 'Team';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Time']['output'];
  member: Array<Maybe<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  profile?: Maybe<Profile>;
  updatedAt: Scalars['Time']['output'];
};

export type UpdateChapInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateComicInput = {
  background?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateComicInputModel = {
  __typename?: 'UpdateComicInputModel';
  background?: Maybe<Scalars['String']['output']>;
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
  background?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateShortComicInputModel = {
  __typename?: 'UpdateShortComicInputModel';
  background?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type UpdateShortComicResponse = {
  __typename?: 'UpdateShortComicResponse';
  ShortComic: ShortComic;
  UploadToken?: Maybe<Array<Scalars['String']['output']>>;
};

export type UploadComicResponse = {
  __typename?: 'UploadComicResponse';
  UploadToken?: Maybe<Array<Scalars['String']['output']>>;
  comic: Comic;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Time']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  profile?: Maybe<Profile>;
  updatedAt: Scalars['Time']['output'];
};

export type UserLoginOrRegisterResponse = {
  __typename?: 'UserLoginOrRegisterResponse';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type UserOrTeam = Team | User;

export type ComicInfoFragment = { __typename?: 'Comic', _id: string, name: string, description?: string | null, background?: string | null, CreatedByID: string, createdAt: any, sessionId?: Array<string> | null, thumbnail?: string | null, updatedAt: any, views: number };

export type ShortComicInfoFragment = { __typename?: 'ShortComic', _id: string, ChapIDs?: Array<string> | null, CreatedByID: string, background?: string | null, createdAt: any, description?: string | null, name: string, thumbnail?: string | null, updatedAt: any, views: number };

export type UserInfoFragment = { __typename?: 'User', _id: string, email: string, name: string, updatedAt: any, createdAt: any, password: string, profile?: { __typename?: 'Profile', _id: string, comics: Array<{ __typename?: 'Comic', _id: string, name: string, description?: string | null, background?: string | null, CreatedByID: string, createdAt: any, sessionId?: Array<string> | null, thumbnail?: string | null, updatedAt: any, views: number } | null>, ShortComics: Array<{ __typename?: 'ShortComic', _id: string, ChapIDs?: Array<string> | null, CreatedByID: string, background?: string | null, createdAt: any, description?: string | null, name: string, thumbnail?: string | null, updatedAt: any, views: number } | null> } | null };

export type CreateComicMutationVariables = Exact<{
  input: CreateComicInput;
}>;


export type CreateComicMutation = { __typename?: 'Mutation', createComic: { __typename?: 'CreateComicResponse', UploadToken?: Array<string> | null, comic: { __typename?: 'Comic', _id: string, name: string, description?: string | null, background?: string | null, CreatedByID: string, createdAt: any, sessionId?: Array<string> | null, thumbnail?: string | null, updatedAt: any, views: number } } };

export type CreateShortComicMutationVariables = Exact<{
  input: CreateShortComicInput;
}>;


export type CreateShortComicMutation = { __typename?: 'Mutation', createShortComic: { __typename?: 'CreateShortComicResponse', UploadToken?: Array<string> | null, ShortComic: { __typename?: 'ShortComic', _id: string, ChapIDs?: Array<string> | null, CreatedByID: string, background?: string | null, createdAt: any, description?: string | null, name: string, thumbnail?: string | null, updatedAt: any, views: number } } };

export type LoginMutationVariables = Exact<{
  input: LoginUserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', Login: { __typename?: 'UserLoginOrRegisterResponse', accessToken: string, user: { __typename?: 'User', _id: string, email: string, name: string, updatedAt: any, createdAt: any, password: string, profile?: { __typename?: 'Profile', _id: string, comics: Array<{ __typename?: 'Comic', _id: string, name: string, description?: string | null, background?: string | null, CreatedByID: string, createdAt: any, sessionId?: Array<string> | null, thumbnail?: string | null, updatedAt: any, views: number } | null>, ShortComics: Array<{ __typename?: 'ShortComic', _id: string, ChapIDs?: Array<string> | null, CreatedByID: string, background?: string | null, createdAt: any, description?: string | null, name: string, thumbnail?: string | null, updatedAt: any, views: number } | null> } | null } } };

export type RegisterMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', Register: { __typename?: 'UserLoginOrRegisterResponse', accessToken: string, user: { __typename?: 'User', _id: string, email: string, name: string, updatedAt: any, createdAt: any, password: string, profile?: { __typename?: 'Profile', _id: string, comics: Array<{ __typename?: 'Comic', _id: string, name: string, description?: string | null, background?: string | null, CreatedByID: string, createdAt: any, sessionId?: Array<string> | null, thumbnail?: string | null, updatedAt: any, views: number } | null>, ShortComics: Array<{ __typename?: 'ShortComic', _id: string, ChapIDs?: Array<string> | null, CreatedByID: string, background?: string | null, createdAt: any, description?: string | null, name: string, thumbnail?: string | null, updatedAt: any, views: number } | null> } | null } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', Me: { __typename?: 'User', _id: string, email: string, name: string, updatedAt: any, createdAt: any, password: string, profile?: { __typename?: 'Profile', _id: string, comics: Array<{ __typename?: 'Comic', _id: string, name: string, description?: string | null, background?: string | null, CreatedByID: string, createdAt: any, sessionId?: Array<string> | null, thumbnail?: string | null, updatedAt: any, views: number } | null>, ShortComics: Array<{ __typename?: 'ShortComic', _id: string, ChapIDs?: Array<string> | null, CreatedByID: string, background?: string | null, createdAt: any, description?: string | null, name: string, thumbnail?: string | null, updatedAt: any, views: number } | null> } | null } };

export type TopViewComicsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopViewComicsQuery = { __typename?: 'Query', TopViewComic: Array<{ __typename?: 'Comic', _id: string, name: string, description?: string | null, background?: string | null, CreatedByID: string, createdAt: any, sessionId?: Array<string> | null, thumbnail?: string | null, updatedAt: any, views: number } | null>, TopViewShortComics: Array<{ __typename?: 'ShortComic', _id: string, ChapIDs?: Array<string> | null, CreatedByID: string, background?: string | null, createdAt: any, description?: string | null, name: string, thumbnail?: string | null, updatedAt: any, views: number }> };

export const ComicInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]} as unknown as DocumentNode<ComicInfoFragment, unknown>;
export const ShortComicInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShortComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShortComic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"ChapIDs"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]} as unknown as DocumentNode<ShortComicInfoFragment, unknown>;
export const UserInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"comics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ComicInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ShortComics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShortComicInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShortComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShortComic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"ChapIDs"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]} as unknown as DocumentNode<UserInfoFragment, unknown>;
export const CreateComicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateComicInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UploadToken"}},{"kind":"Field","name":{"kind":"Name","value":"comic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ComicInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]} as unknown as DocumentNode<CreateComicMutation, CreateComicMutationVariables>;
export const CreateShortComicDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateShortComic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateShortComicInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createShortComic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ShortComic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShortComicInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"UploadToken"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShortComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShortComic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"ChapIDs"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]} as unknown as DocumentNode<CreateShortComicMutation, CreateShortComicMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShortComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShortComic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"ChapIDs"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"comics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ComicInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ShortComics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShortComicInfo"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShortComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShortComic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"ChapIDs"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"comics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ComicInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ShortComics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShortComicInfo"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShortComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShortComic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"ChapIDs"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"comics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ComicInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ShortComics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShortComicInfo"}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const TopViewComicsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopViewComics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"TopViewComic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ComicInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"TopViewShortComics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShortComicInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShortComicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShortComic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"ChapIDs"}},{"kind":"Field","name":{"kind":"Name","value":"CreatedByID"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]} as unknown as DocumentNode<TopViewComicsQuery, TopViewComicsQueryVariables>;