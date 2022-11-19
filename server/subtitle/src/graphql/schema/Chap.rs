#![allow(non_snake_case)]
use async_graphql::*;
use serde::{Deserialize, Serialize};

use crate::model::subtitle::SubtitleType;

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex, rename_fields = "snake_case")]
#[graphql(extends)]
pub struct ComicChap {
    #[graphql(name = "_id")]
    #[graphql(external)]
    pub _id: String,
    pub id: String,
}

#[ComplexObject]
impl ComicChap {
    async fn subtitle(&self, _ctx: &Context<'_>) -> async_graphql::Result<Vec<SubtitleType>> {
        println!("{:?}", self._id);
        Ok(vec![])
    }
}
