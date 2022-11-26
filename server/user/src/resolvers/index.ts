// deno-lint-ignore-file no-explicit-any
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.0/mod.ts'
import { ObjectId } from 'https://deno.land/x/mongo/mod.ts'
import { GQLError } from 'https://deno.land/x/oak_graphql@0.6.4/mod.ts'
import { emailChecker } from '../function/emailChecker.ts'
import { DecodeToken, GenToken } from '../util/Token.ts'

import { join as PathJoin } from 'https://deno.land/std@0.149.0/path/mod.ts'
import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
import { TypeDefsString } from '../typeDefs/index.ts'
import client from '../util/client.ts'

config({
	path: PathJoin(import.meta.url, './../../.env'),
})
const DB_NAME = Deno.env.get('DB_NAME') || 'users'

const ws = new WebSocket(
	`ws://${Deno.env.get('WS_HOST')}:${Deno.env.get('WS_PORT')}`
)

ws.onopen = () => console.log('connect to ws success')
ws.onmessage = async (message: MessageEvent<any>) => {
	const data = JSON.parse(message.data)
	const send = (result: any) => ws.send(JSON.stringify(result))
	let result
	if (data.url == 'user/decodeToken') {
		try {
			const decodeData = await DecodeToken(data.payload.token, client, DB_NAME)
			const sessionData = decodeData && {
				creatorID: decodeData.userID,
				...decodeData,
			}
			const TeamID = data.payload.teamID as string
			if (TeamID.trim().length > 0) {
				const db = client.database(DB_NAME)
				const users = db.collection<UserReturn>('users')
				const user = await users.findOne({
					_id: new ObjectId(TeamID),
				})
				if (!user?.isTeam) {
					throw new Error('team-id is not correct')
				} else {
					const members = user.member.map((v) => v.toHexString())
					// if not will create at main account
					if (members.includes(decodeData?.userID.toHexString() || '')) {
						if (sessionData?.creatorID) {
							sessionData.creatorID = new ObjectId(user._id)
						}
					}
				}
			}
			result = {
				url: data.from,
				header: null,
				payload: {
					sessionData,
					id: data.payload.id,
				},
				type: 'rep',
				error: null,
			}
		} catch (error) {
			result = {
				url: data.from,
				header: null,
				payload: {
					sessionData: null,
					id: data.payload.id,
				},
				type: 'rep',
				error: error.message,
			}
		}
	}
	if (data.url == 'user/updateUserComic') {
		try {
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')
			await users.updateOne(
				{
					_id: new ObjectId(data.payload.UserID),
				},
				{
					$push: {
						comicIDs: { $each: [new ObjectId(data.payload._id)] },
					},
				}
			)
			result = {
				url: data.from,
				header: null,
				payload: {
					user: await users.findOne({
						_id: new ObjectId(data.payload.UserID),
					}),
					id: data.payload.id,
				},
				type: 'rep',
				error: null,
			}
		} catch (error) {
			result = {
				url: data.from,
				header: null,
				payload: {
					user: null,
					id: data.payload.id,
				},
				type: 'rep',
				error: error.message,
			}
		}
	}
	if (data.url == 'user/DeleteComic') {
		try {
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')
			await users.updateOne(
				{
					_id: new ObjectId(data.payload.UserID),
				},
				{
					$pull: {
						comicIDs: new ObjectId(data.payload._id),
					},
				}
			)
			result = {
				url: data.from,
				header: null,
				payload: {
					user: await users.findOne({
						_id: new ObjectId(data.payload.UserID),
					}),
					id: data.payload.id,
				},
				type: 'rep',
				error: null,
			}
		} catch (error) {
			result = {
				url: data.from,
				header: null,
				payload: {
					user: null,
					id: data.payload.id,
				},
				type: 'rep',
				error: error.message,
			}
		}
	}
	if (result) {
		send(result)
	}
}

