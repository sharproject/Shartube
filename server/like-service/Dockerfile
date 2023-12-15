FROM rust:alpine as rust-build
WORKDIR /home/app

# gcc musl-dev rustup
RUN apk add git curl &&\
      apk add pkgconfig openssl-dev musl-dev &&\
      rm -rf /var/cache/apk/*

COPY Cargo.toml Cargo.lock ./

RUN mkdir -p src && echo 'fn main() {}' > src/main.rs
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

RUN rm -rf src

COPY ./src ./src

# RUN rm -rf ./target/release/deps/like_service*
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

FROM alpine
WORKDIR /home/app


COPY --from=rust-build /home/app/target/release/like-service .
CMD ["./like-service"]
