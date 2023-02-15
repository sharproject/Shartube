import { gql } from 'https://deno.land/x/oak_graphql/mod.ts'

export const TypeDefsString = `
	type _Service {
		sdl: String
	}
	type Query {
		_service: _Service!
	}
	type Mutation {
		_empty: String
	}
	scalar Time
	scalar _FieldSet
	scalar _Any
	
	directive @key(fields: _FieldSet!, resolvable: Boolean = true) repeatable on OBJECT | INTERFACE
	input RegisterUserInput {
		name: String!
		email: String!
		password: String!
	}
	input LoginUserInput {
		UsernameOrEmail: String!
		password: String!
	}
	type User @key(fields: "_id") {
		_id: ID!
		name: String!
		email: String!
		password: String
		createdAt: Time!
		updatedAt: Time!
		isTeam: Boolean
  		member: [String]
		ShortComicIDs:[String]!
		comicIDs:[String]!
  		owner: String
	}
	type UserLoginOrRegisterResponse {
		user: User!
		accessToken: String!
	}
	union _Entity =  User
	input CreateTeamInput{
		name:String!
	} 
	input AddUserToTeamInput{
		TeamID:String!
		UserID:String!
	}
	extend type Mutation {
		Login(input: LoginUserInput!): UserLoginOrRegisterResponse!
		Register(input: RegisterUserInput!): UserLoginOrRegisterResponse!
		CreateTeam(input:CreateTeamInput!): User!
		AddUserToTeam(input:AddUserToTeamInput!):User!
		RemoveUserInTeam(input:AddUserToTeamInput!):User
	}
	extend type Query {
		_entities(representations: [_Any!]!): [_Entity]!
		Me: User!
		PageFromId(id:String!):User
	}
`
export const typeDefs = gql`
	${TypeDefsString}
`
