use crate::util::auth::SenderData;
// change type of objectType to enum soon
pub fn check_id_real(
    socket: actix_web::web::Data<
        std::sync::Mutex<
            tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>,
        >,
    >,
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
            "id":message_id,
            "objectId":id,
            "objectType":object_type
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

            if !json_data.from.to_lowercase().ends_with("/CheckIdReal") {
                continue;
            }
            if !json_data.error.is_null() {
                return false;
            }
            return serde_json::from_str::<SenderData<CheckIdRealPayloadReturn>>(&text)
                .unwrap()
                .payload
                .real;
        }
    }
}
#[derive(Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct CheckIdRealPayloadReturn {
    #[serde(rename = "type")]
    pub object_type: String,
    pub real: bool,
    #[serde(rename = "objectID")]
    pub object_id: String,
}
