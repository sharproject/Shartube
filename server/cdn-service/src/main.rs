extern crate dotenv;
mod types;
mod upload_images;

mod util;

use actix_cors::Cors;
use actix_web::{App, HttpServer};
use dotenv::dotenv;

mod route;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let redis_client = redis::Client::open(format!(
        "redis://{}:{}",
        std::env::var("REDIS_HOST").unwrap(),
        std::env::var("REDIS_PORT").unwrap()
    ))
    .unwrap();

    dbg!(&redis_client.get_connection_info().addr.to_string());

    println!("Server started on port 3000 🚀");

    // let acceptor = TcpListener::new("0.0.0.0:3000").bind().await;
    // let service = salvo::Service::new(route::route(redis_client.clone()));
    // Server::new(acceptor).serve(service).await;
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();
        App::new()
            .wrap(cors)
            .service(route::route(redis_client.clone()))
    })
    .bind(("0.0.0.0", 3000))?
    .run()
    .await?;

    Ok(())
}
