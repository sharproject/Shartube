FROM golang:alpine as golang-compiler
WORKDIR /home/container
ENV CGO_ENABLED=0
COPY go.* .
RUN go mod download
COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build go build -o main.exe .

FROM golang:alpine as golang-remover
WORKDIR /home/container
COPY --from=golang-compiler /home/container/main.exe ./


FROM alpine
WORKDIR /home/container

COPY --from=golang-remover /home/container ./
EXPOSE 8080
CMD [ "/home/container/main.exe" ]