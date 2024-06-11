import mongoose from 'mongoose'
import { ProfileType } from './Profile'

export function BaseUserSchema() {
    const schema = new mongoose.Schema()

    schema.add({
        name: { type: String, required: true },
        createdAt: { type: Date, default: new Date() },
        updatedAt: { type: Date, default: new Date() },
    })

    return schema
}

export interface IBaseUser extends mongoose.Document {
    name: string
    createdAt: Date
    updatedAt: Date
    profile?: ProfileType
}