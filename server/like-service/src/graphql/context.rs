use std::sync::Mutex;

use actix_web::{
    http::header::{self, HeaderMap},
    web,
};
use mongodb::{Collection, Database};

use crate::util::{
    auth::{get_user_session, AuthSessionDataReturn},
    check_id_real::check_id_real,
};

use crate::graphql::types::{LikeInfo, Likes};

const LIKES_COLLECTION_NAME: &'static str = "likes";
const LIKE_INFO_COLLECTION_NAME: &'static str = "like_info";

#[derive(Clone)]
pub struct ContextUtil {
    headers: HeaderMap,
    socket: web::Data<
        Mutex<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>>,
    >,
    pub sdl: String,
    pub db: web::Data<Database>,
    pub likes_collection: Collection<Likes>,
    pub like_info_collection: Collection<LikeInfo>,
}

impl juniper::Context for ContextUtil {}

impl ContextUtil {
    pub fn new(
        headers: &HeaderMap,
        socket: web::Data<
            Mutex<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>>,
        >,
        sdl: String,
        db: web::Data<Database>,
    ) -> ContextUtil {
        let likes_collection = db.collection::<Likes>(LIKES_COLLECTION_NAME);
        let like_info_collection = db.collection::<LikeInfo>(LIKE_INFO_COLLECTION_NAME);
        return Self {
            headers: headers.clone(),
            socket: socket.clone(),
            sdl,
            db,
            likes_collection,
            like_info_collection,
        };
    }
    pub fn is_authentication(&self) -> Option<AuthSessionDataReturn> {
        if !self.headers.contains_key(header::AUTHORIZATION) {
            return None;
        }
        let token = if let Some(header) = self.headers.get(header::AUTHORIZATION) {
            header.to_str().unwrap()
        } else {
            return None;
        };
        return get_user_session(token, self.socket.clone());
    }
    pub fn is_id_real(&self, id: String, object_type: String) -> bool {
        return check_id_real(self.socket.clone(), id, object_type);
    }
}
