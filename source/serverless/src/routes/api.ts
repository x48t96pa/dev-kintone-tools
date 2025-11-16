/************************************************
 * 外部公開系のAPI ルーティング
 ************************************************/
/* import express */
import { Router } from 'express';
/* import router */
import testRouter from './api/sample';

/* API URLルーティングの集約 */
const router = Router();

// TODO:おわたら削除 Kintoneテスト
router.use('/test', testRouter);

// ヘルスチェック
router.get('/healthy', (req, res) => {
    res.json({ message: 'Hello world!' });
});

/* export */
export default router;