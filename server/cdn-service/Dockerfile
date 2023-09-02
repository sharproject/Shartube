FROM rust:alpine as rust-build
WORKDIR /home/app

RUN apk add git curl &&\
      apk add pkgconfig openssl-dev gcc musl-dev rustup libc-dev libgcc &&\
      rm -rf /var/cache/apk/*

COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo 'fn main() {}' > src/main.rs

RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

RUN rm -rf src

COPY ./src ./src
# RUN rm -rf ./target/release/..fingerprint/upload_service*
RUN rm -rf ./target/release/deps/upload_service*
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

FROM alpine
WORKDIR /home/app


COPY --from=rust-build /home/app/target/release/upload_service .
CMD ["./upload_service"]
