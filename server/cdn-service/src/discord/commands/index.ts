import "dotenv/config";
import { Discord } from "../index";

type command = {
  name: string;
  description: string;
  type: number;
};

export async function register(
  ID: string | number,
  command: command,
  token = ""
) {
  const endpoint = `/applications/${ID}/commands`;
  const method = "post";

  const discord = new Discord(token);
  await discord.rest(
    endpoint,
    {
      body: command,
    },
    method
  );
}
