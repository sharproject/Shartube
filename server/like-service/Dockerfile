FROM rust:alpine as rust-build
WORKDIR /home/app

RUN apk add git curl &&\
      apk add pkgconfig openssl-dev gcc musl-dev rustup &&\
      rm -rf /var/cache/apk/*

COPY Cargo.toml ./
RUN mkdir src && echo 'fn main() {}' > src/main.rs

RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

RUN rm -rf src

COPY . .
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

FROM alpine
WORKDIR /home/app


COPY --from=rust-build /home/app/target/release/like-service .
CMD ["./like-service"]
