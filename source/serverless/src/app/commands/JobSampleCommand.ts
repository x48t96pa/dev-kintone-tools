/* import command */
import Command from '@/shared/core/MyCommand';
/* import usecase */
import Usecase from '@/app/usecases/TestUsecase';

/**
 * @class バッチサンプル
 */
export default class JobSampleCommand extends Command {
    /* 利用する ユースケース */
    private readonly usecase: Usecase;
    // コンストラクタ
    constructor() {
        // super
        super();
        this.usecase = new Usecase();
    }

    /**
     * コマンド 実行
     */
    async run(): Promise<void> {
        try {
            const result = await this.usecase.getTest();
            console.log('なんか処理とか ロギングとか', result);
        } catch (error) {
            throw error;
        }
    }
}