use crate::types::{RedisClient, TokenStorageTableNode};
use crate::upload_images;
use crate::util::{broadcast_get_image, gen_token, get_redis_key, send_uploaded_message};
use hyper::StatusCode;
use redis::JsonAsyncCommands;
use salvo::logging::Logger;
use salvo::writing::Json;
use salvo::{handler, Depot, Request, Response, Router};
use serde_json::json;
pub fn route(redis: RedisClient) -> salvo::Router {
    let mut router = salvo::Router::new().hoop(Logger::new());

    router = router.get(hello_world);
    router = router.push(Router::with_path("/save").post(UploadFile {
        redis: redis.clone(),
    }));
    router = router.push(Router::with_path("/get_image/<id>").get(GetImageData {
        redis: redis.clone(),
    }));

    router = router.push(Router::with_path("/private/gen_token").post(GenToken {
        redis: redis.clone(),
    }));

    return router;
}
#[handler]
async fn hello_world() -> &'static str {
    "Hello world"
}

struct GenToken {
    pub redis: RedisClient,
}

#[salvo::async_trait]
impl salvo::Handler for GenToken {
    async fn handle(
        &self,
        req: &mut Request,
        _depot: &mut Depot,
        res: &mut Response,
        _ctrl: &mut salvo::FlowCtrl,
    ) {
        let body = req.parse_body::<serde_json::Value>().await.unwrap();
        let mut sender_data = None;
        if let serde_json::Value::Array(a) = body {
            let mut tokens = vec![];
            for v in a {
                let (id, data, emit_to, event_name) = (
                    v.get("id").unwrap().as_str().unwrap(),
                    v.get("data").unwrap(),
                    v.get("emit_to").unwrap().as_str().unwrap(),
                    v.get("event_name").unwrap().as_str().unwrap(),
                );
                let token = gen_token(id.to_string());

                self.redis
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
            sender_data = Some(serde_json::json! {{
                "token":tokens
            }});
        } else if let serde_json::Value::Object(o) = body {
            let (id, data, emit_to, event_name) = (
                o.get("id").unwrap().as_str().unwrap(),
                o.get("data").unwrap(),
                o.get("emit_to").unwrap().as_str().unwrap(),
                o.get("event_name").unwrap().as_str().unwrap(),
            );
            let token = gen_token(id.to_string());
            self.redis
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
            sender_data = Some(serde_json::json! {{"token":token.clone()}});
        }
        res.render(Json(sender_data.unwrap()));
    }

}

struct GetImageData {
    pub redis: RedisClient,
}

#[salvo::async_trait]
impl salvo::Handler for GetImageData {
    async fn handle(
        &self,
        req: &mut Request,
        _depot: &mut Depot,
        res: &mut Response,
        _ctrl: &mut salvo::FlowCtrl,
    ) {
        // First mutable borrow scoped
        let image_id = req.param::<String>("id").unwrap();

        // Second mutable borrow
        let auth_header = match req.headers_mut().get("Authorization") {
            Some(v) => v.to_str().unwrap_or("").to_string(),
            None => "".to_string(),
        };

        let image_url = broadcast_get_image(image_id.to_string(), auth_header, &self.redis).await;

        res.render(Json(json!({
            "image_url":image_url.clone()
        })))
    }
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
                    res.status_code(StatusCode::INTERNAL_SERVER_ERROR);
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

                send_uploaded_message(upload_token.clone(), msgs.clone(), &self.redis.clone())
                    .await;
                if let Some(data) = req.headers_mut().get("remove_token") {
                    if data == "true" {
                        // self.token_storage
                        //     .lock()
                        //     .unwrap()
                        //     .remove(upload_token.as_str());
                        self.redis
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
