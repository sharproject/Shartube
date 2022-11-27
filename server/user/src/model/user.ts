import mongoose from 'npm:mongoose'
import { BaseUserSchema, IBaseUser } from './BaseUserSchema.ts'

const UserSchema = BaseUserSchema()

UserSchema.add({
	password: { type: String, required: true },
	email: { type: String, required: true },
})

export interface User extends IBaseUser {
	password: string
	email: string
}

export const UserModel = mongoose.model<User>('user', UserSchema)
