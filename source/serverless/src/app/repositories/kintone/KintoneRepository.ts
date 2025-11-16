/* import client factory */
import { KintoneClientFactory } from '@/shared/config/kintone';
/* import core */
import { InternalError } from '@/shared/core/MyAppError';

/**
 * @class Kintone操作リポジトリ 基礎クラス
 */
export default abstract class KintoneRepository {
    private clinetFactory: KintoneClientFactory | null;
    /**
     * コンストラクタ
     * @param {string|string[]|undefined} token API利用トークン
     */
    constructor(protected readonly token: string | string[] = '') {
        this.clinetFactory = null;
        this.token = token;
    }

    /* public */
    /**
     * 初期化実行
     * @returns {KintoneRepository} 初期化後の自身
     */
    initialize(): KintoneRepository {
        // 初期化済み → 何もしない
        if (this.isInitialized()) return this;

        // クライアント生成器 初期化
        this.clinetFactory = KintoneClientFactory.of(this.token);
        return this;
    }
    /**
     * @returns {boolean} true: 初期化済み/false:それ以外
     */
    isInitialized(): boolean {
        // 前提条件
        if (!this.clinetFactory) return false;
        return this.clinetFactory.isInitialized();
    }

    /* getter */
    /**
     * @returns Kintone アプリ レコード API クライアント
     */
    get recordClient() {
        // 前提条件
        if (!this.clinetFactory) throw new InternalError('need "initialize"');
        return this.clinetFactory.recordClient;
    }
    /**
     * @returns Kintone アプリ情報 API クライアント
     */
    get appClient() {
        // 前提条件
        if (!this.clinetFactory) throw new InternalError('need "initialize"');
        return this.clinetFactory.appClient;
    }
    /**
     * @returns Kintone ファイルアクセス API クライアント
     */
    get fileClient() {
        // 前提条件
        if (!this.clinetFactory) throw new InternalError('need "initialize"');
        return this.clinetFactory.fileClient;
    }
}