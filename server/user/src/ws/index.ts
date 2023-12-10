import { ProfileModel } from "../model/Profile";
import { TeamModel } from '../model/team'
import { DecodeToken } from '../util/Token'
import { RedisClientType, RedisFunctions, RedisDefaultModules, RedisModules, RedisScripts } from "redis"

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
    id: string
}


export class RedisListen<RedisModule extends RedisModules, RedisFunction extends RedisFunctions, RedisScript extends RedisScripts> {

    onmessage: (this: typeof this.redisClient, message: string, channel: string, subscriber: typeof this.redisClient) => any
    eventHandle: string[];
    subscriber: typeof this.redisClient;
    constructor(public redisClient: RedisClientType<RedisDefaultModules & RedisModule, RedisFunction, RedisScript>) {
        this.eventHandle = ["user/decodeToken", "user/updateUserComic", "user/DeleteComic", "user/UpdateUserShortComic", "user/UpdateUserStatus", "user/UpdateUserTeam"]
        this.subscriber = this.redisClient.duplicate();
        this.subscriber.on('error', err => console.error(err));

        this.connect()
        this.handlers()
    }
    async connect() {
        await this.subscriber.connect();
    }
    async handlers() {

        this.subscriber.subscribe(this.eventHandle, this.handlers.bind(this))

        this.onmessage = async (message, channel, subscriber) => {
            const data: SenderData = JSON.parse(message.toString())
            const send = (result: SenderData) =>
                subscriber.publish(channel, JSON.stringify(result))

            let result: SenderData | null = null
            if (data.url == 'user/decodeToken') {
                result = await this.decodeToken(data)
            } else if (data.url == 'user/updateUserComic') {
                result = await this.updateUserComic(data)
            } else if (data.url == 'user/DeleteComic') {
                result = await this.DeleteComic(data)
            } else if (data.url == "user/UpdateUserShortComic") {
                result = await this.updateUserShortComic(data)
            } else if (data.url == "user/DeleteShortComic") {
                result = await this.DeleteShortComic(data)
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
                throw new Error('token is not correct')
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
                    const members = Team.member.map((v) => v)
                    // if not will create at main account
                    if (members.includes(decodeData?.userID || '')) {
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
                    id: data.id,
                },
                type: 'rep',
                error: null,
                from: 'user/decodeToken',
                id: data.id
            }
        } catch (error: any) {
            return {
                url: data.from,
                header: null,
                payload: {
                    sessionData: null,
                    id: data.id,
                },
                type: 'rep',
                error: error.message,
                from: 'user/decodeToken',
                id: data.id
            }
        }
    }
    async updateUserComic(data: SenderData): Promise<SenderData> {
        try {
            const returnData =
                (await ProfileModel.findOneAndUpdate(
                    {
                        CreateID: data.payload.UserID,
                    },
                    {
                        $push: {
                            comicIDs: { $each: [data.payload._id] },
                        },
                    },
                    {
                        new: true
                    }
                ))
            return {
                url: data.from,
                header: null,
                payload: {
                    user: returnData,
                    id: data.id,
                },
                type: 'rep',
                error: null,
                from: 'user/updateUserComic',
                id: data.id
            }
        } catch (error: any) {
            return {
                url: data.from,
                header: null,
                payload: {
                    user: null,
                    id: data.id,
                },
                type: 'rep',
                error: error.message,
                from: 'user/updateUserComic',
                id: data.id
            }
        }
    }
    async updateUserShortComic(data: SenderData): Promise<SenderData> {
        try {
            const returnData =
                (await ProfileModel.findOneAndUpdate(
                    {
                        CreateID: data.payload.UserID,
                    },
                    {
                        $push: {
                            ShortComicIDs: { $each: [data.payload._id] },
                        },
                    },
                    {
                        new: true
                    }
                ))
            return {
                url: data.from,
                header: null,
                payload: {
                    user: returnData,
                    id: data.id,
                },
                type: 'rep',
                error: null,
                from: 'user/UpdateUserShortComic',
                id: data.id
            }
        } catch (error: any) {
            return {
                url: data.from,
                header: null,
                payload: {
                    user: null,
                    id: data.id,
                },
                type: 'rep',
                error: error.message,
                from: 'user/UpdateUserShortComic',
                id: data.id
            }
        }
    }
    async DeleteComic(data: SenderData): Promise<SenderData> {
        try {
            const returnData =
                (await ProfileModel.findOneAndUpdate(
                    {
                        CreateID: data.payload.UserID,
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
                    id: data.id,
                },
                type: 'rep',
                error: null,
                from: 'user/DeleteUserComic',
                id: data.id
            }
        } catch (error: any) {
            return {
                url: data.from,
                header: null,
                payload: {
                    user: null,
                    id: data.id,
                },
                type: 'rep',
                error: error.message,
                from: 'user/DeleteUserComic',
                id: data.id
            }
        }
    }


    async DeleteShortComic(data: SenderData): Promise<SenderData> {
        try {
            const returnData =
                (await ProfileModel.findOneAndUpdate(
                    {
                        CreateID: data.payload.UserID,
                    },
                    {
                        $pull: {
                            ShortComicIDs: data.payload._id,
                        },
                    }
                ))
            return {
                url: data.from,
                header: null,
                payload: {
                    user: returnData,
                    id: data.id,
                },
                type: 'rep',
                error: null,
                from: 'user/DeleteUserShortComic',
                id: data.id
            }
        } catch (error: any) {
            return {
                url: data.from,
                header: null,
                payload: {
                    user: null,
                    id: data.id,
                },
                type: 'rep',
                error: error.message,
                from: 'user/DeleteUserShortComic',
                id: data.id
            }
        }
    }
}
