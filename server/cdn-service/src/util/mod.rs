use crate::types::{RedisClient, SendWsErrorMetaInput, SenderData, TokenStorageTableNode, WsError};
use redis::{AsyncCommands, JsonAsyncCommands};
use serde_json::json;
use tokio_stream::StreamExt;

pub fn get_redis_key(key: String) -> String {
    return format!("CDN_SERVICE_{}", key.to_string()).to_string();
}

pub async fn send_uploaded_message(
    token: String,
    images_url: Vec<String>,
    redis: &RedisClient,
) -> bool {
    // token_storage.lock().unwrap().get(&token)
    if let Ok(doc) = redis
        .get_async_connection()
        .await
        .unwrap()
        .json_get::<String, String, TokenStorageTableNode>(
            get_redis_key(token.to_string()),
            "$".to_string(),
        )
        .await
    {
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
        // match socket.send(Message::Text(serde_json::to_string(&sender_data).unwrap())) {
        //     Ok(_) => {
        //         return true;
        //     }
        //     Err(e) => {
        //         dbg!(&e);
        //         return false;
        //     }
        // };
        match send_service_message(redis, &sender_data, false).await {
            Ok(_) => {
                return true;
            }
            Err(e) => {
                dbg!(&e);
                return false;
            }
        };
    }
    return false;
}

pub async fn send_ws_error(error: WsError, meta: SendWsErrorMetaInput, redis: &RedisClient) {
    let sender_data = SenderData {
        url: meta.from,
        message_type: "rep".to_string(),
        from: meta.url,
        header: serde_json::Value::Null,
        payload: serde_json::Value::Null,
        error: serde_json::Value::String(match error {
            WsError::DecodePayloadError => "decode payload error".to_string(),
        }),
        id: meta.id.to_string(),
    };

    let _ = send_service_message(redis, &sender_data, false).await;
}

pub fn gen_token(uuid: String) -> String {
    uuid
}
// like result of upload_images::upload_images
pub fn get_image_url(id: String) -> Option<String> {
    return Some(id);
}

pub async fn broadcast_get_image(
    image_id: String,
    authorization_header: String,
    redis: &RedisClient,
) -> Option<String> {
    let image_url = get_image_url(image_id.clone());
    if image_url.is_none() {
        return image_url;
    }
    let request_id = uuid::Uuid::new_v4().to_string();

    let header = json!({
        "Authorization":authorization_header
    });
    let message_send_other = SenderData {
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
    };

    send_service_message(&redis.clone(), &message_send_other, false)
        .await
        .unwrap();

    return image_url;
}

// push the message to service using redis pubsub
pub async fn send_service_message(
    redis: &RedisClient,
    message: &SenderData,
    listen_response: bool,
) -> Result<Option<SenderData>, Box<dyn std::error::Error + Send + Sync>> {
    let channel = message.url.to_string();
    let message_str = serde_json::to_string(&message)?;
    let _ = redis
        .get_async_connection()
        .await
        .unwrap()
        .publish(channel.to_string(), message_str)
        .await?;
    let mut pubsub = redis.get_async_connection().await.unwrap().into_pubsub();
    if listen_response {
        pubsub.subscribe(channel).await?;
        loop {
            let mut pubsub_stream = pubsub.on_message();
            let pubsub_msg: String = pubsub_stream.next().await.unwrap().get_payload()?;
            let message_data = serde_json::from_str::<SenderData>(pubsub_msg.as_str())?;
            if message_data.message_type == "rep"
                && message_data.id == message.id
                && message_data.url == message.from
                && message_data.from == message.url
            {
                return Ok(Some(message_data));
            }
        }
    }
    return Ok(None);
}
