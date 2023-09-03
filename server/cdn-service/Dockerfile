FROM rust:slim as rust-build
WORKDIR /home/app

RUN apt-get update && apt-get install -y git curl && \
      apt-get install -y pkg-config libssl-dev gcc libc6-dev libgcc1 musl-tools && \
      apt-get clean

RUN rustup target add x86_64-unknown-linux-musl

COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo 'fn main() {}' > src/main.rs

RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release --target x86_64-unknown-linux-musl

RUN rm -rf src

COPY ./src ./src
# RUN rm -rf ./target/release/..fingerprint/upload_service*
RUN rm -rf ./target/x86_64-unknown-linux-musl/release/deps/upload_service*
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release --target x86_64-unknown-linux-musl

FROM alpine
WORKDIR /home/app


COPY --from=rust-build /home/app/target/x86_64-unknown-linux-musl/release/upload_service .
CMD ["./upload_service"]
