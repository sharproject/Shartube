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
    let cors = salvo::cors::Cors::new()
        .allow_origin(salvo::cors::AllowOrigin::any())
        .allow_headers(salvo::cors::AllowHeaders::any())
        // .allow_credentials(true)
        .allow_methods(salvo::cors::AllowMethods::any())
        .into_handler();
    let acceptor = TcpListener::new("0.0.0.0:3000").bind().await;
    let service = salvo::Service::new(route::route(redis_client.clone()))
        .catcher(salvo::catcher::Catcher::default().hoop(cors));
    Server::new(acceptor).serve(service).await;
}
