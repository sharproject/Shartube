FROM debian:stable-slim as install
WORKDIR /app/dev

# install script needs curl or wget
RUN apt update && apt install -y curl
# We also need ca-certificates to trust certs
RUN apt update && apt install -y ca-certificates && rm -rf /var/lib/apt/lists/* && apt-get clean

RUN curl -sSL https://rover.apollo.dev/nix/latest | sh
RUN mv /root/.rover/bin/rover ./rover

RUN curl -sSL https://router.apollo.dev/download/nix/latest | sh

FROM debian:stable-slim
WORKDIR /app/dev

COPY --from=install /app/dev .

ENV APOLLO_ELV2_LICENSE=accept

# We also need ca-certificates to trust certs
RUN apt update && apt install -y ca-certificates && rm -rf /var/lib/apt/lists/* && apt-get clean

RUN echo "#!/usr/bin/env bash \
    \n./rover supergraph compose --config supergraph.yaml > supergraph.graphql && ./router -s supergraph.graphql -c router.yaml" > run.sh
RUN chmod 755 ./run.sh

COPY . .

ENTRYPOINT [ "./run.sh" ]