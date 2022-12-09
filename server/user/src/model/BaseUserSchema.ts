import mongoose from 'npm:mongoose'

export function BaseUserSchema() {
	const schema = new mongoose.Schema()

	schema.add({
		name: { type: String, required: true },
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

	return schema
}

export interface IBaseUser extends mongoose.Document {
	name: string
	createdAt: Date
	updatedAt: Date
	comicIDs: mongoose.Types.ObjectId[]
	ShortComicIDs: mongoose.Types.ObjectId[]
}
