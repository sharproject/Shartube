import mongoose from 'mongoose'
import { BaseUserSchema, IBaseUser } from './BaseUserSchema'

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