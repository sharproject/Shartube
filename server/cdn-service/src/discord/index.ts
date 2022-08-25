import { HttpMethod } from "@augu/orchid";
import { RestClient } from "@wumpcord/rest";
import "dotenv";
import axios, { AxiosRequestHeaders } from "axios";
import { type } from "../@type-api";

export const RegisterVersion = type.init(10);
function uuidV4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
type options = {
  body?: unknown;
  headers?: AxiosRequestHeaders;
  files?: Buffer;
};

export class Discord {
  token: string;
  constructor(token: string) {
    if (!token.startsWith("Bot")) {
      this.token = `Bot ${token}`;
    } else {
      this.token = token;
    }
  }

  public async rest(endpoint: string, option: options, method: HttpMethod) {
    if (option.body) option.body = JSON.stringify(option.body);
    if (option.files) {
      return await new RestClient({
        token: this.token.replace("Bot ", ""),
      }).dispatch({
        method: method as HttpMethod,
        endpoint: endpoint,
        file: {
          file: option.files,
          name: `${uuidV4()}.png`,
        },
      });
    } else {
      return await axios.post(`${RegisterVersion}/${endpoint}`,option.body, {
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json",
          "User-Agent":
            "Shartube (https://github.com/Folody-Team/Shartube, 1.0.0)",
        },

        method: method,
        ...option
      });
    }
  }
}
