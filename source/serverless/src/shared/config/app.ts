/* アプリケーション 設定値 */
export const APP_ENV = process.env.APP_ENV;
export const isLocal = APP_ENV === 'dev';
export const isProduction = APP_ENV === 'prd';
