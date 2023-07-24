extern crate dotenv;
mod types;
mod upload_images;

use std::collections::BTreeMap;
use std::sync::{Arc, Mutex};
use tungstenite::{connect, Message};
use types::SenderData;
use url::Url;

use dotenv::dotenv;
use hyper::StatusCode;
use salvo::prelude::TcpListener;
use salvo::writer::Json;
use salvo::{handler, Depot, Request, Response, Router, Server};

#[derive(Debug)]
struct TokenStorageTableNode {
    data: serde_json::Value,
    emit_to: String,
    event_name: String,
}
type TokenStorageTable = Arc<Mutex<BTreeMap<String, TokenStorageTableNode>>>;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let token_storage: TokenStorageTable = Arc::new(Mutex::new(BTreeMap::new()));
    {
        let token_storage = token_storage.clone();
        tokio::spawn(async move {
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

            loop {
                let msg = socket.read_message().expect("Error reading message");
                if let Message::Text(text) = msg {
                    let json_data = match serde_json::from_str::<types::SenderData>(&text) {
                        Err(e) => {
                            dbg!(&e);
                            continue;
                        }
                        Ok(d) => d,
                    };
                    if !json_data.message_type.eq("message") {
                        continue;
                    }
                    if json_data.url.eq("upload_token_registry/genToken") {
                        let mut sender_data = None;
                        if let serde_json::Value::Array(a) = json_data.payload {
                            let mut tokens = vec![];
                            for v in a {
                                let (id, data, emit_to, event_name) = (
                                    v.get("id").unwrap().as_str().unwrap(),
                                    v.get("data").unwrap(),
                                    v.get("emit_to").unwrap().as_str().unwrap(),
                                    v.get("event_name").unwrap().as_str().unwrap(),
                                );
                                let token = gen_token(id.to_string());

                                token_storage.lock().unwrap().insert(
                                    token.to_string(),
                                    TokenStorageTableNode {
                                        data: data.clone(),
                                        emit_to: emit_to.to_string(),
                                        event_name: event_name.to_string(),
                                    },
                                );
                                tokens.push(token.clone());
                            }
                            sender_data = Some(SenderData {
                                url: json_data.from,
                                message_type: "rep".to_string(),
                                from: json_data.url,
                                header: serde_json::Value::Null,
                                payload: serde_json::json! {{
                                    "id":json_data.id.to_string(),
                                    "token":tokens.clone()
                                }},
                                error: (serde_json::Value::Null),
                                id: json_data.id.to_string(),
                            });
                        } else if let serde_json::Value::Object(o) = json_data.payload {
                            let (id, data, emit_to, event_name) = (
                                o.get("id").unwrap().as_str().unwrap(),
                                o.get("data").unwrap(),
                                o.get("emit_to").unwrap().as_str().unwrap(),
                                o.get("event_name").unwrap().as_str().unwrap(),
                            );
                            let token = gen_token(id.to_string());
                            token_storage.lock().unwrap().insert(
                                token.to_string(),
                                TokenStorageTableNode {
                                    data: data.clone(),
                                    emit_to: emit_to.to_string(),
                                    event_name: event_name.to_string(),
                                },
                            );
                            sender_data = Some(SenderData {
                                url: json_data.from,
                                message_type: "rep".to_string(),
                                from: json_data.url,
                                header: serde_json::Value::Null,
                                payload: serde_json::json! {{
                                    "id":id.to_string(),
                                    "token":token.clone()
                                }},
                                error: (serde_json::Value::Null),
                                id: id.to_string(),
                            });
                        }
                        match socket.write_message(Message::Text(
                            serde_json::to_string(&sender_data).unwrap(),
                        )) {
                            Ok(_) => {}
                            Err(e) => {
                                dbg!(&e);
                                continue;
                            }
                        };
                    }
                }
            }
        });
    }
    let acceptor = TcpListener::bind("0.0.0.0:3000");
    Server::new(acceptor)
        .serve(route(token_storage.clone()))
        .await;
}
fn gen_token(uuid: String) -> String {
    uuid
}

fn route(token_storage: TokenStorageTable) -> salvo::Router {
    let mut router = salvo::Router::new();

    router = router.get(hello_world);
    router = router.push(Router::with_path("/save").post(UploadFile {
        token_storage: token_storage.clone(),
    }));

    return router;
}
#[handler]
async fn hello_world() -> &'static str {
    "Hello world"
}

struct UploadFile {
    pub token_storage: TokenStorageTable,
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
                    d.to_str().unwrap().to_string(),
                    msgs.clone(),
                    &self.token_storage,
                    &mut socket,
                );
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

fn send_uploaded_message(
    token: String,
    images_url: Vec<String>,
    token_storage: &TokenStorageTable,
    socket: &mut tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>,
) {
    if let Some(doc) = token_storage.lock().unwrap().get(&token) {
        let socket_url = format!("{}/{}", doc.emit_to, doc.event_name);
        let id = uuid::Uuid::new_v4().to_string();
        let data = doc.data.clone();
        let sender_data = SenderData {
            message_type: "message".to_string(),
            header: serde_json::Value::Null,
            from: "upload_token_registry/user_upload_webhook".to_string(),
            error: (serde_json::Value::Null),
            url: socket_url.to_string(),
            payload: serde_json::json!({
                "id":id.clone(),
                "url":images_url,
                "data": data
            }),
            id: id.clone(),
        };
        match socket.write_message(Message::Text(serde_json::to_string(&sender_data).unwrap())) {
            Ok(_) => {}
            Err(e) => {
                dbg!(&e);
            }
        };
    }
}
