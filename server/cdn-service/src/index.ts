import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}

import bodyParser from "body-parser";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import express from "express";
import http from "http";
import { Discord } from "./discord";
import { register } from "./discord/commands";
import { VerifyDiscordRequest } from "./discord/verify";

const app = express();
const PORT = process.env.PORT || 3000 || 1688;
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true, limit: "7mb" }));
app.use(bodyParser.json({ limit: "7mb" }));
app.use(bodyParser.raw());

app.post(
  "/interactions",
  express.json({
    verify: VerifyDiscordRequest(process.env.CLIENT_KEY || ""),
  }),
  (req, res) => {
    const { type, data } = req.body;
    if (type === InteractionType.PING) {
      res.send({ type: InteractionResponseType.PONG });
      return;
    }
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;
      if (name === "ping") {
        res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Pong!",
          },
        });
        return;
      }
    }
  }
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.post("/", async (_req, res) => {
  res.send("Hello World!");
});

app.post("/save", async (req, res) => {
  const bot = new Discord(process.env.TOKEN || "");
  const { message } = req.body;

  if (!message) {
    res.send("No message");
    return;
  }

  const base64Image = message.split(";base64,").pop() as string;
  const image = Buffer.from(base64Image, "base64");

  try {
    const response = await bot.rest(
      `/channels/${process.env.CHANNEL_ID}/messages`,
      {
        files: image,
      },
      "POST"
    );
    console.log(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});
server.listen(PORT, async () => {
  console.log("Server is listening on port " + PORT);

  await register(
    process.env.APPLICATION_ID || "",
    {
      name: "ping",
      description: "Ping!",
      type: 1,
    },
    process.env.TOKEN
  );
});
