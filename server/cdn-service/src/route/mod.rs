use crate::types::{RedisClient, TokenStorageTableNode};
use crate::upload_images;
use crate::util::{broadcast_get_image, gen_token, get_redis_key, send_uploaded_message};
use actix_multipart::form::tempfile::TempFile;
use actix_multipart::form::MultipartForm;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use redis::JsonAsyncCommands;

use serde_json::json;
pub fn route(redis: RedisClient) -> actix_web::Scope {
    let router = actix_web::Scope::new("/")
        .app_data(web::Data::new(redis.clone()))
        .service(hello_world)
        .service(gen_token_handler)
        .service(get_image_data_handler)
        .service(upload_file_handler);

    // router = router.push(Router::with_path("/save").post(UploadFile {
    //     redis: redis.clone(),
    // }));
    // router = router.push(Router::with_path("/get_image/<id>").get(GetImageData {
    //     redis: redis.clone(),
    // }));

    return router;
}

#[get("/")]
async fn hello_world() -> &'static str {
    "Hello world"
}

#[post("/gen_token")]
async fn gen_token_handler(
    _req: HttpRequest,
    redis: web::Data<RedisClient>,
    body: web::Json<Vec<crate::types::GenTokenNode>>,
) -> std::io::Result<HttpResponse> {
    // let body: serde_json::Value = req.parse_body::<serde_json::Value>().await.unwrap();
    let mut tokens = vec![];
    for v in body.0 {
        let (id, data, emit_to, event_name) = (v.id, v.data, v.emit_to, v.event_name);
        let token = gen_token(id.to_string());

        redis
            .get_tokio_connection()
            .await
            .unwrap()
            .json_set::<String, String, TokenStorageTableNode, bool>(
                get_redis_key(token.to_string()),
                "$".to_string(),
                &TokenStorageTableNode {
                    data: data.clone(),
                    emit_to: emit_to.to_string(),
                    event_name: event_name.to_string(),
                },
            );
        tokens.push(event_name.to_string());
        tokens.push(token.clone());
    }
    let sender_data = serde_json::json! {{
        "token":tokens
    }};

    return Ok(HttpResponse::Ok().json(sender_data));
}

#[get("/get_image/{id}")]
async fn get_image_data_handler(
    req: HttpRequest,
    path: web::Path<String>,
    redis: web::Data<RedisClient>,
) -> std::io::Result<HttpResponse> {
    // First mutable borrow scoped
    let image_id = path.into_inner();

    // Second mutable borrow
    let auth_header = match req.headers().get("authorization") {
        Some(v) => v.to_str().unwrap_or("").to_string(),
        None => "".to_string(),
    };

    let image_url = broadcast_get_image(image_id.to_string(), auth_header, &redis).await;

    Ok(HttpResponse::Ok().json(json!({
        "image_url":image_url.clone()
    })))
}

#[derive(Debug, MultipartForm)]
struct UploadForm {
    #[multipart(rename = "file")]
    files: Vec<TempFile>,
}

#[post("/save")]
async fn upload_file_handler(
    req: HttpRequest,
    redis: web::Data<RedisClient>,
    MultipartForm(form): MultipartForm<UploadForm>,
) -> std::io::Result<HttpResponse> {
    let token = std::env::var("TOKEN").unwrap();

    let files = form.files;

    let mut msgs = Vec::with_capacity(files.len());
    for file in files {
        let file_upload = std::fs::read(&file.file.path()).unwrap();
        let url = match upload_images::upload_images(
            token.to_string(),
            &file_upload,
            Some("The shartube upload images".to_string()),
        )
        .await
        {
            Ok(u) => u,
            Err(_) => {
                // res.status_code(StatusCode::INTERNAL_SERVER_ERROR);
                // res.render(Json(serde_json::json! {{
                //     "success":false,
                //     "message":"server error",
                //     "status":500
                // }}));
                return Ok(
                    HttpResponse::InternalServerError().json(serde_json::json! {{
                        "success":false,
                        "message":"server error",
                        "status":500
                    }}),
                );
            }
        };

        msgs.push(url);
    }
    match req.headers().get("upload_token") {
        Some(d) => {
            let upload_token = d.to_str().unwrap().to_string();
            println!("have header upload token ");

            send_uploaded_message(upload_token.clone(), msgs.clone(), &redis.clone()).await;
            if let Some(data) = req.headers().get("remove_token") {
                if data == "true" {
                    // self.token_storage
                    //     .lock()
                    //     .unwrap()
                    //     .remove(upload_token.as_str());
                    redis
                        .get_tokio_connection()
                        .await
                        .unwrap()
                        .json_del::<String, String, bool>(
                            upload_token.to_string(),
                            "$".to_string(),
                        );
                }
            }
        }
        None => {
            dbg!(&req.headers());
        }
    }

    Ok(HttpResponse::Ok().json(serde_json::json! {{
        "success":true,
        "message":"success",
        "status":200,
        "urls":msgs
    }}))
}
