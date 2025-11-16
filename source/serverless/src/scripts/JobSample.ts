/* import Command */
import { default as Command } from '@/app/commands/JobSampleCommand';
/* import 定数 */
import { isLocal } from '@/shared/config/app';

/* コマンド実行 */
const main = async () => {
  try {
    console.log('START "JobSample"');
    // コマンド実行
    const result = await new Command().run();
    
    console.log('"JobSample" success.', result);
  } catch (error) {
    // TODO: 詳細なエラーハンドリング ミドルウェア
    throw error;
  } finally {
    console.log('END "JobSample"');
  }
}

// ローカル実行用
if (isLocal) main().then(() => console.log('command success')).catch((e) => console.error('command failed:', e));
/* export = lambdaに合わせ */
export const handler = main;