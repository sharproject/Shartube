import * as jose from 'jose'
import { SessionModel } from '../model'
import mongoose from 'mongoose'
import path from "path"
import { KeyObject } from "node:crypto"
import { readFileSync, existsSync, writeFileSync } from "fs";
import crypto from "crypto"


const secret = (async () => {
    const privateKeyDir = path.join(__dirname, "../secret/key.private")
    if (existsSync(privateKeyDir)) {
        const secretString = readFileSync(path.join(__dirname, "../secret/key.private"), "utf-8")
        const key = crypto.subtle.importKey("jwk", JSON.parse(secretString), {
            name: "HMAC",
            hash: 'SHA-512',
            length: 512
        }, true, ["sign", "verify"])
        return KeyObject.from(await key)
    }
    const key = await crypto.subtle.generateKey({
        name: 'HMAC',
        hash: 'SHA-512',
        length: 512,
    }, true, ['sign', 'verify']);
    writeFileSync(privateKeyDir, JSON.stringify((await crypto.subtle.exportKey("jwk", key))),)
    return KeyObject.from(key)
})()

export async function GenToken(userID: string) {
    await SessionModel.deleteMany({
    	userID: new mongoose.Types.ObjectId(userID),
    })
    
    const session = await new SessionModel({
        userID: new mongoose.Types.ObjectId(userID),
    }).save()

    const alg = 'HS512'

    const jwt = await new jose.SignJWT({ 'urn:example:claim': true, sessionID: session._id })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime('180h') // i think we should use the timeByMinus
        .sign(await secret)
    return jwt
}

async function VerifyToken(token: string) {
    return await jose.jwtVerify(token, await secret, {
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