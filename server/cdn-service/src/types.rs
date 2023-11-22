use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use redis::{from_redis_value, ErrorKind, FromRedisValue, RedisResult, Value};
use serde::{Deserialize, Serialize};

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

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenStorageTableNode {
    pub data: serde_json::Value,
    pub emit_to: String,
    pub event_name: String,
}
impl FromRedisValue for TokenStorageTableNode {
    fn from_redis_value(v: &Value) -> RedisResult<Self> {
        // Try to convert the value into a map of strings
        let map: std::collections::HashMap<String, String> = from_redis_value(v)?;

        // Try to get the data field from the map and parse it as a JSON value
        let data = match map.get("data") {
            Some(s) => {
                serde_json::from_str(s).map_err(|_| (ErrorKind::TypeError, "Invalid data field"))?
            }
            None => return Err((ErrorKind::TypeError, "Missing data field").into()),
        };

        // Try to get the emit_to field from the map
        let emit_to = match map.get("emit_to") {
            Some(s) => s.clone(),
            None => return Err((ErrorKind::TypeError, "Missing emit_to field").into()),
        };

        // Try to get the event_name field from the map
        let event_name = match map.get("event_name") {
            Some(s) => s.clone(),
            None => return Err((ErrorKind::TypeError, "Missing event_name field").into()),
        };

        // Return a new instance of the type
        Ok(TokenStorageTableNode {
            data,
            emit_to,
            event_name,
        })
    }
}
// convert to db soon
// pub type TokenStorageTable = Arc<Mutex<BTreeMap<String, TokenStorageTableNode>>>;
pub enum WsError {
    DecodePayloadError,
}
pub struct SendWsErrorMetaInput {
    pub from: String,
    pub url: String,
    pub id: String,
}

pub type RedisClient = Arc<
    Mutex<redis::aio::Connection<std::pin::Pin<Box<dyn redis::aio::AsyncStream + Send + Sync>>>>,
>;
