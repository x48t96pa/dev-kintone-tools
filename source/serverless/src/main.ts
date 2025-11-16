/* import express */
import express from 'express';
/* import ルーター */
import router from '@/routes/api';
/* import 設定 */
import { isLocal } from '@/shared/config/app'
/* import type */
import type { Express } from 'express';

/* 初期化 */
export const app: Express = express();

/** サーバーセットアップ */
const setup = () => {
    /* セキュリティ */
    // TODO: CORSとか

    /* middleware */
    // 圧縮 TODO:いるっけ？
    // app.use(compression());
    // body-parser
    app.use(express.json());
    // AOP: ロギング TODO:今後
    // app.use(loggingAspect());

    // URLルーティング 登録
    if (isLocal) app.use('/dev', router); // ローカル環境
    else app.use(router);
    // ルーティング定義外 notfound
    app.use((_req, res, next) => { res.status(404).json({ message: 'Not Found' }); next() });

    // TODO: 独自エラーハンドリング
    // app.use(errorRequestHandler());
};

// サーバーセットアップ
setup();
/* export */
export default app;