use mongodb::options::{ClientOptions, ServerApi, ServerApiVersion};

pub async fn get_db_url() -> ClientOptions {
    let db_name = option_env!("DB_NAME").unwrap_or("likes");
    let db_username = option_env!("DB_USERNAME").unwrap_or("root");
    let db_password = option_env!("DB_PASSWORD").unwrap_or("root");
    let db_host = option_env!("DB_HOST").unwrap_or("localhost");
    let db_port = option_env!("DB_PORT");
    let client_options = match db_port {
        Some(port) => ClientOptions::parse(format!(
            "mongodb://{}:{}@{}:{}/?authSource=admin&readPreference=primary&ssl=false",
            db_username, db_password, db_host, port
        ))
        .unwrap(),
        None => {
            let mut client_options = ClientOptions::parse(format!(
                "mongodb+srv://{}:{}@{}/{}?retryWrites=true&w=majority",
                db_username, db_password, db_host, db_name
            ))
            .unwrap();
            // Set the server_api field of the client_options object to Stable API version 1
            let server_api = ServerApi::builder().version(ServerApiVersion::V1).build();
            client_options.server_api = Some(server_api);
            client_options
        }
    };
    return client_options;
}
