# dev-kintone-tools
本プロジェクトは 私的に作成しております。
一切の責任は負いません
Kintoneに関わるプロジェクト(Nodejsのサーバーから Kintone REST APIにてデータ接続するなど) の個人的なサンプル
または そのまま利用できるツールとして利用できるようにしたものです

## 資材
ディレクトリ構成
/(root)
    ┗ /container ... 各コンテナのイメージ Dockerfileなど
    ┗ /source ... プロジェクト管理コード
    ┗ docker-compose.yml ... 各プロジェクト のコンテナを起動するやーつ

以下の内容(プロジェクト)を source 配下で管理する予定
- source/serverless ... REST APIや バッチ などの Kintoneデータ操作する サーバーレス バックエンド
- source/customize ... Kintoneアプリ Javascriptカスタマイズ
- source/browser ... Kintoneサイト内で開いた ブラウザ開発者ツールで動作するJS

## setup
前提:
- docker compose起動できる

setup:
1. docker compose build
1. docker compose up -d
1. docker compose exec や runなどで実行する (詳細はプロジェクト依存)

