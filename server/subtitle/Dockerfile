
################
##### Builder
FROM rust:slim-buster as builder

WORKDIR /usr/src
RUN apt-get update
RUN apt-get install musl-tools -y
RUN rustup target add x86_64-unknown-linux-musl

RUN mkdir -p subtitle/src

WORKDIR /usr/src/subtitle

# We want dependencies cached, so copy those first.
COPY Cargo.toml .

## Install target platform (Cross-Compilation) --> Needed for Alpine
RUN echo 'fn main(){println!("hello world")}' >> ./src/main.rs

# This is a dummy build to get the dependencies cached.
RUN cargo build --target x86_64-unknown-linux-musl --release

# Now copy in the rest of the sources
COPY ./src /usr/src/subtitle/src
RUN rm -rf ./target/x86_64-unknown-linux-musl/release/deps/subtitle* 
RUN rm -rf ./target/x86_64-unknown-linux-musl/release/.fingerprint/subtitle* 
RUN rm -rf ./target/x86_64-unknown-linux-musl/release/subtitle

# This is the actual application build.
RUN cargo build --target x86_64-unknown-linux-musl --release

################
##### Runtime
FROM alpine
WORKDIR /app

# Copy application binary from builder image
COPY --from=builder /usr/src/subtitle/target/x86_64-unknown-linux-musl/release/subtitle .


EXPOSE 3000

# Run the application
CMD ["./subtitle"]
