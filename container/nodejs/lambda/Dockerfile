# Lambda上で動作する Nodejsプロジェクト
FROM node:22-bullseye-slim

# パッケージ一覧(インデックス)を更新
RUN apt update \
    && yarn install

# コンテナ内(Ubuntu)のOSにインストールしておくやつ
RUN apt-get update && \
    apt-get -y install \
    zip \
    unzip \
    jq \
    curl \
    wget \
    vim \
    python3 \
    build-essential

# 作業ディレクトリ
WORKDIR /usr/src/app