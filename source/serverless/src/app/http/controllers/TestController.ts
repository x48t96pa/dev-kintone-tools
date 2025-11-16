/* import usecase */
import TestUsecase from '@/app/usecases/TestUsecase';
/* import core */
import { SuccessResponse } from '@/app/http/resources/MyAPIResource';
/* import types express */
import type { Request, Response } from 'express';

/**
 * @class Kintone接続テストなど
 */
export default class TestController {
    // TODO: 余裕ができたら injection
    private readonly usecase: TestUsecase;
    constructor() {
        this.usecase = new TestUsecase();
    }

    /**
     * 施設一覧 取得
     * @param {Request} _request リクエスト
     * @param {Response} response HTTPレスポンス
     */
    public async getTest(_request: Request, response: Response) {
        const result = await this.usecase.getTest();
        // API レスポンス
        return new SuccessResponse('OK', result).send(response);
    }
}