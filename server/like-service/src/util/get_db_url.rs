pub fn get_db_url() -> String {
    let db_name = option_env!("DB_NAME").unwrap_or("likes");
    let db_username = option_env!("DB_USERNAME").unwrap_or("root");
    let db_password = option_env!("DB_PASSWORD").unwrap_or("root");
    let db_host = option_env!("DB_HOST").unwrap_or("localhost");
    let db_port = option_env!("DB_PORT");
    let db_url = match db_port {
        Some(port) => format!(
            "mongodb://{}:{}@{}:{}/?authSource=admin&readPreference=primary&ssl=false",
            db_username, db_password, db_host, port
        ),
        None => format!(
            "mongodb+srv://{}:{}@{}/{}?retryWrites=true&w=majority",
            db_username, db_password, db_host, db_name
        ),
    };
    dbg!(&db_url);
    return db_url;
}
