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
}
