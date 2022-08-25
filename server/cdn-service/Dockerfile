FROM node:gallium-alpine as ts-compiler
WORKDIR /home/app

COPY ./package.json .
RUN yarn install

COPY . .
RUN yarn run build

FROM node:gallium-alpine as ts-remover
WORKDIR /home/app

COPY --from=ts-compiler /home/app/package.json ./
COPY --from=ts-compiler /home/app/dist ./

RUN yarn install --production

FROM node:gallium-alpine
WORKDIR /home/app
COPY --from=ts-remover /home/app ./
ENV PORT=3000
EXPOSE 3000
CMD ["node","index.js"]