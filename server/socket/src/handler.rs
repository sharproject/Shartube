use ws::{CloseCode, Handler, Handshake, Message, Result, Sender};

// This is the handler for the websocket connection.

pub(crate) struct Server {
    pub(crate) ws: Sender,
}
// public handler method to handle incoming messages.
pub(crate) fn handler() {
    impl Handler for Server {
        fn on_open(&mut self, _: Handshake) -> Result<()> {
            println!("Client connected");

            Ok(())
        }
        fn on_message(&mut self, msg: Message) -> Result<()> {
            // println!("Got message '{}'", msg);
            self.ws.broadcast(msg.clone())?;
            match msg {
                ws::Message::Text(t) => {
                    let json_data = serde_json::from_str::<serde_json::Value>(&t.clone());
                    println!("got the message {:#?}", json_data);
                }
                _ => {}
            }
            Ok(())
        }
        fn on_close(&mut self, code: CloseCode, reason: &str) {
            println!("WebSocket closing for ({:?}) {}", code, reason);
        }
    }
}
