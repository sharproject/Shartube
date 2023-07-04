import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema({
    CreateID: { type: mongoose.Types.ObjectId, required: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
    comicIDs: [
        {
            type: mongoose.Types.ObjectId,
            default: [],
        },
    ],
    ShortComicIDs: [
        {
            type: mongoose.Types.ObjectId,
            default: [],
        },
    ],
})

export const ProfileModel = mongoose.model<ProfileType>(
    'Profile',
    ProfileSchema
)

export interface ProfileType extends mongoose.Document {
    createdAt: Date
    updatedAt: Date
    CreateID: mongoose.Types.ObjectId
    comicIDs: mongoose.Types.ObjectId[]
    ShortComicIDs: mongoose.Types.ObjectId[]
}