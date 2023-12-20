extern crate dotenv;
mod types;
mod upload_images;

mod util;

use dotenv::dotenv;
use salvo::prelude::TcpListener;
use salvo::{Listener, Server};

mod route;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let redis_client = redis::Client::open(format!(
        "redis://{}:{}",
        std::env::var("REDIS_HOST").unwrap(),
        std::env::var("REDIS_PORT").unwrap()
    ))
    .unwrap();

    dbg!(&redis_client.get_connection_info().addr.to_string());

    println!("Server started on port 3000 🚀");
    let acceptor = TcpListener::new("0.0.0.0:3000").bind().await;
    Server::new(acceptor)
        .serve(route::route(redis_client.clone()))
        .await;
}
