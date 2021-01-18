FROM golang:1.15.6-buster as builder

# Install protoc, a dependency of gnostic
RUN apt-get update
RUN apt-get install -y protobuf-compiler

RUN go get -u github.com/google/gnostic
RUN go get -u github.com/google/gnostic-grpc
RUN go get -u github.com/golang/protobuf/protoc-gen-go
RUN go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway
RUN go get -u google.golang.org/grpc

COPY healthcheck.sh /

CMD ["gnostic"]

HEALTHCHECK --interval=1s --timeout=5s --start-period=1s --retries=30 CMD /healthcheck.sh
