import * as jose from 'jose'
import { SessionModel } from '../model'
import mongoose from 'mongoose'


const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
)

export async function GenToken(userID: string) {
    const session = await new SessionModel({
        userID: new mongoose.Types.ObjectId(userID),
    }).save()
    // await SessionModel.deleteMany({
    // 	userID: new mongoose.Types.ObjectId(userID),
    // 	_id: {
    // 		$ne: session._id,
    // 	},
    // })
    for (const DSession of await SessionModel.find({
        userID: new mongoose.Types.ObjectId(userID),
    })) {
        console.log(DSession._id.toHexString(), session._id.toHexString())
        if (DSession._id.toHexString() != session._id.toHexString()) {
            await DSession.deleteOne()
        }
    }

    const alg = 'HS256'

    const jwt = await new jose.SignJWT({ 'urn:example:claim': true, sessionID: session._id })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime('180h') // i think we should use the timeByMinus
        .sign(secret)
    return jwt
}

async function VerifyToken(token: string) {
    return await jose.jwtVerify(token, secret, {
        issuer: 'urn:example:issuer',
        audience: 'urn:example:audience',
    })
}

export async function DecodeToken(token: string) {
    const { payload, protectedHeader } = await VerifyToken(token)
    console.log({ protectedHeader })
    const sessionID = payload.sessionID
    return await SessionModel.findById(sessionID)
}