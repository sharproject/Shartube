use mongodb::options::{ClientOptions, ServerApi, ServerApiVersion};
use std::env;

pub async fn get_db_url() -> ClientOptions {
    let db_name = env::var("DB_NAME").unwrap_or("likes".to_string());
    let db_username = env::var("DB_USERNAME").unwrap_or("root".to_string());
    let db_password = env::var("DB_PASSWORD").unwrap_or("root".to_string());
    let db_host = env::var("DB_HOST").unwrap_or("localhost".to_string());
    let db_port = env::var("DB_PORT");
    let client_options = match db_port {
        Ok(port) => ClientOptions::parse_async(format!(
            "mongodb://{}:{}@{}:{}/?authSource=admin&readPreference=primary&ssl=false",
            db_username, db_password, db_host, port
        ))
        .await
        .unwrap(),
        Err(_) => {
            let mut client_options = ClientOptions::parse_async(format!(
                "mongodb+srv://{}:{}@{}/{}?retryWrites=true&w=majority",
                db_username, db_password, db_host, db_name
            ))
            .await
            .unwrap();
            // Set the server_api field of the client_options object to Stable API version 1
            let server_api = ServerApi::builder().version(ServerApiVersion::V1).build();
            client_options.server_api = Some(server_api);
            client_options
        }
    };
    return client_options;
}
