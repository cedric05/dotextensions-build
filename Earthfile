# for more information visit https://github.com/cedric05/docker-python
save-all:
    BUILD \
        --platform=linux/arm64 \
        --platform=linux/amd64 \
        +build
build:
    ARG PYTHON_TAG=3.12.4
    # FROM ghcr.io/cedric05/python:${PYTHON_TAG}
    FROM python:${PYTHON_TAG}-bullseye
    ARG VERSION=0.0.44
    ARG TARGETPLATFORM
    ARG RUNNER_OS=Linux
    ARG RUNNER_ARCH=X64
    ARG BUILD_ID=
    ARG BUILD_NUMBER=
    ARG COMMIT=
    ARG SOURCE=
    LABEL maintainer="kesavarapu.siva@gmail.com"
    RUN apt update && apt install zip
    RUN pip install pyinstaller==6.1.0 dothttp-req==${VERSION} pip-licenses  
    WORKDIR /app
    COPY . /app 
    RUN wget https://raw.githubusercontent.com/cedric05/dothttp/v${VERSION}/dothttp/http.tx
    RUN wget https://raw.githubusercontent.com/cedric05/dothttp/v${VERSION}/dothttp/postScript.js
    RUN pip-licenses --format=json --output-file=licenses.json -l
    RUN pyinstaller --distpath dist ./cli.py --add-data 'http.tx:.' --add-data 'licenses.json:.' --add-data 'postScript.js:.'  --additional-hooks-dir=custom_hooks  \
        && python3 -c "import json; print(json.dumps({'version': '${VERSION}', 'dothttp_req': '${VERSION}', 'python': '${PYTHON_TAG}', 'pyinstaller': '6.1.0', 'platform': '${TARGETPLATFORM}', 'runner_os': '${RUNNER_OS}', 'runner_arch': '${RUNNER_ARCH}', 'build_id': '${BUILD_ID}', 'build_number': '${BUILD_NUMBER}', 'commit': '${COMMIT}', 'source': '${SOURCE}'}, indent=2))" > dist/cli/version.json \
        && cd dist/ && zip -r ../cli.zip cli/  \
        && cd .. && rm -rf dist build
    SAVE ARTIFACT cli.zip AS LOCAL ./cli-$TARGETPLATFORM.zip
