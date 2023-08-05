use std::collections::HashMap;

#[derive(Debug, serde::Deserialize, serde::Serialize, Default)]
pub struct SenderData {
    pub url: String,
    pub header: serde_json::Value,
    pub payload: serde_json::Value,
    pub from: String,
    #[serde(default)]
    pub error: serde_json::Value,
    #[serde(rename = "type")]
    pub message_type: String,
    pub id: String,
}

// TODO: impl this by type in api-gateway
#[derive(Debug, serde::Deserialize, serde::Serialize, Default)]
pub struct WsRequestMessage {
    pub headers: HashMap<String, String>,
    #[serde(rename = "requestID")]
    pub request_id: String,
    pub message: Vec<u8>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize, Default)]
pub struct GetImageMessageType {
    pub id: String,
}
