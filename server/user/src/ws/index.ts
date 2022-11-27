import { ObjectId } from 'https://deno.land/x/mongo/mod.ts'
import { TeamModel } from '../model/team.ts'
import { UserModel } from '../model/user.ts'
import { DecodeToken } from '../util/Token.ts'

interface SenderData {
	url: string
	header: unknown
	payload: {
		id: string
		[key: string]: any
	}
	from: string
	error?: string | null
	type: 'rep' | 'message'
}

export class WsListen extends WebSocket {
	constructor(url: string | URL, protocols?: string | string[]) {
		super(url, protocols)
		this.handlers()
	}
	handlers() {
		this.onopen = () => console.log('connect to ws success')
		this.onmessage = async (message: MessageEvent<string>) => {
			const data: SenderData = JSON.parse(message.data)
			const send = (result: SenderData) => this.send(JSON.stringify(result))
			let result: SenderData | null = null
			if (data.url == 'user/decodeToken') {
				result = await this.decodeToken(data)
			}
			if (data.url == 'user/updateUserComic') {
				result = await this.updateUserComic(data)
			}
			if (data.url == 'user/DeleteComic') {
				result = await this.DeleteComic(data)
			}
			if (result) {
				send(result)
			}
		}
	}

	async decodeToken(data: SenderData): Promise<SenderData> {
		try {
			const decodeData = await DecodeToken(data.payload.token)
			if (!decodeData) {
				throw new Error('userId is not correct')
			}
			const sessionData = decodeData && {
				creatorID: decodeData.userID,
				...decodeData,
			}
			const TeamID = data.payload.teamID as string
			if (TeamID.trim().length > 0) {
				const Team = await TeamModel.findOne({
					_id: TeamID,
				})
				if (!Team) {
					throw new Error('team-id is not correct')
				} else {
					const members = Team.member.map((v) => v.toHexString())
					// if not will create at main account
					if (members.includes(decodeData?.userID.toHexString() || '')) {
						if (sessionData?.creatorID) {
							sessionData.creatorID = Team._id
						}
					}
				}
			}
			return {
				url: data.from,
				header: null,
				payload: {
					sessionData,
					id: data.payload.id,
				},
				type: 'rep',
				error: null,
				from: 'user/decodeToken',
			}
		} catch (error) {
			return {
				url: data.from,
				header: null,
				payload: {
					sessionData: null,
					id: data.payload.id,
				},
				type: 'rep',
				error: error.message,
				from: 'user/decodeToken',
			}
		}
	}
	async updateUserComic(data: SenderData): Promise<SenderData> {
		try {
			let returnData =
				(await UserModel.findOneAndUpdate(
					{
						_id: data.payload.UserID,
					},
					{
						$push: {
							comicIDs: { $each: [data.payload._id] },
						},
					}
				)) ||
				(await TeamModel.findOneAndUpdate(
					{
						_id: data.payload.UserID,
					},
					{
						$push: {
							comicIDs: { $each: [data.payload._id] },
						},
					}
				))
			return {
				url: data.from,
				header: null,
				payload: {
					user: returnData,
					id: data.payload.id,
				},
				type: 'rep',
				error: null,
				from: 'user/updateUserComic',
			}
		} catch (error) {
			return {
				url: data.from,
				header: null,
				payload: {
					user: null,
					id: data.payload.id,
				},
				type: 'rep',
				error: error.message,
				from: 'user/updateUserComic',
			}
		}
	}
	async DeleteComic(data: SenderData): Promise<SenderData> {
		try {
			let returnData =
				(await UserModel.findOneAndUpdate(
					{
						_id: data.payload.UserID,
					},
					{
						$pull: {
							comicIDs: data.payload._id,
						},
					}
				)) ||
				(await TeamModel.findOneAndUpdate(
					{
						_id: data.payload.UserID,
					},
					{
						$pull: {
							comicIDs: data.payload._id,
						},
					}
				))
			return {
				url: data.from,
				header: null,
				payload: {
					user: returnData,
					id: data.payload.id,
				},
				type: 'rep',
				error: null,
				from: 'user/updateUserComic',
			}
		} catch (error) {
			return {
				url: data.from,
				header: null,
				payload: {
					user: null,
					id: data.payload.id,
				},
				type: 'rep',
				error: error.message,
				from: 'user/updateUserComic',
			}
		}
	}
}
