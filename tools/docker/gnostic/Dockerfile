FROM golang:1.15.6-buster as builder

ARG GNOSTIC_GIT_SHA="v0.5.3"
ARG PROTOBUF_VERSION="3.14.0"
ARG PROTOBUF_DL_ZIP_URL="https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOBUF_VERSION}/protobuf-all-${PROTOBUF_VERSION}.zip"
USER root
WORKDIR /

# Install protoc, a dependency of gnostic
RUN apt-get update
RUN apt-get install -y build-essential unzip
RUN apt-get install -y autoconf automake libtool curl make g++ unzip
RUN wget ${PROTOBUF_DL_ZIP_URL}
RUN unzip "protobuf-all-${PROTOBUF_VERSION}.zip" -d /
WORKDIR "/protobuf-${PROTOBUF_VERSION}/"
RUN ls -al
RUN ./configure
RUN make
RUN make check
RUN make install
RUN ldconfig
RUN protoc --version

RUN go get -u github.com/google/gnostic
RUN go get -u github.com/google/gnostic-grpc
RUN go get -u github.com/golang/protobuf/protoc-gen-go
RUN go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway
RUN go get -u google.golang.org/grpc

# RUN gnostic --text-out=/examples/petstore.text https://raw.githubusercontent.com/googleapis/gnostic/master/examples/v2.0/json/petstore.json

WORKDIR /go/src/github.com/google/gnostic-grpc/examples/end-to-end/
ENV ANNOTATIONS="third-party/googleapis"
RUN gnostic --grpc-out=. bookstore.yaml
RUN protoc --proto_path=. --proto_path=${ANNOTATIONS} --go_out=plugins=grpc:bookstore bookstore.proto

RUN protoc --proto_path=${ANNOTATIONS} --proto_path=. --include_imports --include_source_info \
    --descriptor_set_out=envoy-proxy/proto.pb bookstore.proto

# FROM debian:buster-20210111-slim

ARG APP=/usr/src/app

RUN apt-get update
RUN apt-get install -y ca-certificates tzdata tini
RUN rm -rf /var/lib/apt/lists/*

ENV TZ=Etc/UTC
ENV APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

# COPY --from=builder /gnostic/ ${APP}/gnostic/

RUN chown -R $APP_USER:$APP_USER ${APP}

USER $APP_USER
WORKDIR ${APP}

COPY healthcheck.sh /

EXPOSE 8080
EXPOSE 8081

ENTRYPOINT ["/usr/bin/tini", "--"]
# CMD ["gnostic"]

CMD [ "go run main.go" ]

HEALTHCHECK --interval=1s --timeout=5s --start-period=1s --retries=30 CMD /healthcheck.sh