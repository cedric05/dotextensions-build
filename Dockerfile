FROM ghcr.io/cedric05/python3.9:main as builder

ARG VERSION
LABEL maintainer="kesavarapu.siva@gmail.com"
WORKDIR /app
RUN pip install dothttp-req==${VERSION}}
ADD . /app 
RUN apt update && apt install zip
RUN pyinstaller --distpath dist ./cli.py --add-data 'http.tx'  \
    && cd dist/ && zip -r ../cli.zip cli/  \
    && cd .. && rm -rf dist build
