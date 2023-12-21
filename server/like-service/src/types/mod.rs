use std::sync::Arc;

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
    pub id: String,
}

pub type RedisClient = Arc<redis::Client>;

#[derive(Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct CheckIdRealPayloadReturn {
    #[serde(rename = "type")]
    pub object_type: String,
    pub real: bool,
    #[serde(rename = "objectID")]
    pub object_id: String,
}
