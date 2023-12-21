FROM node:alpine as build-ts
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --save-dev
COPY ./codegen.yml .
COPY ./src/schema/schema.graphql /app/src/schema/schema.graphql
RUN npm run graphql:codegen
COPY . .
RUN npm run build
FROM node:alpine as ts-remove
WORKDIR /app
COPY --from=build-ts /app/package.json .
COPY --from=build-ts /app/package-lock.json .
RUN npm i --production
COPY --from=build-ts /app/dist ./dist
FROM node:alpine
WORKDIR /app
COPY --from=ts-remove /app .
CMD [ "npm", "run","start" ]
