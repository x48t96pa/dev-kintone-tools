/* 親クラス */
export default abstract class MyCommand {
    /* コマンド実行 */
    abstract run(): Promise<void>;
}