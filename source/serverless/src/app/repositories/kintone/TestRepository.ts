/* import 親 */
import KintoneAppRepository from './KintoneAppRepository';

// TODO: テスト Kintoneで開発したアプリ
export default class TestRepository extends KintoneAppRepository {
    // コンストラクタ
    constructor() {
        super(process.env.KINTONE_TEST_APP_ID ?? '', process.env.KINTONE_TEST_API_TOKEN);
    }
}