import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
import { join as PathJoin } from 'https://deno.land/std@0.149.0/path/mod.ts'
export const DB_NAME = Deno.env.get('DB_NAME') || 'users'
export function getDbUrl() {
	config({
		path: PathJoin(import.meta.url, './../../.env'),
	})
	const DB_USERNAME = Deno.env.get('DB_USERNAME') || 'root'
	const DB_PASSWORD = Deno.env.get('DB_PASSWORD') || 'root'
	const DB_HOST = Deno.env.get('DB_HOST') || 'localhost'
	let dbUrl = ''
	if (Deno.env.get('DB_PORT')) {
		dbUrl += `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${Deno.env.get(
			'DB_PORT'
		)}`
		dbUrl += '/?authSource=admin&readPreference=primary&ssl=false'
	} else {
		dbUrl += `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}`
		dbUrl += `/${DB_NAME}?retryWrites=true&w=majority`
    }
    return dbUrl
}
