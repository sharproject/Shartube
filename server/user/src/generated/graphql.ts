import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
  _FieldSet: { input: any; output: any; }
};

export type AddUserToTeamInput = {
  TeamID: Scalars['String']['input'];
  UserID: Scalars['String']['input'];
};

export type CreateTeamInput = {
  name: Scalars['String']['input'];
};

export type LoginUserInput = {
  UsernameOrEmail: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  AddUserToTeam: Team;
  CreateTeam: Team;
  Login: UserLoginOrRegisterResponse;
  Register: UserLoginOrRegisterResponse;
  RemoveUserInTeam: Team;
};


export type MutationAddUserToTeamArgs = {
  input: AddUserToTeamInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
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

export type Profile = {
  __typename?: 'Profile';
  CreateID: Scalars['ID']['output'];
  _id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  Me: User;
  PageFromId?: Maybe<UserOrTeam>;
};


export type QueryPageFromIdArgs = {
  id: Scalars['String']['input'];
};

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };
    

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  UserOrTeam: ( Team ) | ( User );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddUserToTeamInput: AddUserToTeamInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  CreateTeamInput: CreateTeamInput;
  LoginUserInput: LoginUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  Profile: ResolverTypeWrapper<Profile>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserInput: RegisterUserInput;
  Team: ResolverTypeWrapper<Team>;
  Time: ResolverTypeWrapper<Scalars['Time']['output']>;
  User: ResolverTypeWrapper<User>;
  UserLoginOrRegisterResponse: ResolverTypeWrapper<UserLoginOrRegisterResponse>;
  UserOrTeam: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UserOrTeam']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddUserToTeamInput: AddUserToTeamInput;
  String: Scalars['String']['output'];
  CreateTeamInput: CreateTeamInput;
  LoginUserInput: LoginUserInput;
  Mutation: {};
  Profile: Profile;
  ID: Scalars['ID']['output'];
  Query: {};
  RegisterUserInput: RegisterUserInput;
  Team: Team;
  Time: Scalars['Time']['output'];
  User: User;
  UserLoginOrRegisterResponse: UserLoginOrRegisterResponse;
  UserOrTeam: ResolversUnionTypes<ResolversParentTypes>['UserOrTeam'];
  Boolean: Scalars['Boolean']['output'];
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  AddUserToTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationAddUserToTeamArgs, 'input'>>;
  CreateTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationCreateTeamArgs, 'input'>>;
  Login?: Resolver<ResolversTypes['UserLoginOrRegisterResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  Register?: Resolver<ResolversTypes['UserLoginOrRegisterResponse'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  RemoveUserInTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationRemoveUserInTeamArgs, 'input'>>;
}>;

export type ProfileResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Profile']>, { __typename: 'Profile' } & GraphQLRecursivePick<ParentType, {"CreateID":true}>, ContextType>;
  CreateID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  Me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  PageFromId?: Resolver<Maybe<ResolversTypes['UserOrTeam']>, ParentType, ContextType, RequireFields<QueryPageFromIdArgs, 'id'>>;
}>;

export type TeamResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Team']>, { __typename: 'Team' } & GraphQLRecursivePick<ParentType, {"_id":true}>, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  member?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['User']>, { __typename: 'User' } & GraphQLRecursivePick<ParentType, {"_id":true}>, ContextType>;
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserLoginOrRegisterResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserLoginOrRegisterResponse'] = ResolversParentTypes['UserLoginOrRegisterResponse']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserOrTeamResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UserOrTeam'] = ResolversParentTypes['UserOrTeam']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Team' | 'User', ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  Time?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserLoginOrRegisterResponse?: UserLoginOrRegisterResponseResolvers<ContextType>;
  UserOrTeam?: UserOrTeamResolvers<ContextType>;
}>;

