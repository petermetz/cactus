FROM golang:1.15.6-alpine3.12

RUN apk add --no-cache protobuf
RUN apk add --no-cache nodejs npm
RUN apk add --no-cache bash
RUN npm install -g ts-protoc-gen@0.14.0
RUN wget https://github.com/grpc/grpc-web/releases/download/1.2.1/protoc-gen-grpc-web-1.2.1-linux-x86_64 -O /usr/local/bin/protoc-gen-grpc-web
RUN chmod +x /usr/local/bin/protoc-gen-grpc-web

RUN apk add --no-cache curl && \
        mkdir -p /protobuf/google/protobuf && \
        for f in any duration descriptor empty struct timestamp wrappers; do \
        curl -L -o /protobuf/google/protobuf/${f}.proto https://raw.githubusercontent.com/google/protobuf/master/src/google/protobuf/${f}.proto; \
        done && \
        mkdir -p /protobuf/google/api && \
        for f in annotations http; do \
        curl -L -o /protobuf/google/api/${f}.proto https://raw.githubusercontent.com/grpc-ecosystem/grpc-gateway/master/third_party/googleapis/google/api/${f}.proto; \
        done

ENV GO111MODULE=on

RUN go get google.golang.org/protobuf/cmd/protoc-gen-go \
         google.golang.org/grpc/cmd/protoc-gen-go-grpc

ENTRYPOINT ["/usr/bin/protoc", "-I/protobuf"]

HEALTHCHECK --interval=1s --timeout=5s --start-period=1s --retries=30 CMD protoc --version
