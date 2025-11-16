/*************************************************
 * Kintoneカスタマイズ サンプル
 *************************************************/
/* import config */
import { KINTONE_APP } from '@/shared/config/kintone';
/* import usecase */
import IndexHandler from './usecases/IndexHandler';
/* import lodash */
import { isEmpty } from 'lodash';

/** レコード 一覧 */
kintone.events.on(KINTONE_APP.events.index, (event) => {
    // on submit
    IndexHandler.run(event);
    if (!isEmpty(event.error ?? '')) return event;

    // 処理終了(Kintoneの決まり事 返却必須)
    return event;
});
