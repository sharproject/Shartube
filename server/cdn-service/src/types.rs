use std::{
    collections::{BTreeMap, HashMap},
    sync::{Arc, Mutex},
};

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



#[derive(Debug)]
pub struct TokenStorageTableNode {
    pub data: serde_json::Value,
    pub emit_to: String,
    pub event_name: String,
}
// convert to db soon
pub type TokenStorageTable = Arc<Mutex<BTreeMap<String, TokenStorageTableNode>>>;
pub enum WsError {
    DecodePayloadError,
}
pub struct SendWsErrorMetaInput {
    pub from: String,
    pub url: String,
    pub id: String,
}
