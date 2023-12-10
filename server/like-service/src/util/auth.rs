use crate::types::{AuthPayloadReturn, AuthSessionDataReturn, RedisClient, SenderData};

use super::service::send_service_message;

pub async fn get_user_session(
    token: &str,
    redis_client: actix_web::web::Data<RedisClient>,
) -> Option<AuthSessionDataReturn> {
    let message_id = uuid::Uuid::new_v4().to_string();
    let sender_data = SenderData {
        url: "user/decodeToken".to_string(),
        message_type: "message".to_string(),
        from: "like/auth".to_string(),
        header: serde_json::Value::Null,
        payload: serde_json::json! {{
            "token":token,
            "id":message_id.clone()
        }},
        error: serde_json::Value::Null,
        id: message_id.clone(),
    };
    // let mut socket = socket.lock().unwrap();
    // socket
    //     .write_message(tungstenite::Message::Text(
    //         serde_json::to_string(&sender_data).unwrap(),
    //     ))
    //     .unwrap();
    // loop {
    //     let message = socket.read_message().unwrap();
    //     if let tungstenite::Message::Text(text) = message {
    //         let json_data = if let Ok(data) = serde_json::from_str::<SenderData>(&text) {
    //             data
    //         } else {
    //             continue;
    //         };
    //         if json_data.message_type != "req" {
    //             continue;
    //         }
    //         if let Some(id) = json_data.payload.get("id") {
    //             if id.as_str().unwrap() != message_id {
    //                 continue;
    //             }
    //         } else {
    //             continue;
    //         }

    //         if json_data.from != "user/decodeToken" {
    //             continue;
    //         }
    //         if !json_data.error.is_null() {
    //             return None;
    //         }
    //         return serde_json::from_str::<SenderData<AuthPayloadReturn>>(&text)
    //             .unwrap()
    //             .payload
    //             .session_data;
    //     }
    // }
    let response =
        send_service_message::<AuthPayloadReturn>(&redis_client.clone(), &sender_data, true)
            .await
            .unwrap();
    if response.is_none() {
        return None;
    }
    let response = response.unwrap();
    if !response.error.is_null() {
        return None;
    }
    return response.payload.session_data;
}
