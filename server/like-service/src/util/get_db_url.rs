use std::env;
pub fn get_db_url() -> String {
    let db_name = env::var("DB_NAME").unwrap_or("likes".to_string());
    let db_username = env::var("DB_USERNAME").unwrap_or("root".to_string());
    let db_password = env::var("DB_PASSWORD").unwrap_or("root".to_string());
    let db_host = env::var("DB_HOST").unwrap_or("localhost".to_string());
    let db_port = env::var("DB_PORT");
    let db_url = match db_port {
        Ok(port) => format!(
            "mongodb://{}:{}@{}:{}/?authSource=admin&readPreference=primary&ssl=false",
            db_username, db_password, db_host, port
        ),
        Err(_) => format!(
            "mongodb+srv://{}:{}@{}/{}?retryWrites=true&w=majority",
            db_username, db_password, db_host, db_name
        ),
    };
    dbg!(&db_url);
    return db_url;
}
