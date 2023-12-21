use crate::types::{AuthPayloadReturn, AuthSessionDataReturn, RedisClient};
use reqwest::header;

pub async fn get_user_session(
    token: &str,
    _redis_client: actix_web::web::Data<RedisClient>,
) -> Option<AuthSessionDataReturn> {
    // let message_id = uuid::Uuid::new_v4().to_string();
    // let sender_data = SenderData {
    //     url: "user/decodeToken".to_string(),
    //     message_type: "message".to_string(),
    //     from: "like/auth".to_string(),
    //     header: serde_json::Value::Null,
    //     payload: serde_json::json! {{
    //         "token":token,
    //         "id":message_id.clone()
    //     }},
    //     error: serde_json::Value::Null,
    //     id: message_id.clone(),
    // };
    // let response =
    //     send_service_message::<AuthPayloadReturn>(&redis_client.clone(), &sender_data, true)
    //         .await
    //         .unwrap();
    // if response.is_none() {
    //     return None;
    // }
    // let response = response.unwrap();
    // if !response.error.is_null() {
    //     return None;
    // }
    // return response.payload.session_data;
    let url = "http://shartube-user-server:8080/private/decodeToken";
    let client = reqwest::Client::new();
    let req_builder = client.get(url);
    let req = match req_builder
        .body(Vec::new())
        .header(header::AUTHORIZATION, token)
        .header(header::CONTENT_TYPE, "application/json")
        .build()
    {
        Ok(req) => req,
        Err(_) => return None,
    };
    let resp = match client.execute(req).await {
        Ok(resp) => resp,
        Err(_) => return None,
    };

    if !resp.status().is_success() {
        return None;
    }

    let payload: AuthPayloadReturn = match resp.json().await {
        Ok(payload) => payload,
        Err(_) => return None,
    };
    if let Some(session_data) = payload.session_data {
        return Some(session_data);
    }

    None
}
