import { Resolvers } from "../generated/graphql";
import { UserModel, TeamModel, Team, User } from "../model"
import { DecodeToken, GenToken } from "../util"
import { BadRequest, UnauthorizedError, ServerError, NotFound } from "../error"
import { ProfileModel } from "../model/Profile";
import bcrypt from "bcrypt"

const saltRound = Number(process.env.SALT_ROUND || 10)

export const resolvers: Resolvers = {
    Query: {
        Me: async (_r, _a, context) => {
            const userToken = context.request.headers.get('authorization')
            if (!userToken) {
                throw new UnauthorizedError()
            }
            if (typeof userToken != "string") throw new UnauthorizedError()
            const UserSession = await DecodeToken(
                userToken.replace('Bearer ', '')
            )
            if (!UserSession) {
                throw new UnauthorizedError()
            }
            const user = await UserModel.findById(UserSession.userID)
            if (!user) {
                throw new UnauthorizedError()
            }
            if (user) {
                user.password = ''
            }

            console.log(user.toJSON())
            return {
                ...user.toObject(),
                profile: null
            }
        },
        PageFromId: async (_root, arg, _ctx) => {
            const user =
                (await UserModel.findById(arg.id))?.toObject<User>() ||
                (await TeamModel.findById(arg.id))?.toObject<Team>()
            if (!user) throw new NotFound()
            return {
                ...user.toObject(),
                profile: null
            }
        },
        FindProfileById: async (_root, arg, _ctx) => {
            const profile = await ProfileModel.findOne({
                CreateID: arg.UserOrTeamId
            })
            if (!profile) throw new NotFound()
            return profile.toObject()
        }
    },
    Mutation: {
        async Login(_, args) {
            const user =
                (await UserModel.findOne({
                    email: args.input.UsernameOrEmail,
                })) ||
                (await UserModel.findOne({
                    name: args.input.UsernameOrEmail,
                }))
            if (!user) {
                throw new BadRequest(
                    'email or password or user name is incorrect',
                )
            }
            const IsValidPassword = await bcrypt.compare(
                args.input.password,
                user.password
            )
            if (!IsValidPassword) {
                throw new BadRequest(
                    'email or password or user name is incorrect',
                )
            }
            user.password = ''
            return {
                accessToken: await GenToken(user._id),
                user: {
                    ...user.toObject(),
                    profile: null
                },
            }
        },
        async Register(_, args) {
            // const isEmailValid = await emailChecker(args.input.email)
            // console.log(args.input.email);
            // if (!isEmailValid) {
            // throw new GQLError({ type: 'email invalid' })
            // }
            const user =
                (await UserModel.findOne({
                    email: args.input.email,
                })) ||
                (await UserModel.findOne({
                    name: args.input.name,
                }))

            if (user) {
                throw new BadRequest(
                    'username is already taken',
                )
            }

            const User = new UserModel({
                ...args.input,
                ...{ password: await bcrypt.hash(args.input.password, saltRound) },
                createdAt: new Date(),
                updatedAt: new Date(),
                comicIDs: [],
            })
            const returnValue = await User.save()
            if (!returnValue) {
                throw new ServerError()
            }
            returnValue.password = ''
            const profile = await (new ProfileModel({
                CreateID: returnValue._id,
                createdAt: new Date(),
                updatedAt: new Date()
            }).save())
            return {
                accessToken: await GenToken(returnValue._id),
                user: {
                    ...returnValue.toObject(),
                    profile: profile.toObject()
                },
            }
        },
        async CreateTeam(_, args, context) {
            const userToken = context.request.headers.get('authorization')
            if (!userToken) {
                throw new UnauthorizedError()
            }
            if (typeof userToken != "string") throw new UnauthorizedError()
            const UserSession = await DecodeToken(
                userToken.replace('Bearer ', '')
            )
            if (!UserSession) {
                throw new UnauthorizedError()
            }
            const user = await UserModel.findOne({
                _id: UserSession.userID,
            })
            if (!user) {
                throw new UnauthorizedError()
            }
            const Team = new TeamModel({
                ...args.input,
                createdAt: new Date(),
                updatedAt: new Date(),
                comicIDs: [],
                member: [user?._id],
                owner: user?._id,
            })
            const returnValue = await Team.save()
            const profile = await (new ProfileModel({
                CreateID: returnValue._id,
                createdAt: new Date(),
                updatedAt: new Date()
            }).save())
            if (!returnValue) {
                throw new ServerError()
            }
            return {
                ...returnValue.toObject(),
                profile: profile.toObject()
            }
        },
        AddUserToTeam: async (_, args, context) => {
            const userToken = context.request.headers.get('authorization')
            if (!userToken) {
                throw new UnauthorizedError()
            }
            if (typeof userToken != "string") throw new UnauthorizedError()
            const UserSession = await DecodeToken(
                userToken.replace('Bearer ', '')
            )
            if (!UserSession) {
                throw new UnauthorizedError()
            }
            const user = await UserModel.findOne({
                _id: UserSession.userID,
            })
            if (!user) {
                throw new UnauthorizedError()
            }
            const TeamData = await TeamModel.findOne({
                _id: args.input.TeamID,
                owner: user?._id,
            })
            if (!TeamData) {
                throw new UnauthorizedError()
            }

            const returnValue = await TeamModel.findOneAndUpdate(
                {
                    _id: args.input.TeamID,
                },
                {
                    $push: {
                        member: { $each: [args.input.UserID] },
                    },
                }
            )
            if (!returnValue) {
                throw new ServerError()
            }

            return {
                ...returnValue.toObject()
                , profile: null
            }
        },
        RemoveUserInTeam: async (_, args, context) => {
            const userToken = context.request.headers.get('authorization')
            if (!userToken) {
                throw new UnauthorizedError()
            }
            if (typeof userToken != "string") throw new UnauthorizedError()
            const UserSession = await DecodeToken(
                userToken.replace('Bearer ', '')
            )
            if (!UserSession) {
                throw new UnauthorizedError()
            }
            const user = await UserModel.findOne({
                _id: UserSession.userID,
            })
            if (!user) {
                throw new UnauthorizedError()
            }
            const TeamData = await TeamModel.findOne({
                _id: args.input.TeamID,
                owner: user?._id,
            })
            if (!TeamData) {
                throw new UnauthorizedError()
            }

            const returnValue = await TeamModel.findOneAndUpdate(
                {
                    _id: args.input.TeamID,
                },
                {
                    $pull: {
                        member: args.input.UserID,
                    },
                }
            )
            if (!returnValue) {
                throw new ServerError()
            }
            return {
                ...returnValue.toObject(),
                profile: null
            }
        },
    },
    User: {
        __resolveReference: async (reference) => {
            const UserId = reference._id
            const user = await UserModel.findById(UserId)
            if (!user) throw new ServerError()
            return {
                ...user.toObject(),
                profile: null
            }
        },
        profile: async (input) => {
            return await ProfileModel.findOne({
                CreateID: input._id
            })
        }
    }, Profile: {
        __resolveReference: async (reference) => {
            const CreateID = reference.CreateID
            const profile = await ProfileModel.findOne({
                CreateID: CreateID
            })
            if (!profile) throw new ServerError()
            return profile.toObject()
        }
    }
}