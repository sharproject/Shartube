FROM oven/bun as build
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install
COPY ./codegen.yml .
COPY ./src/schema/schema.graphql /app/src/schema/schema.graphql
RUN bun run graphql:codegen
COPY . .
RUN bun run build
FROM ubuntu
COPY --from=build /app/main .
EXPOSE 3000
ENTRYPOINT ["sh"]