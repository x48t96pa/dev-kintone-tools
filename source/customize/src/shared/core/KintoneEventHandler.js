/* import config */
import { KINTONE_APP } from '@/shared/config/kintone';
/* import util */
import { isEmpty, isString, forEach, has, cloneDeep } from 'lodash';

/* static 内部 */
// 編集前のレコード内容保持
let beforeRecord = void 0;
kintone.events.on(KINTONE_APP.events.edit, (event) => {beforeRecord = event.record});

/**
 * @class Kintone イベントハンドラー 基本クラス
 */
export default class KintoneEventHandler {
    /**
     * コンストラクタ
     * @param {{record: {[key: string]: {value: unknown, error?: string|null}}, error?: string|null, type: string}} event Kintoneイベント
     */
    constructor(event) {
        this.event = event;
    }
    /* protected */
    /**
     * 指定フィールドコードの値取得
     * @param {string} fieldCode 指定フィールドコード 
     * @param {unknown|undefined} defaultValue 値なし(未定義など) 初期値
     * @returns {unknown} 値
     */
    getValue(fieldCode, defaultValue = void 0) {
        // 前提条件
        if (isEmpty(this.record)) throw new Error('レコードが取得できません.初期化してください');
        // 値 取得
        return this.record[fieldCode]?.value ?? defaultValue;
    }
    /**
     * 変更前の 指定フィールドコードの値取得
     * @param {string} fieldCode 指定フィールドコード 
     * @param {unknown|undefined} defaultValue 値なし(未定義など) 初期値
     * @returns {unknown|undefined} 変更前の 値
     */
    getBeforeValue(fieldCode, defaultValue = void 0) {
        // 前提条件
        if (isEmpty(this.beforeRecord)) return defaultValue ?? void 0; // 変更前のデータなし

        // 値 取得
        return this.beforeRecord[fieldCode]?.value ?? defaultValue;
    }
    /**
     * 指定フィールドコードの値 空
     * @param {string} fieldCode 指定フィールドコード
     * @returns {boolean} true: 指定フィールドコードの値 空 / false: それ以外
     */
    isEmpty(fieldCode) {
        //  指定フィールドコードの値 空
        return isEmpty(this.getValue(fieldCode));
    }
    /**
     * 指定フィールドのエラー設定
     * @param {string} fieldCode 
     * @param {string} error エラーメッセージ
     */
    setFieldError(fieldCode, error) {
        // エラー追加
        if (has(this.record, fieldCode)) this.record[fieldCode].error = error;
    }
    /**
     * レコードに値設定
     * @param {string|{[key: string]: {value: unknown}}} fieldCode フィールドコード または レコード（一括設定）
     * @param {unknown|undefined} value 設定する値
     */
    setRecord(fieldCode, value) {
        // 前提条件
        if (isEmpty(fieldCode)) return;

        // 入力補完
        const _record = isString(fieldCode) ? {[fieldCode]: { value }} : fieldCode;

        // 各フィールドコードの値 上書き
        forEach(_record, ({value}, key) => { this.event.record[key].value = value; });
    }

    /**
     * await 使えないとき よう kintone app管理record取得
     * @returns {{[key: string]: {value: unknown}}} レコードの値取得
     */
    getKintoneAppRecord() {
        const { record } = kintone.app.record.get();
        return record;
    }

    /* getter, setter */
    /**
     * @returns {{[key: string]: {value: unknown, error?: string|null}}} レコードの値取得
     */
    get record() { return this.event.record ?? this.getKintoneAppRecord(); }
    /**
     * @returns {kintone.app.Record|undefined} 編集前のレコード
     */
    get beforeRecord () { return beforeRecord && cloneDeep(beforeRecord); }
    /**
     * @returns {}
     */
    get recordId() { return has(this.event, 'recordId') ? this.event['recordId'] : kintone.app.record.getId() }
    /**
     * @returns {boolean} true: レコード存在
     */
    get hasRecord() { return !isEmpty(this.record); }
    /**
     * @returns {boolean} true: エラーあり
     */
    get hasError() { return !isEmpty(this.event.error ?? ''); }
    /**
     * @returns {string} イベントタイプ
     */
    get eventType() { return this.event.type; }
    /**
     * @returns {boolean} true: 新規登録処理時 イベント / false: それ以外
     */
    get isCreateSubmit() { return KINTONE_APP.events.createSubmit.includes(this.eventType); }
    /**
     * @returns {boolean} true: 更新処理時イベント / false: それ以外
     */
    get isUpdateSubmit() { return KINTONE_APP.events.editSubmit.includes(this.eventType); }
    /**
     * @returns {boolean} true: 新規登録 完了イベント / false: それ以外
     */
    get isCreated() { return KINTONE_APP.events.createSubmitSuccess.includes(this.eventType); }
    /**
     * @returns {boolean} true: 更新 完了イベント / false: それ以外
     */
    get isUpdated() { return KINTONE_APP.events.editSubmitSuccess.includes(this.eventType); }
    /**
     * 画面上部にアラート表示する メッセージ設定
     * @param {string|null} error 表示するメッセージ
     */
    set alertError(error) { this.event.error = error }
}