export interface BaseUser {
	_id: ObjectId
	name: string
	createdAt: Date
	updatedAt: Date
	comicIDs: ObjectId[]
	member?: ObjectId[]
}

interface Team extends BaseUser {
	isTeam: true
	member: ObjectId[]
	owner: ObjectId
}

interface User extends BaseUser {
	password: string
	email: string
	isTeam: false
}

export type UserReturn = Team | User

interface UserLoginOrRegisterResponse {
	user: UserReturn
	accessToken: string
}
interface IResolvers {
	Query: {
		_service: (
			root: any
		) => {
			sdl: string
		}
		_entities: (root: any, args: any) => Promise<any[]>
		Me(
			root: any,
			args: any,
			context: any,
			info: any
		): Promise<UserReturn | typeof GQLError>
	}
	Mutation: {
		Login: (
			a: any,
			input: {
				input: {
					UsernameOrEmail: string
					password: string
				}
			}
		) => PromiseOrType<UserLoginOrRegisterResponse>
		Register: (
			parter: any,
			input: {
				input: {
					email: string
					password: string
					name: string
				}
			}
		) => PromiseOrType<UserLoginOrRegisterResponse>
		CreateTeam: (
			parter: any,
			input: {
				input: {
					name: string
				}
			},
			context: any
		) => PromiseOrType<UserReturn>
		AddUserToTeam: (
			parter: any,
			input: {
				input: {
					TeamID: string
					UserID: string
				}
			},
			context: any
		) => PromiseOrType<UserReturn>
		RemoveUserInTeam: (
			parter: any,
			input: {
				input: {
					TeamID: string
					UserID: string
				}
			},
			context: any
		) => PromiseOrType<UserReturn>
	}
	User: {
		__resolveReference: (
			reference: any
		) => PromiseOrType<UserReturn | undefined>
	}
}

