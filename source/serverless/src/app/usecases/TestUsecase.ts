/* import Repository */
import { TestRepository } from '@/app/repositories/kintone';

/**
 *  @class 接続テストなど サンプル ユースケースクラス
 */
export default class TestUsecase {
    private readonly repository: TestRepository;

    /** コンストラクタ */
    constructor() {
        this.repository = new TestRepository();
    }

    /**
     * @returns サンプル 一覧 取得
     */
    public async getTest() { return this.repository.findAll(); }
}
