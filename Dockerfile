FROM ghcr.io/cedric05/python3.9:main as builder

ARG VERSION
LABEL maintainer="kesavarapu.siva@gmail.com"
RUN apt update && apt install zip
RUN pip install pyinstaller
RUN pip install dothttp-req==${VERSION}
WORKDIR /app
ADD . /app 
RUN wget https://raw.githubusercontent.com/cedric05/dothttp/v${VERSION}/dothttp/http.tx
RUN pyinstaller --distpath dist ./cli.py --add-data 'http.tx:.'  \
    && cd dist/ && zip -r ../cli.zip cli/  \
    && cd .. && rm -rf dist build
