#![allow(unused)]
#![allow(non_snake_case)]
extern crate async_graphql;
use async_graphql::*;
use serde::{Deserialize, Serialize};

use crate::model::subtitle::SubtitleType;

use super::Chap::ComicChap;

pub struct RootQuery;

#[Object(extends)]
impl RootQuery {
    #[graphql(entity)]
    pub async fn resolve_ComicChap(&self, #[graphql(key)] _id: String) -> ComicChap {
        ComicChap {
            _id: _id.clone(),
            id: _id.clone(),
        }
    }
}
