import { docStatuses } from 'app-constants';

export const DOC_CLOSE_PERIOD = 1;
export const MIN_PERIOD = 0;
export const CLASS_NAME = 'doc.priceorder';

export const priceOrderTypes = [ 'Процент', 'Цена' ];
export const priceOrderTypeNameByType = {
  Цена: 'Цiна',
  Процент: 'Процент',
};

export const mapDocStatusesToTypes = {
  [docStatuses.AGREED.status]: 'processing',
  [docStatuses.REJECTED.status]: 'error',
  [docStatuses.APPROVED.status]: 'success',
  [docStatuses.DEFERRED.status]: 'pending',
};

