extern crate dotenv;
mod types;
mod upload_images;

use std::sync::{Arc, Mutex};
use tokio::sync::Mutex as TokioMutex;
use tungstenite::connect;
use url::Url;
mod util;
mod ws;

use dotenv::dotenv;
use salvo::prelude::TcpListener;
use salvo::Server;

use crate::ws::handle_socket_message;
mod route;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let redis_client = Arc::new(Mutex::new(
        redis::Client::open(format!(
            "redis://{}:{}",
            std::env::var("REDIS_HOST").unwrap(),
            std::env::var("REDIS_PORT").unwrap()
        ))
        .unwrap()
        .get_async_connection()
        .await
        .unwrap(),
    ));
    {
        let redis_client = redis_client.clone();
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
            handle_socket_message(socket, redis_client).await;
        });
    }

    println!("Server started on port 3000 🚀");
    let acceptor = TcpListener::bind("0.0.0.0:3000");
    Server::new(acceptor)
        .serve(route::route(redis_client.clone()))
        .await;
}
