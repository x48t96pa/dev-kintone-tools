/**
 * Kintone に関する定数定義
 */
export const KINTONE_APP = {
    // イベント定義
    events: {
        // 新規登録フォーム表示 イベント
        create: ['mobile.app.record.create.show', 'app.record.create.show'],
        // 新規登録フォーム保存時 イベント
        createSubmit: ['mobile.app.record.create.submit', 'app.record.create.submit'],
        // 新規登録フォーム保存成功 イベント
        createSubmitSuccess: ['mobile.app.record.create.submit.success', 'app.record.create.submit.success'],
        // 編集フォーム表示 イベント
        edit: ['mobile.app.record.edit.show', 'app.record.edit.show'],
        // 編集フォーム保存時 イベント
        editSubmit: ['mobile.app.record.edit.submit', 'app.record.edit.submit'],
        // 編集フォーム保存成功 イベント
        editSubmitSuccess: ['mobile.app.record.edit.submit.success', 'app.record.edit.submit.success'],
        // レコード 一覧画面表示後 イベント
        index: ['app.record.index.show', 'mobile.app.record.index.show'],
        // レコード 詳細表示 イベント
        show: ['mobile.app.record.detail.show', 'app.record.detail.show'],
        // レコード 詳細画面 プロセス管理 変更アクション
        onChangeProcess: ['app.record.detail.process.proceed', 'mobile.app.record.detail.process.proceed'],
        // 値変更 イベント 接頭辞
        onChangeFieldValuePrefix: ['app.record.create.change.', 'app.record.edit.change.'],
    },
    // URL定義
    url: {
        baseURL: `${import.meta.env.VITE_KINTONE_BASE_URL}`, // Kintone ベースURL
    },
    // Kintone アプリID定義
    appId: {
        // サンプルアプリ
        sample: parseInt(import.meta.env.VITE_KINTONE_TEST_APP_ID),
    },
    // Kintone アプリ トークン
    apiToken: {
        // サンプルアプリ
        sample: import.meta.env.VITE_KINTONE_TEST_API_TOKEN,
    },
}
