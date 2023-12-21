#[macro_use]
extern crate juniper;
use std::{env, sync::Arc};

use actix_cors::Cors;
use actix_web::{
    middleware,
    web::{self, Data},
    App, Error, HttpResponse, HttpServer,
};
use graphql::{context::ContextUtil, schema::GraphqlSchema as Schema};
use juniper_actix::graphql_handler;
use mongodb::{Client, Database};
use types::RedisClient;
use util::get_db_url::get_db_url;
mod graphql;
mod repository;
mod rest;
mod types;
mod util;

async fn graphql_route(
    req: actix_web::HttpRequest,
    payload: actix_web::web::Payload,
    schema: web::Data<Schema>,
    redis: web::Data<RedisClient>,
    db: web::Data<Database>,
) -> Result<HttpResponse, Error> {
    let context = ContextUtil::new(
        req.headers(),
        redis,
        schema.clone().as_schema_language(),
        db,
    );

    graphql_handler(&schema, &context, req, payload).await
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env::set_var("RUST_LOG", "info");
    env_logger::init();
    let db_name = option_env!("DB_NAME").unwrap_or("likes");
    let client_options = get_db_url().await;
    let redis_client = Arc::new(
        redis::Client::open(format!(
            "redis://{}:{}",
            std::env::var("REDIS_HOST").unwrap(),
            std::env::var("REDIS_PORT").unwrap()
        ))
        .unwrap(),
    );
    let server = HttpServer::new(move || {
        let schema = graphql::schema::schema();
        let client = Client::with_options(client_options.clone()).unwrap();
        let db = client.database(&db_name);
        let redis = redis_client.clone();

        App::new()
            .app_data(Data::new(schema))
            .app_data(Data::new(redis))
            .app_data(Data::new(db))
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_header()
                    .allow_any_method()
                    .supports_credentials(),
            )
            .wrap(middleware::Compress::default())
            .wrap(middleware::Logger::default())
            .service(web::resource("/graphql").route(web::post().to(graphql_route)))
            .service(web::scope("/api").configure(rest::rest_scoped_config))
    });
    server.bind("0.0.0.0:8080").unwrap().run().await
}
