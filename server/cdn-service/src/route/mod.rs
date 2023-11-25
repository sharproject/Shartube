use crate::types::RedisClient;
use crate::upload_images;
use crate::util::{broadcast_get_image, send_uploaded_message};
use hyper::StatusCode;
use redis::JsonAsyncCommands;
use salvo::logging::Logger;
use salvo::writer::Json;
use salvo::{handler, Depot, Request, Response, Router};
use serde_json::json;
use tungstenite::connect;
use url::Url;
pub fn route(redis: RedisClient) -> salvo::Router {
    let mut router = salvo::Router::new().hoop(Logger);

    router = router.get(hello_world);
    router = router.push(Router::with_path("/save").post(UploadFile {
        redis: redis.clone(),
    }));
    router = router.push(Router::with_path("/get_image/<id>").get(get_image_data));

    return router;
}
#[handler]
async fn hello_world() -> &'static str {
    "Hello world"
}

#[handler]
async fn get_image_data<'a>(req: &mut Request, res: &mut Response) {
    // First mutable borrow scoped
    let image_id = req.param::<String>("id").unwrap();

    // Second mutable borrow
    let auth_header = match req.headers_mut().get("Authorization") {
        Some(v) => v.to_str().unwrap_or("").to_string(),
        None => "".to_string(),
    };

    let image_url = broadcast_get_image(image_id.to_string(), auth_header).await;

    res.render(Json(json!({
        "image_url":image_url.clone()
    })))
}

struct UploadFile {
    pub redis: RedisClient,
}

#[salvo::async_trait]
impl salvo::Handler for UploadFile {
    async fn handle(
        &self,
        req: &mut Request,
        _depot: &mut Depot,
        res: &mut Response,
        _ctrl: &mut salvo::FlowCtrl,
    ) {
        let token = std::env::var("TOKEN").unwrap();

        let files = req.all_files().await;

        let mut msgs = Vec::with_capacity(files.len());
        for file in files {
            let file_upload = std::fs::read(&file.path()).unwrap();
            let url = match upload_images::upload_images(
                token.to_string(),
                &file_upload,
                Some("The shartube upload images".to_string()),
            )
            .await
            {
                Ok(u) => u,
                Err(_) => {
                    res.set_status_code(StatusCode::INTERNAL_SERVER_ERROR);
                    res.render(Json(serde_json::json! {{
                        "success":false,
                        "message":"server error",
                        "status":500
                    }}));
                    return;
                }
            };

            msgs.push(url);
        }
        match req.headers_mut().get("upload_token") {
            Some(d) => {
                let upload_token = d.to_str().unwrap().to_string();
                println!("have header upload token ");
                let (mut socket, _response) = connect(
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

                send_uploaded_message(
                    upload_token.clone(),
                    msgs.clone(),
                    &self.redis.clone(),
                    &mut socket,
                )
                .await;
                if let Some(data) = req.headers_mut().get("remove_token") {
                    if data == "true" {
                        // self.token_storage
                        //     .lock()
                        //     .unwrap()
                        //     .remove(upload_token.as_str());
                        self.redis.lock().await.json_del::<String, String, bool>(
                            upload_token.to_string(),
                            "$".to_string(),
                        );
                    }
                }
            }
            None => {
                dbg!(&req.headers_mut());
            }
        }

        res.render(Json(serde_json::json! {{
            "success":true,
            "message":"success",
            "status":200,
            "urls":msgs
        }}));
    }
}
