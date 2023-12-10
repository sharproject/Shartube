extern crate dotenv;
mod types;
mod upload_images;

use std::sync::Arc;
mod util;
mod ws;

use dotenv::dotenv;
use salvo::prelude::TcpListener;
use salvo::{Listener, Server};

use crate::ws::handle_socket_message;
mod route;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let redis_client = Arc::new(
        redis::Client::open(format!(
            "redis://{}:{}",
            std::env::var("REDIS_HOST").unwrap(),
            std::env::var("REDIS_PORT").unwrap()
        ))
        .unwrap(),
    );

    {
        let redis_client = redis_client.clone();
        tokio::spawn(async move {
            loop {
                handle_socket_message(redis_client.clone()).await;
            }
        })
        .await
        .unwrap();
    }

    println!("Server started on port 3000 🚀");
    let acceptor = TcpListener::new("0.0.0.0:3000").bind().await;
    Server::new(acceptor)
        .serve(route::route(redis_client.clone()))
        .await;
}
