import { defineConfig } from 'vite';
import { resolve } from 'path';

// カスタマイズJavascript ファイルビルド用
export default defineConfig(() => {
    // 環境変数から ビルド対象を取得
    const app = process.env.TARGET_APP;
    return {
        // js内の import エイリアス用
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
        // ビルド
        build: {
            // 出力ディレクトリ
            outDir: './dist',
            emptyOutDir: true,
            // library 化タスク
            lib: {
                entry: resolve(__dirname, `./src/apps/${app}/index.js`), // ビルド対象 エントリーポイント
                name: `${app}`,
                fileName: `customize_${app}`, // outputファイル名
                formats: ['iife'], // 即時実行関数
            },
        }
    };
});