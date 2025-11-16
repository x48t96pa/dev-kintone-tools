/**
 * @class Kintone APIをブラウザ利用するときの ヘルパー
 */
class KintoneAPIClientHelper {
  /**
   * コンストラクタ
   * @param {number} app Kintone アプリID
   * @param {string|string[]|undefined} tokens 権限ないときの Kintoneアプリトークン
   */
  constructor(app, tokens) {
    this.app = app;
    this.tokens = tokens;
  }

  /* public */
  /**
   * 省略コンストラクタ
   * @param {number} app Kintone アプリID
   * @param {string|string[]|undefined} tokens 権限ないときの Kintoneアプリトークン
   * @returns {KintoneAPIClientHelper} ヘルパー
   */
  static of(app, tokens) {
    return new KintoneAPIClientHelper(app, tokens);
  }
  /**
   * PK 検索
   * @param {object} param
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|number|undefined} param.id 検索対象のレコード
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{records: object[]}>} 取得通信 結果
   */
  static async findById({ app = kintone.app.getId(), id, tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__get({ id });
  }
  /**
   * 条件指定 検索
   * @param {object} param
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|undefined} param.query 実行するクエリ文字列
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{records: object[]}>} 取得通信 結果
   */
  static async findBy({ app = kintone.app.getId(), query = '', tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__get({
      query,
      totalCount: true,
    });
  }
  /**
   * 条件なし 全件 検索
   * @param {object} param
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{records: object[]}>} 取得通信 結果
   */
  static async findAll({ app = kintone.app.getId(), tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__get({ totalCount: true });
  }

  /**
   * 一件登録
   * @param {object} param
   * @param {{[key: string]:{value:unknown}}} param.record 登録値
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{ids: [], revisions:[]}>} 登録結果
   */
  static async post({ record = {}, app = kintone.app.getId(), tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__post(record, tokens);
  }
  /**
   * 一括登録
   * @param {object} param
   * @param {{[key: string]:{value:unknown}}[]} param.records 登録値
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{ids: [], revisions:[]}>} 登録結果
   */
  static async postAll({ records = [], app = kintone.app.getId(), tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__postAll(records, tokens);
  }

  /**
   * 一件更新
   * @param {object} param
   * @param {number|string} param.id 更新レコード
   * @param {{[key: string]:{value:unknown}}} param.record 更新値
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{ids: [], revisions:[]}>} 更新結果
   */
  static async put({ id, record = {}, app = kintone.app.getId(), tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__put(id, record, tokens);
  }
  /**
   * 一括更新
   * @param {object} param
   * @param {{id: number|string, record:{[key: string]:{value:unknown}}}[]} param.records 更新値
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{ids: [], revisions:[]}>} 更新結果
   */
  static async putAll({ records = [], app = kintone.app.getId(), tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__putAll(records, tokens);
  }

  /**
   * 一件削除
   * @param {object} param
   * @param {number|string} param.id 削除レコード
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{ids: [], revisions:[]}>} 更新結果
   */
  static async delete({ id, app = kintone.app.getId(), tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__delete(ids, tokens);
  }
  /**
   * 一括更新
   * @param {object} param
   * @param {(number|string)[]} param.ids 削除レコード 一覧
   * @param {number|undefined} param.app Kintone アプリID
   * @param {string|string[]|undefined} param.tokens 権限ないときの Kintoneアプリトークン
   * @returns {Promise<{ids: [], revisions:[]}>} 更新結果
   */
  static async deleteAll({ ids = [], app = kintone.app.getId(), tokens }) {
    return KintoneAPIClientHelper.of(app, tokens).__deleteAll(ids, tokens);
  }

  /* private */
  /**
   * Kintone レコード 検索
   * @param {object} params Kintone API GETで実行する内容
   * @returns {Promise<{records: object[]}>|Promise<{record: object}|undefined>} 検索結果
   */
  async __get(params = {}) {
    // 入力補完
    const _params = { app: this.app, ...params };
    const query = _params.query ?? '';

    /* 実行内容別 に処理実行 */
    if (Object.hasOwn(_params, 'id'))
      return this.__getById(_params, this.tokens); // ID指定
    else if (query.includes('limit'))
      return this.__getAll(_params, this.tokens); // 上限指定
    else return this.__getBulkAll(_params, this.tokens); // その他: 上限指定なし → 全件取得
  }

  /**
   * Kintone レコード 検索 by PK
   * @param {object} params
   * @param {number} params.app 対象アプリ
   * @param {number|string} params.id 対象レコード
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   * @returns {Promise<{record:{[key: string]:{value:unknown}}}>} 検索結果
   */
  async __getById(params, tokens) {
    try {
      return new Promise((resolve, reject) => {
        // レコード取得
        kintone.api(
          kintone.api.url('/k/v1/record.json', true),
          'GET',
          params,
          (response) => resolve(response), // 成功時
          // 失敗時 →　アプリトークン指定して実行
          async (error) => {
            if (tokens) {
              // kintone.proxyにて通信
              const _tokens = Array.isArray(tokens) ? tokens : [tokens]; // 補完
              const baseURI = kintone.api
                .url('/k/v1/record.json', true)
                .replaceAll('.s.', '.'); // Base URI = クライアント証明書でないcybozu URL
              const headers = { 'X-Cybozu-API-Token': _tokens.join(',') }; // リクエストヘッダー = APIトークン指定
              const url = `${baseURI}?${new URLSearchParams(params)}`; // 通信API

              // 通信実行
              const response = await kintone.proxy(url, 'GET', headers, {});
              resolve(
                response && response.length
                  ? JSON.parse(response[0])
                  : { record: {} }
              );
            } else {
              reject(error);
            }
          }
        );
      });
    } catch (e) {
      console.error('API Error "__getById"', e);
      throw e;
    }
  }

  /**
   * 一覧取得
   * @param {object} params
   * @param {number} params.app 対象アプリ
   * @param {string|undefined} params.query 検索条件
   * @param {string[]|undefined} params.fields 取得するフィールド
   * @param {boolean|undefined} params.totalCount 取得件数
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   * @returns {Promise<{records:{[key: string]:{value:unknown}}[]; totalCount: string|number|null}>} 検索結果
   */
  async __getAll(params, tokens) {
    try {
      return new Promise((resolve, reject) => {
        // 検索API by PK指定
        kintone.api(
          kintone.api.url('/k/v1/records.json', true),
          'GET',
          params,
          (response) => resolve(response), // 成功時
          // 失敗時 →　アプリトークン指定して実行
          async (error) => {
            if (tokens) {
              // kintone.proxyにて通信
              const _tokens = Array.isArray(tokens) ? tokens : [tokens]; // 補完
              const baseURI = kintone.api
                .url('/k/v1/records.json', true)
                .replaceAll('.s.', '.'); // Base URI = クライアント証明書でないcybozu URL
              const headers = { 'X-Cybozu-API-Token': _tokens.join(',') }; // リクエストヘッダー = APIトークン指定
              const url = `${baseURI}?${new URLSearchParams(params)}`; // 通信API

              // 通信実行
              const response = await kintone.proxy(url, 'GET', headers, {});
              resolve(
                response && response.length
                  ? JSON.parse(response[0])
                  : { records: [], totalCount: null }
              );
            } else {
              reject(error);
            }
          }
        );
      });
    } catch (e) {
      console.error('API Error "__getAllByLimit"', e);
      throw e;
    }
  }

  /**
   * 一括 一覧取得
   * @param {object} params
   * @param {number} params.app 対象アプリ
   * @param {string|undefined} params.query 検索条件
   * @param {string[]|undefined} params.fields 取得するフィールド
   * @param {boolean|undefined} params.totalCount 取得件数
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   * @returns {Promise<{records:{[key: string]:{value:unknown}}[]; totalCount: string|number|null}>} 検索結果
   */
  async __getBulkAll(params, tokens) {
    /* 入力補完 */
    // 入力値 検索クエリ
    const _query = Object.hasOwn(response, 'query') ? params.query : '';
    // 検索クエリ (order by, limit デフォルト指定)
    const query = [
      _query,
      _query.includes('order by') ? '' : 'order by $id desc', // order by デフォルト指定
      _query.includes('limit') ? '' : 'limit 500', // limit デフォルト指定
    ]
      .filter((v) => v.length)
      .join(' ');

    /* 一括 一覧取得 */
    return new Promise(async (resolve, reject) => {
      try {
        // 取得結果
        const result = { records: [], totalCount: null };
        // 開始時点
        let offset = 0;

        // 全件取得するまで 繰り返し実行
        while (true) {
          // 通信内容 生成
          const _params = {
            ...params,
            query: `${query} ${
              query.includes('offset') ? '' : `offset ${offset}`
            }`, // 全件取得用
          };

          // 一覧取得 (offset 〜 limitまで)
          const response = await this.__getAll(_params, tokens);

          // レコードが存在しない場合は終了
          if (!response.records?.length) break;

          // 結果設定
          result.records.push(...response.records); // 全件レコード
          result.totalCount = result.records.length; // トータル件数

          // 次へ
          offset += 500;
        }

        // 全件取得 完了
        return result;
      } catch (e) {
        console.error('API Error "__getBulkAll"', e);
        reject(e);
      }
    });
  }

  /**
   * 登録
   * @param {{[key: string]:{value:unknown}}} record 登録値
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   * @returns {Promise<{id:string, revision:string}>} 登録結果
   */
  async __post(record, tokens) {
    try {
      // overlaod
      const { ids = [], revisions = [] } = await this.__postAll(
        [record],
        tokens
      );
      // 結果1件
      return { id: ids[0], revision: revisions[0] };
    } catch (e) {
      console.error('API Error "__post"', e);
      throw e;
    }
  }

  /**
   * 一括登録
   * @param {{[key: string]:{value:unknown}}[]} records 登録値
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   * @returns {Promise<{ids: [], revisions:[]}>} 登録結果
   */
  async __postAll(records, tokens) {
    try {
      // 結果格納用配列
      const result = { ids: [], revisions: [] };

      // 100件ずつ 一括登録実施
      for (let i = 0; i < records.length; i += 100) {
        // 一回の 一括登録 リクエストボデイ
        const body = {
          app: this.app,
          records: records.slice(i, i + 100),
        };

        // Kintone API 一括登録実行
        const _result = new Promise((resolve, reject) => {
          kintone.api(
            kintone.api.url('/k/v1/records.json', true), // 通信先
            'POST', // メソッド
            body, // リクエストボディ
            (response) => resolve(response), // 成功時
            // 失敗時 →　アプリトークン指定して実行
            async (error) => {
              if (tokens) {
                // kintone.proxyにて通信
                const _tokens = Array.isArray(tokens) ? tokens : [tokens]; // 補完
                const headers = {
                  'X-Cybozu-API-Token': _tokens.join(','),
                  'Content-Type': 'application/json',
                }; // リクエストヘッダー
                const url = kintone.api
                  .url('/k/v1/records.json', true)
                  .replaceAll('.s.', '.'); // 通信API = クライアント証明書でないcybozu URL

                // 通信実行
                const response = await kintone.proxy(
                  url,
                  'POST',
                  headers,
                  body
                );
                resolve(
                  response && response.length
                    ? JSON.parse(response[0])
                    : { ids: [], revisions: [] }
                );
              } else {
                reject(error);
              }
            }
          );
        });

        // 一括登録結果に設定
        const response = await _result;
        result.ids.push(response.ids);
        result.revisions.push(response.revisions);
      }
      return result;
    } catch (e) {
      console.error('API Error "__postAll"', e);
      throw e;
    }
  }

  /**
   * 更新
   * @param {number|string} id レコード
   * @param {{[key: string]:{value:unknown}}} record 更新値
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   * @returns {Promise<{revision:string}>} 登録結果
   */
  async __put(id, record, tokens) {
    try {
      // overlaod
      const records = await this.__postAll([record], tokens);
      // 結果1件
      return { revision: records[0].revision };
    } catch (e) {
      console.error('API Error "__put"', e);
      throw e;
    }
  }

  /**
   * 一括更新
   * @param {{id: number|string, record:{[key: string]:{value:unknown}}}[]} records 更新値
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   * @returns {Promise<{id:number|string, revisions:string, operation:string}[]>} 更新結果
   */
  async __putAll(records, tokens) {
    try {
      // 結果格納用配列
      const result = [];

      // 100件ずつ 一括更新実施
      for (let i = 0; i < records.length; i += 100) {
        // 一回の 一括更新 リクエストボデイ
        const body = {
          app: this.app,
          records: records.slice(i, i + 100),
        };

        // Kintone API 一括更新実行
        const _result = new Promise((resolve, reject) => {
          kintone.api(
            kintone.api.url('/k/v1/records.json', true), // 通信先
            'PUT', // メソッド
            body, // リクエストボディ
            (response) => resolve(response), // 成功時
            // 失敗時 →　アプリトークン指定して実行
            async (error) => {
              if (tokens) {
                // kintone.proxyにて通信
                const _tokens = Array.isArray(tokens) ? tokens : [tokens]; // 補完
                const headers = {
                  'X-Cybozu-API-Token': _tokens.join(','),
                  'Content-Type': 'application/json',
                }; // リクエストヘッダー
                const url = kintone.api
                  .url('/k/v1/records.json', true)
                  .replaceAll('.s.', '.'); // 通信API = クライアント証明書でないcybozu URL

                // 通信実行
                const response = await kintone.proxy(url, 'PUT', headers, body);
                resolve(
                  response && response.length ? JSON.parse(response[0]) : []
                );
              } else {
                reject(error);
              }
            }
          );
        });

        // 一括更新結果に設定
        const response = await _result;
        result.push(response);
      }
      return result;
    } catch (e) {
      console.error('API Error "__putAll"', e);
      throw e;
    }
  }
  /**
   * 削除
   * @param {number|string} id 削除レコード
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   */
  async __delete(id, tokens) {
    try {
      // 削除実行
      await this.__deleteAll([id], tokens);
    } catch (e) {
      console.error('API Error "__delete"', e);
      throw e;
    }
  }
  /**
   * 一括削除
   * @param {(number|string)[]} ids 削除レコード一覧
   * @param {string|string[]|undefined} tokens 権限ないときの アプリトークン
   */
  async __deleteAll(ids, tokens) {
    try {
      // 削除タスク一覧
      const tasks = [];

      // 100件ずつ 一括更新実施
      for (let i = 0; i < ids.length; i += 100) {
        // 一回の 一括削除 リクエストボデイ
        const body = {
          app: this.app,
          ids: ids.slice(i, i + 100),
        };

        // Kintone API 一括削除 API登録
        const deleteTask = new Promise((resolve, reject) => {
          kintone.api(
            kintone.api.url('/k/v1/records.json', true), // 通信先
            'DELETE', // メソッド
            body, // リクエストボディ
            (response) => resolve(response), // 成功時
            // 失敗時 →　アプリトークン指定して実行
            async (error) => {
              if (tokens) {
                // kintone.proxyにて通信
                const _tokens = Array.isArray(tokens) ? tokens : [tokens]; // 補完
                const headers = {
                  'X-Cybozu-API-Token': _tokens.join(','),
                  'Content-Type': 'application/json',
                }; // リクエストヘッダー
                const url = kintone.api
                  .url('/k/v1/records.json', true)
                  .replaceAll('.s.', '.'); // 通信API = クライアント証明書でないcybozu URL

                // 通信実行
                const response = await kintone.proxy(
                  url,
                  'DELETE',
                  headers,
                  body
                );
                const result = response?.[0] ? JSON.parse(response[0]) : {};
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
        });

        tasks.push(deleteTask);
      }

      await Promise.all(tasks);
      return true;
    } catch (e) {
      console.error('API Error "__deleteAll"', e);
      throw e;
    }
  }
}
