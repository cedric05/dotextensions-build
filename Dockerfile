# for more information visit https://github.com/cedric05/docker-python3.9
FROM ghcr.io/cedric05/python:3.10.3 as builder

ARG VERSION
LABEL maintainer="kesavarapu.siva@gmail.com"
RUN apt update && apt install zip
RUN pip install pyinstaller dothttp-req==${VERSION}
WORKDIR /app
ADD . /app 
RUN wget https://raw.githubusercontent.com/cedric05/dothttp/v${VERSION}/dothttp/http.tx
RUN wget https://raw.githubusercontent.com/cedric05/dothttp/v${VERSION}/dothttp/postScript.js
RUN pyinstaller --distpath dist ./cli.py --add-data 'http.tx:.' --add-data 'postScript.js:.'  \
    && cd dist/ && zip -r ../cli.zip cli/  \
    && cd .. && rm -rf dist build
