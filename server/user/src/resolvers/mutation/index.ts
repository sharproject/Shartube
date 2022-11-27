import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.0/mod.ts'
import { GQLError } from 'https://deno.land/x/oak_graphql/mod.ts'
import { Team, TeamModel } from '../../model/team.ts'
import { User, UserModel } from '../../model/user.ts'
import { PromiseOrType } from '../../types/util.ts'
import { DecodeToken, GenToken } from '../../util/Token.ts'

interface UserLoginOrRegisterResponse {
	user: User
	accessToken: string
}

export interface IMutation {
	Login: (
		parter: any,
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
	) => PromiseOrType<Team>
	AddUserToTeam: (
		parter: any,
		input: {
			input: {
				TeamID: string
				UserID: string
			}
		},
		context: any
	) => PromiseOrType<Team>
	RemoveUserInTeam: (
		parter: any,
		input: {
			input: {
				TeamID: string
				UserID: string
			}
		},
		context: any
	) => PromiseOrType<Team>
}
export const mutation: IMutation = {
	async Login(_, args) {
		const user =
			(await UserModel.findOne({
				email: args.input.UsernameOrEmail,
			})) ||
			(await UserModel.findOne({
				name: args.input.UsernameOrEmail,
			}))
		if (!user) {
			throw new GQLError({
				type: 'email or password or user name is incorrect',
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
			accessToken: await GenToken(user._id),
			user: user,
		}
	},
	async Register(_, args) {
		// const isEmailValid = await emailChecker(args.input.email)
		// console.log(args.input.email);
		// if (!isEmailValid) {
		// throw new GQLError({ type: 'email invalid' })
		// }
		const user =
			(await UserModel.findOne({
				email: args.input.email,
			})) ||
			(await UserModel.findOne({
				name: args.input.name,
			}))

		if (user) {
			throw new GQLError({
				type: 'username is already taken',
			})
		}

		const User = new UserModel({
			...args.input,
			...{ password: await bcrypt.hash(args.input.password) },
			createdAt: new Date(),
			updatedAt: new Date(),
			comicIDs: [],
		})
		const returnValue = await User.save()
		if (!returnValue) {
			throw new GQLError({ type: 'Server Error' })
		}
		returnValue.password = ''
		return {
			accessToken: await GenToken(returnValue._id),
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
			context.request.headers.get('authorization').replace('Bearer ', '')
		)
		if (!UserSession) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}
		const user = await UserModel.findOne({
			_id: UserSession.userID,
		})
		if (!user) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}
		const Team = new TeamModel({
			...args.input,
			createdAt: new Date(),
			updatedAt: new Date(),
			comicIDs: [],
			member: [user?._id],
			owner: user?._id,
		})
		const returnValue = await Team.save()
		if (!returnValue) {
			throw new GQLError({ type: 'Server Error' })
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
			context.request.headers.get('authorization').replace('Bearer ', '')
		)
		if (!UserSession) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}
		const user = await UserModel.findOne({
			_id: UserSession.userID,
		})
		if (!user) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}
		const TeamData = await TeamModel.findOne({
			_id: args.input.TeamID,
			owner: user?._id,
		})
		if (!TeamData) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}

		const returnValue = await TeamModel.findOneAndUpdate(
			{
				_id: args.input.TeamID,
			},
			{
				$push: {
					member: { $each: [args.input.UserID] },
				},
			}
		)
		if (!returnValue) {
			throw new GQLError({ type: 'Server Error' })
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
			context.request.headers.get('authorization').replace('Bearer ', '')
		)
		if (!UserSession) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}
		const user = await UserModel.findOne({
			_id: UserSession.userID,
		})
		if (!user) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}
		const TeamData = await TeamModel.findOne({
			_id: args.input.TeamID,
			owner: user?._id,
		})
		if (!TeamData) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}

		const returnValue = await TeamModel.findOneAndUpdate(
			{
				_id: args.input.TeamID,
			},
			{
				$pull: {
					member: args.input.UserID,
				},
			}
		)
		if (!returnValue) {
			throw new GQLError({ type: 'Server Error' })
		}
		return returnValue
	},
}
