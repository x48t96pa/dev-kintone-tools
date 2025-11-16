/* import 親 */
import KintoneRepository from './KintoneRepository';
/* import util */
import { isString, has } from 'lodash-es';
/* import core */
import { InternalError } from '@/shared/core/MyAppError';

/* type定義 */
type AppID = string | number;
type RecordID = string | number;

// TODO: kintone d.ts
type Record = {[fieldCode: string]: {value: unknown}};
type RecordInput = Record; // TODO: ジェネリクス で レコードの形

/**
 * @class Kintone アプリ リポジトリ
 * TODO: ジェネリクス で レコードの形
 */
export default class KintoneAppRepository extends KintoneRepository {
    /**
     * コンストラクタ
     * @param {AppID} app 接続する Kintone アプリID
     * @param {string|string[]|undefined} token API利用トークン
     */
    constructor(private readonly app: AppID, token: string | string[] = '') {
        // super
        super(token);

        // 値の指定がない → エラー
        if (!app) throw new InternalError('"app" must be not NULL or undefined.');
        if (!token) throw new InternalError('"token" must be not empty.');
    }

    /* public */
    /**
     * PK検索
     * @param {RecordID} id レコード 番号 (Kintone アプリのレコードのPK)
     * @returns {Promise<Record|undefined>} 検索結果
     */
    async findById(id: RecordID): Promise<Record | undefined> {
        // 前提条件
        if (!id) return void 0;
        if (!this.isInitialized()) this.initialize(); // 未初期化 → 初期化実行 TODO: あれ今思ったが... コンストラクタで良くなったのでは

        try {
            // Kintone検索 実行
            const { record } = await this.recordClient.getRecord({ app: this.app, id });
            return record && has(record, '$id') ? record : void 0;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }
    /**
     * 検索 条件指定 → 1件だけ
     * @param {string | undefined} query 条件
     * @returns {Promise<Record|undefined>} 検索結果
     */
    async findOne(query?: string): Promise<Record | undefined> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // 補完 = 検索条件 + limit
            const _query = (query ?? '').includes('limit') ? query : `${query} limit 1`;
            const records = await this.findBy(_query);

            // 検索結果 1件だけ
            return records && records.length > 0 ? records[0] : void 0;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }

    /**
     * UK指定 検索条件検索
     * @param {string} query 条件
     * @returns {Promise<Record|undefined>} 検索結果
     */
    protected __findByUK(query: string): Promise<Record | undefined> { return this.findOne(query); }

    /**
     * 検索 by 条件
     * @param {string} condition 条件
     * @param {string} orderBy orderBy句
     * @returns {Promise<Record[]>} 検索結果
     */
    async findBy(condition?: string, orderBy?: string): Promise<Record[]> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // TODO: Cursorの管理は面倒なんで 遅い Offsetで 耐えれなければ Cursorバージョンで頑張って
            const records = await this.recordClient.getAllRecordsWithOffset({ app: this.app, condition, orderBy});
            return records;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }

    /**
     * 全件検索 ※ 非推奨
     * @returns {Promise<Record<string, {value: any}>[]>} 検索結果
     */
    async findAll(): Promise<Record[]> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // TODO: Cursorの管理は面倒なんで 遅い Offsetで 耐えれなければ Cursorバージョンで頑張って
            const records = await this.findBy();
            return records;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }

    /**
     * 新規登録
     * @param {RecordInput} record 登録値
     * @returns {Promise<{id: string, revision: string}>} 登録結果
     */
    async insert(record: RecordInput): Promise<{ id: string; revision: string }> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // 登録
            const result = await this.recordClient.addRecord({ app: this.app, record });
            return result;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }
    /**
     * 一括 登録
     * @param {RecordInput[]} records 一括 登録値
     * @returns {Promise<{ ids: string[]; revisions: string[]; records: Array<{id: string; revision: string;}> }>} 登録結果
     */
    async bulkInsert(records: RecordInput[]): Promise<{ids: string[];revisions: string[];records: Array<{id: string;revision: string;}>}> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // 一括登録
            const results = await this.recordClient.addRecords({ app: this.app, records });
            return results;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }
    // overload
    async insertAll(records: RecordInput[]) { return this.bulkInsert(records); }

    /**
     * 更新
     * @param {RecordID} id レコード番号
     * @param {RecordInput} record 更新値
     * @returns {Promise<{revision: string}>} 更新結果
     */
    async update(id: RecordID, record: RecordInput): Promise<{ revision: string }> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // 更新
            const result = await this.recordClient.updateRecord({ app: this.app, id, record });
            return result;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }
    /**
     * 一括 更新
     * @param {Array<{ id: RecordID, record: RecordInput}>} records 各更新内容
     * @returns {Promise<{records: Array<{id: string; revision: string;}>}>} 各レコードの更新結果
     */
    async bulkUpdate(records: Array<{ id: RecordID, record: RecordInput}>): Promise<{records: Array<{id: string; revision: string;}>}> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // 更新
            const results = await this.recordClient.updateRecords({ app: this.app, records });
            return results;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }
    // overload
    async updateAll(records: Array<{ id: RecordID, record: RecordInput}>) { return this.bulkUpdate(records); }

    /**
     * 登録or更新
     * @param {keyof typeof record|{field: string, value: string|number}} updateKey 更新キー
     * @param {RecordInput} record 保存値
     * @returns {Promise<{id: string, revision: string}>} 保存結果
     */
    async upsert(updateKey: string | { field: string; value: string | number }, record: RecordInput): Promise<{ id: string; revision: string }> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // 入力補完
            const _updateKey = (isString(updateKey) && has(record, updateKey) ? { field: updateKey, value: record[updateKey].value } : updateKey) as { field: string; value: string | number };
            // 保存値
            const _record = Object.fromEntries(Object.entries(record).filter(([key]) => _updateKey.field !== key))

            // upsert 実行
            const result = await this.recordClient.upsertRecord({
                app: this.app,
                updateKey: _updateKey,
                record: _record,
            });
            return result;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }

    /**
     * 登録or更新 一括
     * @param {keyof typeof record} updateField UK
     * @param {RecordInput[]} _records 保存するレコード一覧 (UK込み)
     * @returns {Promise<{id: string, revision: string}>} 登録結果
     * @throws KintoneAPIException TODO:共通 KintoneAPIエラー今後
     */
    async upsertAll(updateField: string, _records: RecordInput[]): Promise<{ id: string; revision: string }[]> {
        // 前提条件
        if (!this.isInitialized()) this.initialize();

        try {
            // 保存値
            const records = _records
                .filter(record => has(record, updateField))
                .map(record => ({
                    // upsert key
                    updateKey: {field: updateField, value: record[updateField].value as string|number },
                    // upsert keyを除いたレコード内容
                    record: Object.fromEntries(Object.entries(record).filter(([key]) => updateField !== key))
                }))
            ;

            // 登録or更新 一括
            const { records: result } = await this.recordClient.updateAllRecords({
                app: this.app,
                upsert: true,
                records,
            });
            return result;
        } catch (e) {
            // TODO: 詳細なエラーハンドリング
            throw e;
        }
    }

    /* getter */
    get appId() { return this.app }
}
