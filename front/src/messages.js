export const docValidationMsg = (msg) => `Помилка: ${msg}\r\n`;
export const docRowValidationMsg = (msg, idx) => (
  `Помилка: (рядок №${idx}) - ${msg}\r\n`
);
export const docBackValidationMsg = (msg) => `Помилка запису: ${msg}`;

export const joinMsgs = (msgs) => msgs.join('\r\n');
export const joinBackValidationMsgs = (errors) => joinMsgs(errors
  .filter((err) => err?.message)
  .map((err) => docBackValidationMsg(err.message)),
);


export const messages = {
  PAGE_LOAD_FAILED: 'Помилка завантаження сторінки',
  PRICE_LOAD_FAILED: 'Помилка завантаження прайсів',
  DATA_LOAD_FAILED: 'Помилка отримання даних',
  PARTNER_LOAD_FAILED: 'Помилка завантаження контрагента',
  PARTNER_ALREADY_EXIST: 'Контрагент вже існує',
  PARTNER_DOES_NOT_EXIST: 'Контрагент не існує',
  PARTNER_REQUIRED: 'Не заповнено реквізит Контрагент',
  HAS_INVALID_FIELDS: 'Є невірно заповнені поля',
  WRONG_DOC_DATE: 'Період документу недозволен',
  WRONG_EDRPOU: 'Невірний ЕДРПОУ. Має бути 8 або 10 цифр',
  DOC_SAVED: 'Збережено',
  DOC_UPDATED: 'Документ оновлений',
  NOM_NO_PRICE: 'Номенклатура не має ціни',
  NOM_ALREADY_CHOOSEN: 'Така номенклатура вже додана',
  NOM_IS_EMPTY: 'Не заповнена послуга',
  ROW_NOT_SELECTED: 'Рядок не обрано',
  FILE_NOT_UPLOADED: 'Файл не завантажений',
  SERVER_OR_NETWORK_DOWN: 'Сервер не доступний',
  PAYMENT_FAILED: 'Помилка оплати',
};
