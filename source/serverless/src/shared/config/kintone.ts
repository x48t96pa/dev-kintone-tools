/* import kintone SDK */
// TODO: esbuildとLambdaによりけり
const KintoneRestAPIClient = require('@kintone/rest-api-client').KintoneRestAPIClient;
import type { KintoneRestAPIClient as KintoneRestAPIClientType } from '@kintone/rest-api-client';
/* import core */
import { InternalError } from '@/shared/core/MyAppError';

// 接続先
export const KINTONE_BASE_URL = process.env.KINTONE_BASE_URL
/**
 * @class Kintone API Client factory
 */
export class KintoneClientFactory {
    private client: KintoneRestAPIClientType | null;

    /**
     * コンストラクタ
     * @param {string|string[]|undefined} token 利用 APIトークン(複数:ルックアップ分)
     */
    constructor(private readonly token: string | string[] = '') {
        this.client = null; // Kintone SDK クライアント = 初期化前
    }

    /* public */
    /**
     * 簡易
     * @param {string|string[]|undefined} token API利用トークン
     * @returns {KintoneClientFactory} 自身
     */
    static of(token: string | string[] = '',): KintoneClientFactory {
        // インスタンス
        const client = new KintoneClientFactory(token);

        // 初期化実行
        client.initialize();
        // 生成結果
        return client;
    }

    /**
     * 初期化実行
     * @returns {KintoneClientFactory} 初期化後の自身
     */
    initialize(): this {
        // 初期化済み → 何もしない
        if (this.isInitialized()) return this;

        // クライアント初期化
        this.client = this.buildClient();
        if (!this.client) throw new InternalError('kintone client initialize failed.');

        // Kintone 初期化
        return this;
    }
    /**
     * @returns {boolean} true: 初期化済み/false:それ以外
     */
    isInitialized(): boolean {
        return !!this.client;
    }

    /**
     * @returns Kintone アプリ レコード API クライアント
     */
    get recordClient() {
        // 前提条件
        if (!this.client) throw new InternalError('need "initialize"');
        return this.client.record;
    }
    /**
     * @returns Kintone アプリ情報 API クライアント
     */
    get appClient() {
        // 前提条件
        if (!this.client) throw new InternalError('need "initialize"');
        return this.client.app;
    }
    /**
     * @returns Kintone ファイルアクセス API クライアント
     */
    get fileClient() {
        // 前提条件
        if (!this.client) throw new InternalError('need "initialize"');
        return this.client.file;
    }

    /* private */
    /**
     * Kintone REST API 接続クライアント 作成
     * @returns {Promise<KintoneRestAPIClient>} Kintone REST API 接続クライアント
     */
    private buildClient(): KintoneRestAPIClientType {
        // クライアント証明書
        const clientCertAuth = 
            !process.env.KINTONE_CERT_FILE_PATH // クライアント証明書の 設定なし
            ? void 0 // 何もしない
            : {
                // クライアント証明書
                password: process.env.KINTONE_CERT_FILE_PASSWORD ?? '',
                pfxFilePath: process.env.KINTONE_CERT_FILE_PATH ?? '',
            };

        // クライアントの作成
        return new KintoneRestAPIClient({
            baseUrl: KINTONE_BASE_URL, // 接続先
            auth: { apiToken: this.token }, // APIトークン
            clientCertAuth, // クライアント証明書
        });
    }
}