type PromiseOrType<type> = Promise<type> | type
export const resolvers: IResolvers = {
	Query: {
		_service: () => {
			const stringResult = TypeDefsString
			return { sdl: stringResult }
		},
		_entities: async (root: any, args: any) => {
			const returnValue = []
			for (const data of args.representations) {
				const TypeObj = root[data.__typename as string]
				const result = await TypeObj.__resolveReference(data)
				returnValue.push({
					...data,
					...result,
				})
			}
			return returnValue
		},
		Me: async (root: any, args: any, context: any, ...rest: any[]) => {
			if (!context.request.headers.get('authorization')) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const UserSession = await DecodeToken(
				context.request.headers.get('authorization').replace('Bearer ', ''),
				client,
				DB_NAME
			)
			if (!UserSession) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')
			return {
				...(await users.findOne({
					_id: new ObjectId(UserSession.userID),
				})),
				password: '',
			}
		},
	},
	Mutation: {
		async Login(_, args) {
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')
			const user =
				(await users.findOne({
					email: args.input.UsernameOrEmail,
				})) ||
				(await users.findOne({
					name: args.input.UsernameOrEmail,
				}))
			if (!user) {
				throw new GQLError({
					type: 'email or password or user name is incorrect',
				})
			}
			if (user.isTeam) {
				throw new GQLError({
					type: 'that is the team account',
				})
			}
			const IsValidPassword = await bcrypt.compare(
				args.input.password,
				user.password
			)
			if (!IsValidPassword) {
				throw new GQLError({
					type: 'email or password or user name is incorrect',
				})
			}
			user.password = ''
			return {
				accessToken: await GenToken(client, user._id, DB_NAME),
				user: user,
			}
		},
		async Register(_, args) {
			// const isEmailValid = await emailChecker(args.input.email)
			// console.log(args.input.email);
			// if (!isEmailValid) {
			// throw new GQLError({ type: 'email invalid' })
			// }
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')

			const user =
				(await users.findOne({
					email: args.input.email,
				})) ||
				(await users.findOne({
					name: args.input.name,
				}))

			if (user) {
				throw new GQLError({
					type: 'username is already taken',
				})
			}

			const insertId = await users.insertOne({
				...args.input,
				isTeam: false,
				...{ password: await bcrypt.hash(args.input.password) },
				createdAt: new Date(),
				updatedAt: new Date(),
				comicIDs: [],
			})
			const returnValue = await users.findOne({
				_id: insertId,
			})
			if (!returnValue) {
				throw new GQLError({ type: 'Server Error' })
			}
			if (!returnValue.isTeam) {
				returnValue.password = ''
			}
			return {
				accessToken: await GenToken(client, returnValue._id, DB_NAME),
				user: returnValue,
			}
		},
		async CreateTeam(_, args, context) {
			if (!context.request.headers.get('authorization')) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const UserSession = await DecodeToken(
				context.request.headers.get('authorization').replace('Bearer ', ''),
				client,
				DB_NAME
			)
			if (!UserSession) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')
			const user = await users.findOne({
				_id: new ObjectId(UserSession.userID),
			})
			if (user?.isTeam) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const CreateValue = {
				...args.input,
				isTeam: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				comicIDs: [],
				member: [new ObjectId(user?._id)],
				owner: new ObjectId(user?._id),
			} as Omit<Team, '_id'>
			const insertId = await users.insertOne({
				...CreateValue,
			})
			const returnValue = await users.findOne({
				_id: insertId,
			})
			if (!returnValue) {
				throw new GQLError({ type: 'Server Error' })
			}
			if (!returnValue.isTeam) {
				returnValue.password = ''
			}
			return returnValue
		},
		AddUserToTeam: async (_, args, context) => {
			if (!context.request.headers.get('authorization')) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const UserSession = await DecodeToken(
				context.request.headers.get('authorization').replace('Bearer ', ''),
				client,
				DB_NAME
			)
			if (!UserSession) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')
			const user = await users.findOne({
				_id: new ObjectId(UserSession.userID),
			})
			if (user?.isTeam) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const TeamData = await users.findOne({
				_id: new ObjectId(args.input.TeamID),
			})
			if (TeamData?.isTeam && TeamData.owner != user?._id) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}

			await users.updateOne(
				{
					_id: new ObjectId(args.input.TeamID),
				},
				{
					$push: {
						member: { $each: [new ObjectId(args.input.UserID)] },
					},
				}
			)
			const returnValue = await users.findOne({
				_id: new ObjectId(args.input.TeamID),
			})
			if (!returnValue) {
				throw new GQLError({ type: 'Server Error' })
			}
			if (!returnValue.isTeam) {
				returnValue.password = ''
			}
			return returnValue
		},
		RemoveUserInTeam: async (_, args, context) => {
			if (!context.request.headers.get('authorization')) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const UserSession = await DecodeToken(
				context.request.headers.get('authorization').replace('Bearer ', ''),
				client,
				DB_NAME
			)
			if (!UserSession) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')
			const user = await users.findOne({
				_id: new ObjectId(UserSession.userID),
			})
			if (user?.isTeam) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}
			const TeamData = await users.findOne({
				_id: new ObjectId(args.input.TeamID),
			})
			if (TeamData?.isTeam && TeamData.owner != user?._id) {
				throw new GQLError({
					type: 'Unauthorized',
					message: 'You are not authorized to access this resource',
				})
			}

			await users.updateOne(
				{
					_id: new ObjectId(args.input.TeamID),
				},
				{
					$pull: {
						member: new ObjectId(args.input.UserID),
					},
				}
			)
			const returnValue = await users.findOne({
				_id: new ObjectId(args.input.TeamID),
			})
			if (!returnValue) {
				throw new GQLError({ type: 'Server Error' })
			}
			if (!returnValue.isTeam) {
				returnValue.password = ''
			}
			return returnValue
		},
	},

	User: {
		__resolveReference: async (reference) => {
			const db = client.database(DB_NAME)
			const users = db.collection<UserReturn>('users')
			const user = await users.findOne({
				_id: new ObjectId(reference._id),
			})
			return user
		},
	},
}
