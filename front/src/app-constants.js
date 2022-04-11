/* eslint-disable max-len */
export const API_HOST = process.env.REACT_APP_API_HOST;
export const WS_API_HOST = process.env.REACT_APP_WS_API_HOST;

export const BLANKS_BUCKET_URL = process.env.REACT_APP_BLANKS_BUCKET_URL;

export const CHAT_SCRIPT = `
  window.__lc = window.__lc || {};
  window.__lc.license = 13165182;
  ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
`;
export const DOC_TEMPLATES_HR_FOLDER_URL = 'https://drive.google.com/drive/folders/1JUAgav6j6CStOn89UIjTPaMuR4dcO64v';
export const CONTRACT_OFFER_FOLDER_URL = 'https://drive.google.com/drive/folders/1kEAOwhQu_D9I0-FplJzf6d9pjRQzdFj6?usp=sharing';
export const MANUAL_PATH = '/pdf';

export const DEFAULT_AVATAR_URL = '/default-user-avatar.svg';

export const NEW_DOC_ID = 'new';

export const txtOperationDescriptions = {
  between: 'Між',
  contains: 'Містить',
  endsWith: 'Закінчується на',
  equal: 'Рівно',
  greaterThan: 'Більше',
  greaterThanOrEqual: 'Більше або рівно',
  lessThan: 'Менше',
  lessThanOrEqual: 'Менше або рівно',
  notContains: 'Не містить',
  notEqual: 'Не рівно',
  startsWith: 'Починається з',
};
export const resetOperationText = '... всі записи ...';

export const uaFilterRowText = {
  operationDescriptions: txtOperationDescriptions,
  resetOperationText,
  showAllText: '',
  betweenStartText: 'початок',
  betweenEndText: 'кінець',
};

export const DX_DATETIME_DISPLAY_FORMAT = 'dd-MM-yyyy HH:mm:ss';
export const DX_DATE_DISPLAY_FORMAT = 'dd-MM-yyyy';
export const DX_DATE_SERIALIZATION_FORMAT = 'yyyy-MM-ddTHH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const DATE_DISPLAY_FORMAT = 'DD-MM-YYYY HH:mm:ss';


export const docStatuses = {
  PREPARED: { status: 0, statusText: 'Підготовлений' },
  APPROVED: { status: 1, statusText: 'Затверджений' },
  DEFERRED: { status: 2, statusText: 'Відкладений' },
  REJECTED: { status: 3, statusText: 'Відхилений' },
  AGREED: { status: 4, statusText: 'Узгоджений' },
};

export const diiaStatuses = {
  VERIFIED: { status: 'Проверен', statusText: 'Перевірений' },
  DELIVERED: { status: 'Доставлен', statusText: 'Доставлений' },
  INVALID: { status: 'Недействителен', statusText: 'Недійсний' },
  CANCELED: { status: 'Аннулирован', statusText: 'Анульований' },
  SUBMITTED: { status: 'Отправлен', statusText: 'Відправлений' },
  NOT_ADOPTED: { status: 'НеПринят', statusText: 'Не прийнятий' },
};

export const partnerTypes = {
  LEGAL: 'ЮрЛицо',
  INDIVIDUAL: 'ФизЛицо',
};

export const manuals = {
  general: {
    text: 'Загальне',
    path: `${MANUAL_PATH}/manual.pdf`,
  },
  blanks_order: {
    text: 'Замовлення бланкiв',
    path: `${MANUAL_PATH}/blanks_order.pdf`,
  },
  price_order: {
    text: 'Замовлення ціни',
    path: `${MANUAL_PATH}/price_order.pdf`,
  },
};


// devextreme ignores css width
export const COLUMN_DATE_WIDTH = 145;
export const COLUMN_DOCNUMBER_WIDTH = 130;
export const COLUMN_PRICE_WIDTH = 120;
export const COLUMN_PARTNER_MINWIDTH = 120;
export const COLUMN_PARTNER_WIDTH = '20%';
export const COLUMN_NOTE_MINWIDTH = 100;
export const COLUMN_EDIT_WIDTH = 45;
export const COLUMN_EP_TYPE = 110;
export const COLUMN_EP_VIN = 160;
export const COLUMN_EP_CAR_NUMBER = 100;
export const COLUMN_NOM_MINWIDTH = 120;

export const FORM_STYLING_MODE = 'outlined';

export const roles = {
  STAGE_LAB: 'stage_lab',
  ADMIN: 'admin',
};

export const DOCLIST_PAGE_SIZE = 100;

export const DEFAULT_DATE_VALUE = '0001-01-01T00:00:00';

export const DEFAULT_PROJ_PNAME = 'отк';

export const maxFileSize2MB = 2000000;
export const maxFileSize1MB = 1000000;

export const LOGIN_TIMESTAMP_KEY = 'LOGIN_TIMESTAMP';

export const NULL_UUID = '00000000-0000-0000-0000-000000000000';
