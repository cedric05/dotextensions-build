# for more information visit https://github.com/cedric05/docker-python
save-all:
    BUILD \
        --platform=linux/arm64 \
        --platform=linux/amd64 \
        +build
build:
    FROM ghcr.io/cedric05/python:3.11.4
    ARG VERSION=0.0.42a11
    ARG TARGETPLATFORM
    LABEL maintainer="kesavarapu.siva@gmail.com"
    RUN apt update && apt install zip
    RUN pip install pyinstaller dothttp-req==${VERSION}
    WORKDIR /app
    COPY . /app 
    RUN wget https://raw.githubusercontent.com/cedric05/dothttp/v${VERSION}/dothttp/http.tx
    RUN wget https://raw.githubusercontent.com/cedric05/dothttp/v${VERSION}/dothttp/postScript.js
    RUN pyinstaller --distpath dist ./cli.py --add-data 'http.tx:.' --add-data 'postScript.js:.'  \
        && cd dist/ && zip -r ../cli.zip cli/  \
        && cd .. && rm -rf dist build
    SAVE ARTIFACT cli.zip AS LOCAL ./cli-$TARGETPLATFORM.zip
