#![allow(unused)]
#![allow(non_snake_case)]
extern crate async_graphql;
use async_graphql::*;
use serde::{Deserialize, Serialize};

use crate::model::subtitle::SubtitleType;

use super::Chap::ComicChap;

pub struct RootQuery;

#[Object]
impl RootQuery {
    #[graphql(entity)]
    async fn find_chap_by_id(&self, id: String) -> ComicChap {
        ComicChap {
            _id: id,
            SubTitleIds: Option::None,
        }
    }
}
