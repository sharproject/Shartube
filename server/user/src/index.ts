import { join as PathJoin } from 'https://deno.land/std@0.149.0/path/mod.ts'
import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
import { Application, Router } from 'https://deno.land/x/oak/mod.ts'
import { applyGraphQL } from 'https://deno.land/x/oak_graphql/mod.ts'
import { resolvers } from './resolvers/index.ts'
import { typeDefs } from './typeDefs/index.ts'
import { WsListen } from './ws/index.ts'
import mongoose from 'npm:mongoose'
import { getDbUrl } from './util/GetDBUrl.ts'
import { UserModel } from './model/user.ts'
import { TeamModel } from './model/team.ts'

config({
	path: PathJoin(import.meta.url, '..', '.env'),
})

const app = new Application({
	proxy: true,
})
new WsListen(`ws://${Deno.env.get('WS_HOST')}:${Deno.env.get('WS_PORT')}`)

app.use(async (ctx, next) => {
	await next()
	const rt = ctx.response.headers.get('X-Response-Time')
	console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`)
})
app.use(async (ctx, next) => {
	const start = Date.now()
	await next()
	const ms = Date.now() - start
	ctx.response.headers.set('X-Response-Time', `${ms}ms`)
})
;(async () => {
	try {
		let url = getDbUrl()
		await mongoose.connect(url, {})
	} catch (error) {
		console.log({ error })
	}
})()

// endpoint for get user info by id
app.use(async (ctx, next) => {
	const pathname = ctx.request.url.pathname.trim()

	if (pathname.startsWith('public/user/info')) {
		const id = ctx.request.url.searchParams.get('id')
		if (!id) {
			ctx.response.status = 400
			ctx.response.body = 'id is required'
			return
		}
		console.log({ id })
		ctx.response.body =
			(await UserModel.findById(id)) || (await TeamModel.findById(id))
	}
	await next()
})

const GraphQLService = await applyGraphQL<Router>({
	Router,
	typeDefs: typeDefs,
	resolvers: resolvers,
	context: (ctx) => {
		// this line is for passing a user context for the auth
		return { request: ctx.request }
	},
})

app.use(GraphQLService.routes(), GraphQLService.allowedMethods())

console.log('Server start at http://localhost:8080')
await app.listen({ port: 8080 })
