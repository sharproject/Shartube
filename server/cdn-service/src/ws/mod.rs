use redis::JsonAsyncCommands;
use serde_json::json;
use tokio_stream::StreamExt;

use crate::{
    types::{
        self, GetImageMessageType, RedisClient, SendWsErrorMetaInput, SenderData,
        TokenStorageTableNode, WsError, WsRequestMessage,
    },
    util::{gen_token, get_image_url, get_redis_key, send_service_message, send_ws_error},
};
pub async fn handle_socket_message(redis: RedisClient) {
    let redis_conn = redis.get_tokio_connection().await.unwrap();
    println!("Connected to Redis");
    let mut pubsub = redis_conn.into_pubsub();
    pubsub
        .subscribe("upload_token_registry/genToken")
        .await
        .unwrap();
    pubsub.subscribe("cdn_service/cdn_get_image").await.unwrap();
    let _ = tokio::spawn(async move {
        loop {
            // let msg = socket
            //     .clone()
            //     .lock()
            //     .await
            //     .read()
            //     .expect("Error reading message");
            // if let Message::Text(text) = msg {
            //     let json_data = match serde_json::from_str::<types::SenderData>(&text) {
            //         Err(e) => {
            //             dbg!(&e);
            //             continue;
            //         }
            //         Ok(d) => d,
            //     };
            //     if !json_data.message_type.eq("message") {
            //         continue;
            //     }
            //     if json_data.url.eq("upload_token_registry/genToken") {
            //         handle_gen_token(json_data, redis.clone()).await;
            //     } else if json_data.url.eq("cdn_service/cdn_get_image") {
            //         handle_cdn_get_image(json_data, socket.clone()).await;
            //     }
            // }
            let msg = pubsub.on_message().next().await.unwrap();
            let json_data = match serde_json::from_str::<types::SenderData>(
                &msg.get_payload::<String>().unwrap().as_str(),
            ) {
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
                handle_gen_token(json_data, redis.clone()).await;
            } else if json_data.url.eq("cdn_service/cdn_get_image") {
                handle_cdn_get_image(json_data, redis.clone()).await;
            }
        }
    })
    .await;
}

async fn handle_gen_token(json_data: SenderData, redis: RedisClient) {
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

            // token_storage.lock().unwrap().insert(
            //     token.to_string(),
            //     TokenStorageTableNode {
            //         data: data.clone(),
            //         emit_to: emit_to.to_string(),
            //         event_name: event_name.to_string(),
            //     },
            // );
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
        // token_storage.lock().unwrap().insert(
        //     token.to_string(),
        //     TokenStorageTableNode {
        //         data: data.clone(),
        //         emit_to: emit_to.to_string(),
        //         event_name: event_name.to_string(),
        //     },
        // );
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
    // match socket
    //     .clone()
    //     .lock()
    //     .await
    //     .write_message(Message::Text(serde_json::to_string(&sender_data).unwrap()))
    // {
    //     Ok(_) => {}
    //     Err(e) => {
    //         dbg!(&e);
    //         return;
    //     }
    // };

    if sender_data.is_none() {
        return;
    }
    let sender_data = sender_data.unwrap();
    match send_service_message(&redis, &sender_data, false).await {
        Ok(_) => {}
        Err(e) => {
            dbg!(&e);
            return;
        }
    };
}

async fn handle_cdn_get_image(json_data: SenderData, redis: RedisClient) {
    let payload = match serde_json::from_str::<WsRequestMessage>(&json_data.payload.to_string()) {
        Ok(v) => v,
        Err(_) => {
            send_ws_error(
                WsError::DecodePayloadError,
                SendWsErrorMetaInput {
                    from: json_data.url.clone(),
                    url: json_data.from.clone(),
                    id: json_data.id.clone(),
                },
                &redis,
            )
            .await;
            return;
        }
    };
    let message_string = match std::str::from_utf8(payload.message.clone().as_slice()) {
        Ok(s) => s,
        _ => {
            send_ws_error(
                WsError::DecodePayloadError,
                SendWsErrorMetaInput {
                    from: json_data.url.clone(),
                    url: json_data.from.clone(),
                    id: json_data.id.clone(),
                },
                &redis,
            )
            .await;

            return;
        }
    }
    .to_string();
    // decode message to the json have one field url
    let image_id = match serde_json::from_str::<GetImageMessageType>(&message_string) {
        Ok(d) => d,
        Err(_) => {
            send_ws_error(
                WsError::DecodePayloadError,
                SendWsErrorMetaInput {
                    from: json_data.url.clone(),
                    url: json_data.from.clone(),
                    id: json_data.id.clone(),
                },
                &redis,
            )
            .await;

            return;
        }
    }
    .id;
    let image_url = get_image_url(image_id.clone());
    let message_send_client = &SenderData {
        id: json_data.id.clone(),
        from: json_data.url.clone(),
        url: json_data.from.clone(),
        payload: json! {{
            "message":json!({
                "image_url": image_url.clone(),
                "image_id" : image_id.clone(),
            }).to_string().as_bytes().to_vec()
        }},
        error: serde_json::Value::Null,
        header: serde_json::Value::Null,
        message_type: "rep".to_string(),
    };
    // match socket
    //     .clone()
    //     .lock()
    //     .await
    //     .write_message(Message::Text(message_send_client))
    // {
    //     Ok(_) => {}
    //     Err(e) => {
    //         dbg!(&e);
    //         return;
    //     }
    // };

    match send_service_message(&redis, &message_send_client, false).await {
        Ok(_) => {}
        Err(e) => {
            dbg!(&e);
            send_ws_error(
                WsError::DecodePayloadError,
                SendWsErrorMetaInput {
                    from: json_data.url.clone(),
                    url: json_data.from.clone(),
                    id: json_data.id.clone(),
                },
                &redis,
            )
            .await
        }
    };

    // boastcast to all service with url and 2 payload
    let message_send_other = &SenderData {
        id: json_data.id.clone(),
        from: json_data.url.clone(),
        url: "all/client_get_cdn_image".to_string(),
        payload: json! {{
            "request_id": payload.request_id,
            "headers" : payload.headers,
            "image_id":image_id.clone(),
            "message": payload.message.clone(),
            "image_url":image_url.clone()
        }},
        error: serde_json::Value::Null,
        header: json_data.header.clone(),
        message_type: "rep".to_string(),
    };

    match send_service_message(&redis, &message_send_other, false).await {
        Ok(_) => {}
        Err(e) => {
            dbg!(&e);
            send_ws_error(
                WsError::DecodePayloadError,
                SendWsErrorMetaInput {
                    from: json_data.url.clone(),
                    url: json_data.from.clone(),
                    id: json_data.id.clone(),
                },
                &redis,
            )
            .await;
        }
    };
}
