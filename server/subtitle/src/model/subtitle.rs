use async_graphql::{SimpleObject, ID, Enum};
use serde::{Deserialize, Serialize};

#[derive(Enum, Copy, Clone, Eq, PartialEq,Debug)]
pub enum SubtitleType {
    Comic,
}



#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct Subtitle {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ID>,

    pub content: String,
    
    pub s_type: String,
}
