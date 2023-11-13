extern crate dotenv;
mod types;
mod upload_images;

use std::collections::BTreeMap;
use std::sync::{Arc, Mutex};
use tokio::sync::Mutex as TokioMutex;
use tungstenite::connect;
use url::Url;
mod util;
mod ws;

use dotenv::dotenv;
use salvo::prelude::TcpListener;
use salvo::Server;

use crate::types::TokenStorageTable;
use crate::ws::handle_socket_message;
mod route;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let token_storage: TokenStorageTable = Arc::new(Mutex::new(BTreeMap::new()));
    {
        let token_storage = token_storage.clone();
        tokio::spawn(async move {
            let (socket, _response) = {
                let (socket, _response) = connect(
                    Url::parse(
                        &format!(
                            "ws://{}:{}",
                            std::env::var("WS_HOST").unwrap(),
                            std::env::var("WS_PORT").unwrap()
                        )
                        .to_string(),
                    )
                    .unwrap(),
                )
                .expect("Can't connect");
                (Arc::new(TokioMutex::new(socket)), _response)
            };
            handle_socket_message(socket, token_storage).await;
        });
    }
    println!("Server started on port 3000 🚀");
    let acceptor = TcpListener::bind("0.0.0.0:3000");
    Server::new(acceptor)
        .serve(route::route(token_storage.clone()))
        .await;
}
