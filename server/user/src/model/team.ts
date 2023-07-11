import mongoose from 'mongoose'
import { BaseUserSchema, IBaseUser } from './BaseUserSchema'

const TeamSchema = BaseUserSchema()

TeamSchema.add({
    member: [
        {
            type: mongoose.Schema.Types.ObjectId,
            default: [],
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
})

export interface Team extends IBaseUser {
    member: mongoose.Types.ObjectId[]
    owner: mongoose.Types.ObjectId
}

export const TeamModel = mongoose.model<Team>('Team', TeamSchema)