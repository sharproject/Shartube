import mongoose from 'npm:mongoose'
export const timeByMinus = 180 * 60

const SessionSchema = new mongoose.Schema({
	userID: { type: mongoose.Types.ObjectId, required: true },
	createdAt: { type: Date, default: new Date(), expires: timeByMinus },
	updatedAt: { type: Date, default: new Date() },
})

export const SessionModel = mongoose.model<SessionType>(
	'session',
	SessionSchema
)

export interface SessionType extends mongoose.Document {
	createdAt: Date
	updatedAt: Date
	userID: mongoose.Types.ObjectId
}
