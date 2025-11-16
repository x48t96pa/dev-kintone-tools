/* import express */
import { Router } from 'express';
/* import controller */
import TestController from '@/app/http/controllers/TestController';
/* import middleware */
// TODO: errorHandle　→　ログ出力のやつ

/* TEST APIルーティング */
const router = Router();
// コントローラー 注入
const controller = new TestController();

// テスト一覧
router.get('', controller.getTest.bind(controller));

/* export */
export default router;
