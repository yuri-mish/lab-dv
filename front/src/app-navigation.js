import { DOC_TEMPLATES_HR_FOLDER_URL, roles } from './app-constants';

export const navigation = [
  {
    text: 'Головна',
    path: '/dashboard',
    icon: 'home',
  },
  {
    text: 'Замовлення',
    path: '/orders',
    icon: 'car',
    notification: 'newOrdersCount',
  },
  {
    text: 'Акти',
    path: '/acts',
    icon: 'check',
  },
  {
    text: 'Електронні протоколи',
    icon: 'box',
    path: '/ep',
  },
  {
    text: 'Звіти лабораторії',
    path: '/lab_reports',
    icon: 'verticalalignbottom',
    notification: 'reportsWithErrorCount',
  },
  {
    text: 'Сервіси',
    icon: 'folder',
    items: [
      {
        text: 'Замовлення бланкiв',
        path: '/form_orders',
      },
      {
        text: 'Замовлення знижки',
        path: '/price_orders',
      },
      // {
      //   text: 'Продаж СП',
      //   path: '/policy',
      // },
    ],
  },
  {
    text: 'Довідка',
    icon: 'tips',
    path: '/manuals-moc',
  },
  {
    text: 'Імпорт даних авто',
    icon: 'import',
    path: '/import-cars',
    roles: [ roles.ADMIN ],
  },
  {
    text: 'Шаблони документів',
    icon: 'doc',
    items: [
      {
        text: 'Відділ кадрів',
        path: DOC_TEMPLATES_HR_FOLDER_URL,
        isLink: true,
      },
    ],
  },
  {
    text: 'Договір оферти',
    icon: 'doc',
    path: '/oferta',
  },
];
