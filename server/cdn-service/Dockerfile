FROM node:gallium-alpine as ts-compiler
WORKDIR /home/app
RUN npm install -g npm@9.4.0

RUN apk add --update \
  python3 \
  python3-dev \
  py-pip \
  build-base \
  git \
  openssh-client &&\
  rm -rf /var/cache/apk/*

COPY ./package.json .
RUN npm install

COPY . .
RUN npm run build

FROM node:gallium-alpine as ts-remover
WORKDIR /home/app

RUN apk add --update \
  python3 \
  python3-dev \
  py-pip \
  build-base \
  git \
  openssh-client &&\
  rm -rf /var/cache/apk/*


RUN npm install -g npm@9.4.0

COPY --from=ts-compiler /home/app/package.json ./
COPY --from=ts-compiler /home/app/dist ./

RUN npm install --production

FROM node:gallium-alpine
WORKDIR /home/app
COPY --from=ts-remover /home/app ./
ENV PORT=3000
EXPOSE 3000
CMD ["node","index.js"]
