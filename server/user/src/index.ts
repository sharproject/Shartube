import { readFileSync } from 'fs';
import path from "path"
import { ApolloServer } from "@apollo/server"
import { resolvers } from './resolvers';
import { WsListen } from "./ws"
import mongoose from "mongoose"
import { getDbUrl, ParseGraphqlContext, type ParseGraphqlContextResult } from './util';
import express from "express"
import http from "http"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from "cors"

const typeDefs = readFileSync(path.join(__dirname, './schema/output.graphql'), { encoding: 'utf-8' });

export type GraphQLContext = ParseGraphqlContextResult

    ; (async () => {
        try {
            new WsListen(`ws://${Bun.env['WS_HOST']}:${Bun.env['WS_PORT']}`)
            const url = getDbUrl()
            await mongoose.connect(url, {})
        } catch (error) {
            console.log({ error })
        }
    })()

const app = express();
const httpServer = http.createServer(app)
const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();
app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
        context: async (input) => await ParseGraphqlContext(input),
    }),
);

const PORT = 8080
httpServer.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
);
