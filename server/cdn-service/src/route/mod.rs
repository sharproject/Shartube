use crate::types::{self, TokenStorageTable};
use crate::upload_images;
use crate::util::send_uploaded_message;
use hyper::StatusCode;
use salvo::writer::Json;
use salvo::{handler, Depot, Request, Response, Router};
use tungstenite::connect;
use url::Url;
pub fn route(token_storage: TokenStorageTable) -> salvo::Router {
    let mut router = salvo::Router::new();

    router = router.get(hello_world);
    router = router.push(Router::with_path("/save").post(UploadFile {
        token_storage: token_storage.clone(),
    }));
    router = router.push(Router::with_path("/get_image_data").post(get_image_data));

    return router;
}
#[handler]
async fn hello_world() -> &'static str {
    "Hello world"
}

#[handler]
async fn get_image_data<'a>(data: types::GetImageUrlRequestInput<'a>, res: &mut Response) {
    res.render(Json(data))
}

struct UploadFile {
    pub token_storage: TokenStorageTable,
}

#[salvo::async_trait]
impl salvo::Handler for UploadFile {
    async fn handle(
        &self,
        req: &mut Request,
        _depot: &mut Depot,
        res: &mut Response,
        _ctrl: &mut salvo::FlowCtrl,
    ) {
        let token = std::env::var("TOKEN").unwrap();

        let files = req.all_files().await;

        let mut msgs = Vec::with_capacity(files.len());
        for file in files {
            let file_upload = std::fs::read(&file.path()).unwrap();
            let url = match upload_images::upload_images(
                token.to_string(),
                &file_upload,
                Some("The shartube upload images".to_string()),
            )
            .await
            {
                Ok(u) => u,
                Err(_) => {
                    res.set_status_code(StatusCode::INTERNAL_SERVER_ERROR);
                    res.render(Json(serde_json::json! {{
                        "success":false,
                        "message":"server error",
                        "status":500
                    }}));
                    return;
                }
            };

            msgs.push(url);
        }
        match req.headers_mut().get("upload_token") {
            Some(d) => {
                println!("have header upload token ");
                let (mut socket, _response) = connect(
                    Url::parse(
                        &format!(
                            "ws://{}:{}",
                            std::env::var("WS_HOST").unwrap(),
                            std::env::var("WS_PORT").unwrap()
                        )
                        .to_string(),
                    )
                    .unwrap(),
                )
                .expect("Can't connect");
                send_uploaded_message(
                    d.to_str().unwrap().to_string(),
                    msgs.clone(),
                    &self.token_storage,
                    &mut socket,
                );
            }
            None => {
                dbg!(&req.headers_mut());
            }
        }
        res.render(Json(serde_json::json! {{
            "success":true,
            "message":"success",
            "status":200,
            "urls":msgs
        }}));
    }
}
