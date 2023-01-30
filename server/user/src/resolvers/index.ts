// deno-lint-ignore-file no-explicit-any
import { ObjectId } from 'https://deno.land/x/mongo/mod.ts'

import { join as PathJoin } from 'https://deno.land/std@0.149.0/path/mod.ts'
import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
import { PromiseOrType } from '../types/util.ts'
import { IMutation, mutation } from './mutation/index.ts'
import { IQuery, query } from './query/index.ts'
import { User, UserModel } from '../model/user.ts'

config({
	path: PathJoin(import.meta.url, './../../.env'),
})


export interface IResolvers {
	Query: IQuery
	Mutation: IMutation
	User: {
		__resolveReference: (
			reference: any
		) => PromiseOrType<User | undefined | null>
	}
}

export const resolvers: IResolvers = {
	Query: query,
	Mutation: mutation,

	User: {
		__resolveReference: async (reference) => {
			const UserId = reference._id
			const user = await UserModel.findById(UserId)
			return user
		},
	},
}
