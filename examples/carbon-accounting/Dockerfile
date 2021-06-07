FROM ubuntu:20.04 as builder

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# make sure apt is up to date
RUN apt-get update --fix-missing
RUN apt dist-upgrade -y

RUN DEBIAN_FRONTEND=noninteractive apt install -y build-essential software-properties-common

# Need git because some of our npm depedencies might be coming
# straight from github instead of being an npm package on npmjs.com.
RUN apt install -y git

# Need OpenJDK for the OpenAPI Generator which is a Java application.
RUN DEBIAN_FRONTEND=noninteractive apt install -y openjdk-11-jdk

# Some install scripts of the npm package fabric-network need python
RUN apt install -y python3.8 python3-pip

# Need it for sourcing .bashrc for nvm
RUN apt install -y bash

RUN apt install -y curl

RUN mkdir -p /usr/local/nvm
ENV NVM_DIR=/usr/local/nvm
ENV NODE_VERSION=16.3.0

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
    # && . $NVM_DIR/nvm.sh \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /
RUN mkdir /app/
WORKDIR /app/
COPY ./ ./
RUN npm ci
RUN ./node_modules/.bin/lerna clean --yes
RUN ./node_modules/.bin/lerna bootstrap
RUN npm run build:dev:backend
RUN npm run webpack:dev:web
RUN npm run build:dev:frontend -- --scope='@hyperledger/cactus-example-supply-chain-frontend'
# RUN ./node_modules/.bin/lerna clean --yes
# RUN ./node_modules/.bin/lerna bootstrap -- --production --no-optional

RUN rm -rf ./packages/cactus-test-plugin*
RUN rm -rf ./packages/cactus-test-cmd*
RUN rm -rf ./packages/cactus-test-api*
RUN rm -rf ./node_modules/

FROM cruizba/ubuntu-dind as runner

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt update

# Need curl for healthchecks
RUN apt install -y curl

# The file binary is used to inspect exectubles when debugging container image issues
RUN apt install -y file

# Need it for sourcing .bashrc for nvm
RUN apt install -y bash

RUN mkdir -p /usr/local/nvm
ENV NVM_DIR=/usr/local/nvm
ENV NODE_VERSION=16.3.0

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
    # && . $NVM_DIR/nvm.sh \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN apt install -y ca-certificates
RUN apt install -y tzdata

ARG APP=/usr/src/app/

ENV TZ=Etc/UTC
ENV APP_USER=appuser

RUN addgroup --system $APP_USER
RUN useradd --system $APP_USER -g $APP_USER
RUN mkdir -p ${APP}

COPY --chown=$APP_USER:$APP_USER --from=builder /app/ ${APP}

RUN mkdir -p "${APP}/log/"
RUN chown -R $APP_USER:$APP_USER "${APP}/log/"

# TODO: Can we hack it together so that the whole thing works rootless?
# USER $APP_USER

WORKDIR ${APP}

COPY --chown=${APP_USER}:${APP_USER} ./examples/carbon-accounting/healthcheck.sh /

ENV AUTHORIZATION_PROTOCOL=NONE
ENV AUTHORIZATION_CONFIG_JSON="{}"
ENV CACTUS_NODE_ID=-
ENV CONSORTIUM_ID=-
ENV KEY_PAIR_PEM=-
ENV COCKPIT_WWW_ROOT=examples/cactus-example-supply-chain-frontend/www/
ENV COCKPIT_TLS_ENABLED=false
ENV COCKPIT_CORS_DOMAIN_CSV=\*
ENV COCKPIT_MTLS_ENABLED=false
ENV COCKPIT_TLS_CERT_PEM=-
ENV COCKPIT_TLS_KEY_PEM=-
ENV COCKPIT_TLS_CLIENT_CA_PEM=-
ENV COCKPIT_HOST=0.0.0.0
ENV COCKPIT_PORT=3000
ENV API_MTLS_ENABLED=false
ENV API_TLS_ENABLED=false
ENV API_CORS_DOMAIN_CSV=\*
ENV API_TLS_CERT_PEM=-
ENV API_TLS_CLIENT_CA_PEM=-
ENV API_TLS_KEY_PEM=-
ENV API_HOST=0.0.0.0
ENV API_PORT=4000
ENV LOG_LEVEL=TRACE

COPY examples/carbon-accounting/supervisord.conf /etc/supervisord.conf

# supervisord web ui/dashboard
EXPOSE 9001
# API #1
EXPOSE 4000
# API #2
EXPOSE 4100
# GUI #1
EXPOSE 3000
# GUI #2
EXPOSE 3100
# API #3
EXPOSE 4200
# GUI #3
EXPOSE 3200

# Extend the parent image's entrypoint
# https://superuser.com/questions/1459466/can-i-add-an-additional-docker-entrypoint-script
ENTRYPOINT ["/usr/bin/supervisord"]
CMD ["--configuration", "/etc/supervisord.conf", "--nodaemon"]
HEALTHCHECK --interval=1s --timeout=5s --start-period=20s --retries=250 \
    CMD /usr/src/app/examples/carbon-accounting/healthcheck.sh
