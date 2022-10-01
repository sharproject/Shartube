#![allow(non_snake_case)]
use async_graphql::*;

use crate::model::subtitle::SubtitleType;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize,SimpleObject)]
pub struct ComicChap {
    #[graphql(external)]
    pub(crate) _id: String,
    pub SubTitleIds: Option<Vec<String>>,
}

#[ComplexObject]
impl ComicChap {
    async fn subtitle(&self, ctx: &Context<'_>) -> async_graphql::Result<Vec<SubtitleType>> {
        println!("{:?}", self.SubTitleIds);
        Ok(vec![])
    }
}
