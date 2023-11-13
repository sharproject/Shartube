use std::sync::Arc;

use tokio::sync::Mutex as TokioMutex;
use tungstenite::Message;

use crate::types::{SendWsErrorMetaInput, SenderData, TokenStorageTable, WsError};

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
pub fn get_image_url(id: String) -> String {
    return id;
}
