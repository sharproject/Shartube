use actix_web::{web, HttpResponse};
pub fn rest_scoped_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/like").route(web::get().to(|| async { HttpResponse::Ok().body("test") })),
    );
}
