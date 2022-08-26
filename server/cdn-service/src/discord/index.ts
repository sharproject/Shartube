import "dotenv";
import fetch from "node-fetch";
import { type } from "../@type-api";
import { HttpMethod } from "@augu/orchid";
import { RestClient } from "@wumpcord/rest";
import { Response } from 'express';
import EventEmitter from "events";

export const RegisterVersion = type.init(10);
function uuidV4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
type options = {
  body?: any;
  headers?: any;
  files?: any;
};

declare interface Discord extends EventEmitter {
  on<U extends keyof IClientEvent>(event: U, listener: IClientEvent[U]): this;
  emit<U extends keyof IClientEvent>(
    event: U,
    ...args: Parameters<IClientEvent[U]>
  ): boolean;
}

class Discord extends EventEmitter {
  token: string;
  constructor(token: string) {
    super()
    if (!token.startsWith("Bot")) {
      this.token = `Bot ${token}`;
    } else {
      this.token = token;
    }
  }
  public listen = this.on;
  public add = this.emit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async rest(endpoint: string, option: options, method: string) {
    if (option.body) option.body = JSON.stringify(option.body);
    if (option.files) {
      new RestClient({ token: this.token.replace("Bot ", "") })
        .dispatch({
          method: method as HttpMethod,
          endpoint: endpoint,
          file: {
            file: option.files,
            name: `${uuidV4()}.png`,
          },
        }).then(re => {
          const d = re as any;
          this.emit('data', JSON.stringify(d))
        })
    } else {
      fetch(`${RegisterVersion}/${endpoint}`, {
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json; charset=UTF-8",
          "User-Agent":
            "Shartube (https://github.com/Folody-Team/Shartube, 1.0.0)",
        },

        method: method,
        ...option,
      }).then(re => {
        const d = re as any;
        this.emit('data', JSON.stringify(d))
      });
    }
  }
}


export {Discord}