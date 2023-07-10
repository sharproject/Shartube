export const DB_NAME = process.env['DB_NAME'] || 'users'
export function getDbUrl() {
    const DB_USERNAME = process.env['DB_USERNAME'] || 'root'
    const DB_PASSWORD = process.env['DB_PASSWORD'] || 'root'
    const DB_HOST = process.env['DB_HOST'] || 'localhost'
    let dbUrl = ''
    if (process.env['DB_PORT']) {
        dbUrl += `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${process.env[
            'DB_PORT'
        ]}`
        dbUrl += '/?authSource=admin&readPreference=primary&ssl=false'
    } else {
        dbUrl += `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
    }
    console.log(dbUrl)
    return dbUrl
}