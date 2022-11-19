mod graphql;
mod model;
use crate::graphql::schema::query::RootQuery;
use actix_cors::Cors;
use actix_web::{guard, main, web, web::Data, App, HttpServer};
use async_graphql::{EmptyMutation, EmptySubscription, Schema};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use graphql::RootSchema;

async fn index(schema: web::Data<RootSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[main]
async fn main() -> std::io::Result<()> {
    let schema: RootSchema = Schema::build(RootQuery, EmptyMutation, EmptySubscription)
        .enable_federation()
        .finish();
    let address = std::net::SocketAddr::new(
        std::net::IpAddr::V4(std::net::Ipv4Addr::new(0, 0, 0, 0)),
        match std::env::var("PORT") {
            Ok(p) => p.parse::<i32>().unwrap().try_into().unwrap(),
            Err(_) => 3000,
        },
    );

    println!("server is running at http://{}", address.to_string());

    HttpServer::new(move || {
        let cors = Cors::permissive()
            .allow_any_header()
            .allow_any_method()
            .allow_any_origin()
            .allowed_origin_fn(|_a, _b| true);

        App::new()
            .app_data(Data::new(schema.clone()))
            .wrap(cors)
            .service(web::resource("/").guard(guard::Post()).to(index))
    })
    .bind(address.to_string())?
    .run()
    .await
}
