use std::sync::Mutex;

use actix_web::{
    http::header::{self, HeaderMap},
    web,
};

use crate::util::auth::{get_user_session, AuthSessionDataReturn};

#[derive(Clone)]
pub struct ContextUtil {
    headers: HeaderMap,
    socket: web::Data<
        Mutex<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>>,
    >,
    pub sdl: String,
}

impl juniper::Context for ContextUtil {}

impl ContextUtil {
    pub fn new(
        headers: &HeaderMap,
        socket: web::Data<
            Mutex<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>>,
        >,
        sdl: String,
    ) -> ContextUtil {
        return Self {
            headers: headers.clone(),
            socket: socket.clone(),
            sdl,
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
}
