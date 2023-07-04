export const DB_NAME = Bun.env['DB_NAME'] || 'users'
export function getDbUrl() {
    const DB_USERNAME = Bun.env['DB_USERNAME'] || 'root'
    const DB_PASSWORD = Bun.env['DB_PASSWORD'] || 'root'
    const DB_HOST = Bun.env['DB_HOST'] || 'localhost'
    let dbUrl = ''
    if (Bun.env['DB_PORT']) {
        dbUrl += `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${Bun.env[
            'DB_PORT'
        ]}`
        dbUrl += '/?authSource=admin&readPreference=primary&ssl=false'
    } else {
        dbUrl += `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
    }
    console.log(dbUrl)
    return dbUrl
}