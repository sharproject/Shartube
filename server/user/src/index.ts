import { readFileSync, existsSync, writeFileSync } from "fs";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { resolvers } from "./resolvers";
import { WsListen } from "./ws";
import mongoose from "mongoose";
import {
    getDbUrl,
    ParseGraphqlContext,
    type ParseGraphqlContextResult,
} from "./util";
import express from "express";
import * as http from "node:http";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse as GraphqlParse } from "graphql"
import crypto from "crypto"

const typeDefs = readFileSync(path.join(__dirname, "./schema/output.graphql"), {
    encoding: "utf-8",
});

export type GraphQLContext = ParseGraphqlContextResult;

const connect = async () => {
    try {
        const ws = new WsListen(
            `ws://${process.env["WS_HOST"]}:${process.env["WS_PORT"]}`,
        );
        ws.onopen = () => console.log("Connect to Ws server success");
        const url = getDbUrl();
        await mongoose.connect(url, {});
        console.log("Connect to mongodb server success");
    } catch (error) {
        console.log({ error });
    }
};


const setupPrivate = async () => {
    const privateKeyDir = path.join(__dirname, "./secret/key.private")
    if (existsSync(privateKeyDir)) return
    const key = await crypto.subtle.generateKey({
        name: 'HMAC',
        hash: 'SHA-512',
        length: 512,
    }, true, ['sign', 'verify']);
    writeFileSync(privateKeyDir, JSON.stringify((await crypto.subtle.exportKey("jwk", key))))
}

const main = async () => {
    const app = express();
    app.use(cors({
        credentials: true,
    }));
    app.use(express.json());
    const httpServer = http.createServer(app);
    await connect();
    const server = new ApolloServer<GraphQLContext>({
        schema: buildSubgraphSchema({ typeDefs: GraphqlParse(typeDefs), resolvers }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        csrfPrevention: false,
    });

    await server.start();
    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: async (input) => await ParseGraphqlContext(input),
        }),
    );
    setupPrivate()
    app.get("/", (_req, res) => {
        res.send("Hello world");
    });

    const PORT = 8080;
    httpServer.listen(
        PORT,
        () => console.log(`🚀 Server ready at http://localhost:${PORT}`),
    );
};

main().then(() => console.log("Start server success"));

