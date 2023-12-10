use futures_util::StreamExt;
use redis::AsyncCommands;

use crate::types::{RedisClient, SenderData};

// push the message to service using redis pubsub
pub async fn send_service_message<T: for<'a> serde::Deserialize<'a>>(
    redis: &RedisClient,
    message: &SenderData,
    listen_response: bool,
) -> Result<Option<SenderData<T>>, Box<dyn std::error::Error + Send + Sync>> {
    let channel = message.url.to_string();
    let message_str = serde_json::to_string(&message)?;
    let _ = redis
        .get_async_connection()
        .await
        .unwrap()
        .publish(channel.to_string(), message_str)
        .await?;
    let mut pubsub = redis.get_async_connection().await.unwrap().into_pubsub();
    if listen_response {
        pubsub.subscribe(channel).await?;
        loop {
            let mut pubsub_stream = pubsub.on_message();
            let pubsub_msg: String = pubsub_stream.next().await.unwrap().get_payload()?;
            let message_data = serde_json::from_str::<SenderData<T>>(pubsub_msg.as_str())?;

            // && message_data.from == message.url because check id real
            if message_data.message_type == "rep"
                && message_data.id == message.id
                && message_data.url == message.from
            {
                return Ok(Some(message_data));
            }
        }
    }
    return Ok(None);
}
