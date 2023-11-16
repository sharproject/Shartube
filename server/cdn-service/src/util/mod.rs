use std::sync::Arc;

use crate::types::{SendWsErrorMetaInput, SenderData, TokenStorageTable, WsError};
use serde_json::json;
use tokio::sync::Mutex as TokioMutex;
use tungstenite::{connect, Message};
use url::Url;

pub fn send_uploaded_message(
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

pub async fn send_ws_error(
    error: WsError,
    meta: SendWsErrorMetaInput,
    socket: Arc<
        TokioMutex<
            tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>,
        >,
    >,
) {
    let sender_data = Some(SenderData {
        url: meta.from,
        message_type: "rep".to_string(),
        from: meta.url,
        header: serde_json::Value::Null,
        payload: serde_json::Value::Null,
        error: serde_json::Value::String(match error {
            WsError::DecodePayloadError => "decode payload error".to_string(),
        }),
        id: meta.id.to_string(),
    });
    let mut socket = socket.lock().await;
    match socket.write_message(Message::Text(serde_json::to_string(&sender_data).unwrap())) {
        Ok(_) => {}
        Err(e) => {
            dbg!(&e);
            return;
        }
    };
}

pub fn gen_token(uuid: String) -> String {
    uuid
}
// like result of upload_images::upload_images
pub fn get_image_url(id: String) -> Option<String> {
    return Some(id);
}

pub async fn broadcast_get_image(image_id: String, authorization_header: String) -> Option<String> {
    let image_url = get_image_url(image_id.clone());
    if image_url.is_none() {
        return image_url;
    }
    let request_id = uuid::Uuid::new_v4().to_string();

    let header = json!({
        "Authorization":authorization_header
    });
    let message_send_other = match serde_json::to_string(&SenderData {
        id: request_id.clone(),
        from: "cdn_service/cdn_get_image".to_string(),
        url: "all/client_get_cdn_image".to_string(),
        payload: json! {{
            "request_id": request_id.clone(),
            "headers" : header.clone(),
            "image_id":image_id.clone(),
            "message": "",
            "image_url": image_url
        }},
        error: serde_json::Value::Null,
        header: header.clone(),
        message_type: "rep".to_string(),
    }) {
        Ok(a) => a,
        Err(e) => {
            dbg!(&e);
            return image_url;
        }
    };
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
    match socket.write_message(Message::Text(message_send_other)) {
        Ok(_) => {}
        Err(e) => {
            dbg!(&e);
        }
    };
    return image_url;
}
