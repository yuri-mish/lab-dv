import { diiaStatuses } from 'app-constants';

export const mapDiiaStatusesToTypes = {
  [diiaStatuses.VERIFIED.status]: 'processing',
  [diiaStatuses.SUBMITTED.status]: 'processing',
  [diiaStatuses.DELIVERED.status]: 'success',
  [diiaStatuses.CANCELED.status]: 'error',
  [diiaStatuses.NOT_ADOPTED.status]: 'error',
};

export const paymentTypes = {
  CASH: 'Готівковий',
  CASHLESS: 'Безготівковий',
};

export const PRICES_VALIDATION_ERROR_MSG = 'Сума ≥ РП + РВ';
export const NOMS_VALIDATION_ERROR_MSG = 'Послуги немає в замовленні';
export const NO_ERRORS_DESCRIPTION_TEXT = 'Опис помилок відсутній';
