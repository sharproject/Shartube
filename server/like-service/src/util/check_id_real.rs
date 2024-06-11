use crate::types::{CheckIdRealPayloadReturn, RedisClient, SenderData};

use super::service::send_service_message;

// change type of objectType to enum soon
pub async fn check_id_real(
    redis_client: actix_web::web::Data<RedisClient>,
    id: String,
    object_type: String,
) -> bool {
    let message_id = uuid::Uuid::new_v4().to_string();
    let sender_data = SenderData {
        url: "all/CheckIDReal".to_string(),
        message_type: "message".to_string(),
        from: "like/checkIdReal".to_string(),
        header: serde_json::Value::Null,
        payload: serde_json::json! {{
            "id":message_id.clone(),
            "objectId":id,
            "objectType":object_type
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

    //         if !json_data.from.to_lowercase().ends_with("/CheckIdReal") {
    //             continue;
    //         }
    //         if !json_data.error.is_null() {
    //             return false;
    //         }
    //         return serde_json::from_str::<SenderData<CheckIdRealPayloadReturn>>(&text)
    //             .unwrap()
    //             .payload
    //             .real;
    //     }
    // }
    let response =
        send_service_message::<CheckIdRealPayloadReturn>(&redis_client.clone(), &sender_data, true)
            .await
            .unwrap();
    if response.is_none() {
        return false;
    }
    let response = response.unwrap();
    if !response
        .from
        .to_lowercase()
        .ends_with("/CheckIdReal".to_lowercase().as_str())
    {
        return false;
    }
    if !response.error.is_null() {
        return false;
    }
    return response.payload.real;
}
