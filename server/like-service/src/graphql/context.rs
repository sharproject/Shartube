use actix_web::{
    http::header::{self, HeaderMap},
    web,
};
use mongodb::{Collection, Database};

use crate::{
    types::{AuthSessionDataReturn, RedisClient},
    util::{auth::get_user_session, check_id_real::check_id_real},
};

use crate::graphql::types::{LikeInfo, Likes};

const LIKES_COLLECTION_NAME: &'static str = "likes";
const LIKE_INFO_COLLECTION_NAME: &'static str = "like_info";

#[derive(Clone)]
pub struct ContextUtil {
    headers: HeaderMap,
    redis_client: web::Data<RedisClient>,
    pub sdl: String,
    pub db: web::Data<Database>,
    pub likes_collection: Collection<Likes>,
    pub like_info_collection: Collection<LikeInfo>,
}

impl juniper::Context for ContextUtil {}

impl ContextUtil {
    pub fn new(
        headers: &HeaderMap,
        redis_client: web::Data<RedisClient>,
        sdl: String,
        db: web::Data<Database>,
    ) -> ContextUtil {
        let likes_collection = db.collection::<Likes>(LIKES_COLLECTION_NAME);
        let like_info_collection = db.collection::<LikeInfo>(LIKE_INFO_COLLECTION_NAME);
        return Self {
            headers: headers.clone(),
            redis_client: redis_client.clone(),
            sdl,
            db,
            likes_collection,
            like_info_collection,
        };
    }
    pub async fn is_authentication(&self) -> Option<AuthSessionDataReturn> {
        if !self.headers.contains_key(header::AUTHORIZATION) {
            return None;
        }
        let token = if let Some(header) = self.headers.get(header::AUTHORIZATION) {
            header.to_str().unwrap()
        } else {
            return None;
        };
        return get_user_session(token, self.redis_client.clone()).await;
    }
    pub async fn is_id_real(&self, id: String, object_type: String) -> bool {
        return check_id_real(self.redis_client.clone(), id, object_type).await;
    }
}
