# ブラウザ上で動作する Nodejsプロジェクト
FROM node:24-bullseye-slim

# パッケージ一覧(インデックス)を更新
RUN apt update \
    && yarn install

# コンテナ内(Ubuntu)のOSにインストールしておくやつ
RUN apt-get update && \
    apt-get -y install \
    curl \
    wget \
    zip \
    unzip \
    vim

# 作業ディレクトリ
WORKDIR /var/www/html