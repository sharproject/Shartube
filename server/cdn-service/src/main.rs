extern crate dotenv;
mod types;
mod upload_images;

mod util;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use log::info;

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

    info!("Server started on port 3000 🚀");

    // let acceptor = TcpListener::new("0.0.0.0:3000").bind().await;
    // let service = salvo::Service::new(route::route(redis_client.clone()));
    // Server::new(acceptor).serve(service).await;
    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .wrap(actix_web::middleware::Logger::default())
            .service(route::route(redis_client.clone()))
            .default_service(web::route().to(route::not_found_handler))
    })
    .bind(("0.0.0.0", 3000))?
    .run()
    .await?;

    Ok(())
}
