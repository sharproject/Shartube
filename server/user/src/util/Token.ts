import {
	create,
	getNumericDate,
	verify,
} from 'https://deno.land/x/djwt@v2.7/mod.ts'
import { join as PathJoin } from 'https://deno.land/std@0.149.0/path/mod.ts'
import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
import { SessionModel, timeByMinus } from '../model/session.ts'
config({
	path: PathJoin(import.meta.url, '..', '..', '.env'),
})

const key = await crypto.subtle.generateKey(
	{ name: 'HMAC', hash: 'SHA-512' },
	true,
	['sign', 'verify']
)

export async function GenToken(userID: string) {
	await SessionModel.deleteMany({
		userID: userID,
	})
	const session = await new SessionModel({
		userID: userID,
	}).save()
	const exp = getNumericDate(
		new Date(new Date().getSeconds() + timeByMinus * 60)
	)

	const jwt = await create(
		{ alg: 'HS512', typ: 'JWT' },
		{
			sessionID: session._id.toHexString(),
			exp,
		},
		key
	)
	return jwt
}

async function VerifyToken(token: string) {
	return await verify(token, key)
}

export async function DecodeToken(token: string) {
	const payload = await VerifyToken(token)
	const sessionID = payload.sessionID
	return await SessionModel.findById(sessionID)
}
