/* import core */
import KintoneEventHandler from '@/shared/core/KintoneEventHandler';

/**
 * @class 一覧画面 表示イベントハンドラー
 */
export default class IndexHandler extends KintoneEventHandler {
    /**
     * コンストラクタ
     * @param {{record: {[key: string]: {value: unknown, error?: string|null}}, error?: string|null}} event 一覧画面 Kintoneイベント
     */
    constructor(event) {
        // super
        super(event);
    }
    /**
     * ユースケース実行
     * @param {{record: {[key: string]: {value: unknown, error?: string|null}}, error?: string|null}} event 一覧画面 Kintoneイベント
     * @returns {Promise<{record: {[key: string]: {value: unknown, error?: string|null}}, error?: string|null}>} 処理後のKintoneイベント
     */
    static async run(event) { return new IndexHandler(event).__invoke(); }
    async __invoke() {
        // 前提条件
        if (!this.event) return this.event;

        try {
            this.__test();

            // 処理終了
            return this.event;
        } catch (error) {
            // イベント終了
            this.alertError = '予期せぬエラーが発生しました';
            return this.event;
        }
    }

    /* private */
    __test() {
        console.log('何かしらの処理')
    }
}