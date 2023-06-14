pub fn get_user_session(
    token: &str,
    socket: actix_web::web::Data<
        std::sync::Mutex<
            tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>,
        >,
    >,
) -> Option<AuthSessionDataReturn> {
    let message_id = uuid::Uuid::new_v4().to_string();
    let sender_data = SenderData {
        url: "user/decodeToken".to_string(),
        message_type: "message".to_string(),
        from: "like/auth".to_string(),
        header: serde_json::Value::Null,
        payload: serde_json::json! {{
            "token":token,
            "id":message_id
        }},
        error: serde_json::Value::Null,
    };
    let mut socket = socket.lock().unwrap();
    socket
        .write_message(tungstenite::Message::Text(
            serde_json::to_string(&sender_data).unwrap(),
        ))
        .unwrap();
    loop {
        let message = socket.read_message().unwrap();
        if let tungstenite::Message::Text(text) = message {
            let json_data = if let Ok(data) = serde_json::from_str::<SenderData>(&text) {
                data
            } else {
                continue;
            };
            if json_data.message_type != "req" {
                continue;
            }
            if let Some(id) = json_data.payload.get("id") {
                if id.as_str().unwrap() != message_id {
                    continue;
                }
            } else {
                continue;
            }

            if json_data.from != "user/decodeToken" {
                continue;
            }
            if !json_data.error.is_null() {
                return None;
            }
            return serde_json::from_str::<SenderData<AuthPayloadReturn>>(&text)
                .unwrap()
                .payload
                .session_data;
        }
    }
}
#[derive(Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct AuthSessionDataReturn {
    pub _id: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
    #[serde(rename = "creatorID")]
    pub creator_id: String,
    #[serde(rename = "userID")]
    pub user_id: String,
}

#[derive(Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct AuthPayloadReturn {
    pub id: String,
    #[serde(rename = "sessionData")]
    pub session_data: Option<AuthSessionDataReturn>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize, Default)]
pub struct SenderData<T = serde_json::Value> {
    pub url: String,
    pub header: serde_json::Value,
    pub payload: T,
    pub from: String,
    #[serde(default)]
    pub error: serde_json::Value,
    #[serde(rename = "type")]
    pub message_type: String,
}
