extern crate hyper;
extern crate tokio;

use hyper::header::{AUTHORIZATION, CONTENT_TYPE};
use hyper::{Client, Request};
use hyper_tls::HttpsConnector;
use std::io::prelude::*;
use std::ptr;

const BOUNDARY: &'static str = "------------------------ea3bbcf87c101592";
#[derive(Debug, serde::Deserialize, serde::Serialize, Default)]
struct RequestJsonData {
    content: Option<String>,
    attachments: Vec<RequestAttachment>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize, Default)]
struct RequestAttachment {
    id: i32,
    filename: String,
}

fn image_data(image: &Vec<u8>, content: Option<String>) -> std::io::Result<Vec<u8>> {
    let mut data = Vec::new();
    let file_name = "siuu.png";
    write!(data, "--{}\r\n", BOUNDARY)?;

    write!(data,"Content-Disposition: form-data; name=\"payload_json\"\r\nContent-Type: application/json\r\n")?;
    write!(data, "\r\n")?;

    let json = {
        let mut data_object = RequestJsonData::default();
        data_object.attachments.push(RequestAttachment {
            id: 0,
            filename: file_name.to_string(),
        });
        data_object.content = content;
        serde_json::to_string(&data_object).unwrap()
    };

    write!(data, "{}", json)?;

    write!(data, "\r\n")?;
    write!(data, "--{}\r\n", BOUNDARY)?;
    write!(
        data,
        "Content-Disposition: form-data; name=\"files[0]\"; filename=\"{}\"\r\n",
        file_name
    )?;
    write!(data, "Content-Type: image/png\r\n")?;
    write!(data, "\r\n")?;
    append_vec(&mut data, &image);

    write!(data, "\r\n")?; // The key thing you are missing
    write!(data, "--{}--\r\n", BOUNDARY)?;

    Ok(data)
}

pub enum UploadImageError {
    ErrorGenData(std::io::Error),
    ErrorCreateRequest,
    ReadResponseError,
}
pub async fn upload_images(
    token: String,
    image: &Vec<u8>,
    content: Option<String>,
) -> Result<String, UploadImageError> {
    let https = HttpsConnector::new();
    let client = Client::builder().build::<_, hyper::Body>(https);

    let data = match image_data(image, content) {
        Ok(d) => d,
        Err(e) => return Err(UploadImageError::ErrorGenData(e)),
    };

    let channel_id = std::env::var("CHANNEL_ID").unwrap();

    let req = match Request::post(format!(
        "https://discord.com/api/v10/channels/{}/messages",
        channel_id
    ))
    .header(
        CONTENT_TYPE,
        &*format!("multipart/form-data; boundary={}", BOUNDARY),
    )
    .header(AUTHORIZATION, format!("Bot {}", token))
    .body(data.into())
    {
        Ok(r) => r,
        Err(_) => return Err(UploadImageError::ErrorCreateRequest),
    };

    let response = match client
        .request(req)
        .await
        .map_err(|e| log::error!("request error: {}", e))
    {
        Ok(r) => r,
        Err(_) => return Err(UploadImageError::ReadResponseError),
    };
    let body = match hyper::body::to_bytes(response.into_body()).await {
        Ok(b) => b,
        Err(_) => return Err(UploadImageError::ReadResponseError),
    };
    let s: serde_json::Value = match serde_json::from_slice(&body) {
        Ok(s) => s,
        Err(_) => return Err(UploadImageError::ReadResponseError),
    };
    let url = s
        .get("attachments".to_string())
        .unwrap()
        .as_array()
        .unwrap()[0]
        .get("url")
        .unwrap()
        .as_str()
        .unwrap()
        .to_string();
    return Ok(url);
}

pub fn append_vec<T>(dst: &mut Vec<T>, src: &Vec<T>) {
    let src_len = src.len();
    let dst_len = dst.len();

    // Ensure that `dst` has enough capacity to hold all of `src`.
    dst.reserve(src_len);

    unsafe {
        // The call to offset is always safe because `Vec` will never
        // allocate more than `isize::MAX` bytes.
        let dst_ptr = dst.as_mut_ptr().offset(dst_len as isize);
        let src_ptr = src.as_ptr();

        // The two regions cannot overlap because mutable references do
        // not alias, and two different vectors cannot own the same
        // memory.
        ptr::copy_nonoverlapping(src_ptr, dst_ptr, src_len);

        // Notify `dst` that it now holds the contents of `src`.
        dst.set_len(dst_len + src_len);
    }
}
