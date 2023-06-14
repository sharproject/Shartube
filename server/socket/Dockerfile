FROM rust:alpine as rust-build
WORKDIR /home/app

COPY Cargo.toml Cargo.lock ./

RUN mkdir -p src && echo 'fn main() {}' > src/main.rs
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release


RUN rm -rf src

COPY ./src ./src

RUN rm -rf ./target/release/deps/socket*
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release

FROM alpine
WORKDIR /home/app


COPY --from=rust-build /home/app/target/release/socket .
CMD ["./socket"]