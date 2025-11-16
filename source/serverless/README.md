# serverless

Kintoneをサーバーレス環境下で動作させるためのプロジェクトです

TypeScript + Express + AWS Lambda のサーバーレスアプリケーション

## プロジェクト構成

```
serverless/
├── src/
│   ├── lambda.ts           # Lambda エントリーポイント
│   ├── local.ts            # ローカル実行エントリーポイント
│   ├── main.ts             # メイン
│   ├── middleware/         # ミドルウェア
│   ├── routes/             # ルート定義
│   ├── utils/              # ユーティリティ
│   └── types/              # 型定義
esbuild.config.js           # ビルド設定
tsconfig.json               # TypeScript 設定
eslint.config.js            # ESLint 設定
.prettierrc                 # Prettier 設定
nodemon.json                # Nodemon 設定
package.json
```

## 技術スタック

- **Runtime**: Node.js 22.x → Lambdaに合わせて適当に
- **Language**: TypeScript
- **Framework**: Express.js
- **Build Tool**: esbuild
- **Libraries**:
  - `@codegenie/serverless-express` - Lambda 用 Express アダプター
  - `@kintone/rest-api-client` - Kintone API クライアント
  - `@date-fns/tz` - Lambdaに合わせ タイムゾーン日本にするため
  - `nodemon` - 開発時の自動リロード

## セットアップ

```bash
# 依存関係のインストール
npm install
```

## 開発

```bash
# 開発サーバーの起動 (ファイル監視 + 自動リロード)
npm run dev

# ビルドのみ
npm run build

# ビルド後のローカル実行
npm start
```

## コード品質

```bash
# ESLint でコードチェック
npm run lint

# Prettier でコード整形
npm run format
```

## エンドポイント

- `GET /health` - ヘルスチェック
- `GET /api/example` - サンプルエンドポイント (日時表示)
- `GET /api/status` - ステータス情報

## Lambda デプロイ

ビルド後、`dist/lambda.js` が Lambda ハンドラーとなります。

```bash
npm run build
# dist/lambda.js を Lambda にアップロード
# ハンドラー: lambda.handler
```

## 環境変数

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| `NODE_ENV` | 実行環境 | `development` |
| `PORT` | ローカル実行ポート | `3000` |
| `LOG_LEVEL` | ログレベル | `info` |
| `KINTONE_BASE_URL` | Kintone ベース URL | - |
| `KINTONE_API_TOKEN` | Kintone API トークン | - |