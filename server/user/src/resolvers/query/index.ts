import { ObjectId } from 'https://deno.land/x/mongo/mod.ts'
import { GQLError } from 'https://deno.land/x/oak_graphql/mod.ts'
import { IResolvers } from 'https://deno.land/x/oak_graphql@0.6.4/graphql-tools/utils/Interfaces.ts'
import { User, UserModel } from '../../model/user.ts'
import { TypeDefsString } from '../../typeDefs/index.ts'
import { PromiseOrType } from '../../types/util.ts'
import { DecodeToken } from '../../util/Token.ts'

export interface IQuery {
	_service: (
		root: unknown
	) => {
		sdl: string
	}
	_entities: (
		root: {
			[key: string]: unknown
		},
		args: {
			representations: {
				__typename: string
				[key: string]: unknown
			}[]
		}
	) => Promise<unknown[]>
	Me(
		root: IResolvers,
		args: Record<string | number | symbol, never>,
		context: any,
		info: unknown
	): Promise<User | typeof GQLError>
}

export const query: IQuery = {
	_service: () => {
		const stringResult = TypeDefsString
		return { sdl: stringResult }
	},
	_entities: async (root, args) => {
		const returnValue = []
		for (const data of args.representations) {
			const TypeObj = root[data.__typename as string] as {
				__resolveReference: (
					reference: unknown
				) => PromiseOrType<unknown | undefined>
			}
			const result = await TypeObj.__resolveReference(data)
			if (typeof result != 'object') {
				continue
			}
			returnValue.push({
				...data,
				...result,
			})
		}
		return returnValue
	},
	Me: async (_r, _a, context) => {
		if (!context.request.headers.get('authorization')) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}
		const UserSession = await DecodeToken(
			context.request.headers.get('authorization').replace('Bearer ', ''),
		)
		if (!UserSession) {
			throw new GQLError({
				type: 'Unauthorized',
				message: 'You are not authorized to access this resource',
			})
		}
		return {
			...(await UserModel.findOne({
				_id: UserSession.userID,
			})),
			password: '',
		}
	},
}
