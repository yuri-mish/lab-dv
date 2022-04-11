const health_stringified = 'Двісті шістдесят тисяч грн';
const property_stringified = 'Сто тридцять тисяч грн';
const label_1 = 'Пряме врегулювання';
const label_2 = 'Підтримка 24/7 при ДТП';
export const companies_offers = [
  {
    name: 'ОРАНТА',
    fullname: `ПУБЛІЧНЕ АКЦІОНЕРНЕ ТОВАРИСТВО
       «НАЦІОНАЛЬНА АКЦІОНЕРНА СТРАХОВА КОМПАНІЯ «ОРАНТА»`,
    code: 'oranta',
    mtsbu_id: 3,
    description: `<p>НАСК «ОРАНТА» - &nbsp;надійна та стабільна страхова
      компанія, яка має активні ділові й партнерські зв'язки, орієнтована
      на динамічний розвиток та миттєве вирішення потреб клієнтів. Нам довіряють
       понад 2 млн. клієнтів.</p>`,
    site: 'https://oranta.ua/',
    rate: 5,
    address: '02081, м.Київ, вул. Здолбунівська, 7-Д',
    phones: [
      {
        phone: '+380 44 537 58 01',
      },
      {
        phone: '+380 44 537 58 99',
      },
    ],
    egrpou: null,
    image: {
      id: 13,
      disk_name: '6006ef8e80171304313176.png',
      file_name: 'logo-3-oranta3x.png',
      file_size: 1915,
      content_type: 'image/png',
      title: null,
      description: null,
      field: 'image',
      sort_order: 13,
      created_at: '2021-01-19 16:41:18',
      updated_at: '2021-01-19 16:41:21',
      field_type: 'fileupload',
      path: 'https://test.xsurance.com.ua/storage/app/uploads/public/600/6ef/' +
      '8e8/6006ef8e80171304313176.png',
      extension: 'png',
    },
    tariffs: [
      {
        franchise: 0,
        price: 1808,
      },
      {
        franchise: 1500,
        price: 1487,
      },
      {
        franchise: 2500,
        price: 1368,
      },
    ],
    additional_options: null,
    insured_sums: {
      numeric: {
        health: '260000',
        property: '130000',
      },
      string: {
        health_stringified,
        property_stringified,
      },
    },
    dgo: [],
  },
  {
    name: 'Європейський страховий альянс',
    fullname: 'Приватне акціонерне товариство "Європейський страховий альянс"',
    code: 'eia',
    mtsbu_id: 89,
    description: `<p>Надійна страхова компанія з високим рейтингом фінансової
      стійкості.</p>`,
    site: 'https://eia.com.ua/',
    rate: 4,
    address: 'м. Київ, вул. Ямська, 28а',
    phones: [
      {
        phone: '+380 44 351 24 10',
      },
      {
        phone: '+380 44 351 24 20',
      },
    ],
    egrpou: null,
    image: {
      id: 12,
      disk_name: '6006ee586b255530994875.png',
      file_name: 'logo-89-eia3x.png',
      file_size: 1750,
      content_type: 'image/png',
      title: null,
      description: null,
      field: 'image',
      sort_order: 12,
      created_at: '2021-01-19 16:36:08',
      updated_at: '2021-01-19 16:36:11',
      field_type: 'fileupload',
      path: 'https://test.xsurance.com.ua/storage/app/uploads/public/600/6ee/' +
        '586/6006ee586b255530994875.png',
      extension: 'png',
    },
    tariffs: [
      {
        franchise: 0,
        price: 1641.4,
      },
      {
        franchise: 1500,
        price: 1439.2,
      },
      {
        franchise: 2500,
        price: 1356,
      },
    ],
    additional_options: [
      {
        code: 'direct_settlement',
        label: label_1,
      },
      {
        code: 'accident_support_24_7',
        label: label_2,
      },
      {
        code: 'free_lawyer_consultation_accident',
        label: 'Безкоштовна консультація адвоката у разі ДТП ',
      },
    ],
    insured_sums: {
      numeric: {
        health: '260000',
        property: '130000',
      },
      string: {
        health_stringified,
        property_stringified,
      },
    },
    dgo: [],
  },
  {
    name: 'АСКО ДС',
    fullname: `Приватне акціонерне товариство
      «Страхова компанія АСКО-Донбас Північний»`,
    code: 'askods',
    mtsbu_id: 28,
    description: `<p>Лідер зі швидкості врегулювання страхових випадків
       за договорами ОСЦПВ, більше 30 років на ринку України.</p>`,
    site: 'https://askods.com/',
    rate: 5,
    address: 'вул. Соборна ,37, м. Дружківка, Донецька обл, 84205',
    phones: [
      {
        phone: '+380 6267 4 43 41',
      },
    ],
    egrpou: null,
    image: {
      id: 11,
      disk_name: '6006c9c4be8a1285811453.png',
      file_name: 'logo-28-askods3x.png',
      file_size: 2679,
      content_type: 'image/png',
      title: null,
      description: null,
      field: 'image',
      sort_order: 11,
      created_at: '2021-01-19 14:00:04',
      updated_at: '2021-01-19 14:00:10',
      field_type: 'fileupload',
      path: 'https://test.xsurance.com.ua/storage/app/uploads/public/600/6c9/' +
      'c4b/6006c9c4be8a1285811453.png',
      extension: 'png',
    },
    tariffs: [
      {
        franchise: 0,
        price: 1772,
      },
      {
        franchise: 1500,
        price: 1546,
      },
      {
        franchise: 2500,
        price: 1404,
      },
    ],
    additional_options: [
      {
        code: 'direct_settlement',
        label: label_1,
      },
      {
        code: 'accident_support_24_7',
        label: label_2,
      },
    ],
    insured_sums: {
      numeric: {
        health: '260000',
        property: '130000',
      },
      string: {
        health_stringified,
        property_stringified,
      },
    },
    dgo: [],
  },
  {
    name: 'АСКА',
    fullname: `Приватне акціонерне товариство
      «Українська акціонерна страхова компанія АСКА»`,
    code: 'aska',
    mtsbu_id: 4,
    description: `<p>Перша приватна страхова компанія, що з'явилася у
     незалежній Україні і працює вже 30 років. &nbsp;Входить до складу
      SCM<strong><a href="https://www.scm.com.cy/uk/" rel="nofollow noopener" target="_blank"></a>&nbsp;</strong>- однієї з
       найпотужніших фінансово-промислових компаній України.</p>`,
    site: 'https://aska.ua/',
    rate: 3,
    address: '69005, м. Запоріжжя, вул. Перемоги, 97-А',
    phones: [
      {
        phone: '+380 44 520 22 04',
      },
    ],
    egrpou: null,
    image: {
      id: 10,
      disk_name: '6006c46f1057c057414868.png',
      file_name: 'logo-4-aska3x.png',
      file_size: 2720,
      content_type: 'image/png',
      title: null,
      description: null,
      field: 'image',
      sort_order: 10,
      created_at: '2021-01-19 13:37:19',
      updated_at: '2021-01-19 13:37:22',
      field_type: 'fileupload',
      path: 'https://test.xsurance.com.ua/storage/app/uploads/public/600/6c4/' +
        '6f1/6006c46f1057c057414868.png',
      extension: 'png',
    },
    tariffs: [
      {
        franchise: 0,
        price: 1531,
      },
      {
        franchise: 1500,
        price: 1257,
      },
      {
        franchise: 2500,
        price: 1138,
      },
    ],
    additional_options: [
      {
        code: 'payment_without_cert_less_50000',
        label: 'Виплати без довідки з поліції до 50000 грн.',
      },
      {
        code: 'accident_support_24_7',
        label: label_2,
      },
    ],
    insured_sums: {
      numeric: {
        health: '260000',
        property: '130000',
      },
      string: {
        health_stringified,
        property_stringified,
      },
    },
    dgo: [],
  },
  {
    name: 'КРЕДО',
    fullname: `Товариство з додатковою відповідальністю
       "Страхова компанія "Кредо"`,
    code: 'credo',
    mtsbu_id: 120,
    description: `<p>Майже 30 років успішної діяльності на ринку України.
      Компаній займає лідируючі позиції за кількість проданих полісів
      страхування ОСЦПВ.</p>`,
    site: 'http://skcredo.com.ua',
    rate: 5,
    address: 'м. Запоріжжя, пр. Моторобудівників, 34',
    phones: [
      {
        phone: '+380 61 289 90 63',
      },
      {
        phone: '+380 61 289 90 66',
      },
    ],
    egrpou: null,
    image: {
      id: 50,
      disk_name: '603e4c55e6af9031663193.png',
      file_name: 'logo-120-credo3x.png',
      file_size: 1159,
      content_type: 'image/png',
      title: null,
      description: null,
      field: 'image',
      sort_order: 50,
      created_at: '2021-03-02 16:31:49',
      updated_at: '2021-03-02 16:32:17',
      field_type: 'fileupload',
      path: 'https://test.xsurance.com.ua/storage/app/uploads/public/603/e4c/' +
        '55e/603e4c55e6af9031663193.png',
      extension: 'png',
    },
    tariffs: [
      {
        franchise: 0,
        price: 1531,
      },
      {
        franchise: 1500,
        price: 1349,
      },
      {
        franchise: 2500,
        price: 1135,
      },
    ],
    additional_options: [
      {
        code: 'direct_settlement',
        label: label_1,
      },
      {
        code: 'accident_support_24_7',
        label: label_2,
      },
    ],
    insured_sums: {
      numeric: {
        health: '260000',
        property: '130000',
      },
      string: {
        health_stringified,
        property_stringified,
      },
    },
    dgo: [],
  },
];
export const privileges = [
  {
    name: 'Без пільг',
    code: 'without',
    documents: [
      {
        name: 'Паспорт',
        code: 'passport',
        fields: [
          'document_series',
          'document_number',
          'document_issue_date',
          'document_issued',
        ],
      },
      {
        name: 'ID карка',
        code: 'id_card',
        fields: [
          'document_number',
          'document_issue_date',
          'document_issued',
        ],
      },
      {
        name: 'Водійське посвідчення',
        code: 'driver_license',
        fields: null,
      },
    ],
  },
  {
    name: 'Учасники війни',
    code: 'war_participant',
    documents: [
      {
        name: 'Посвiдчення учасника вiйни',
        code: 'war_participant',
        fields: [
          'document_series',
          'document_number',
          'document_issue_date',
          'document_issued',
        ],
      },
    ],
  },
  {
    name: 'Особа з інвалідністю ІІ групи',
    code: 'invalid',
    documents: [
      {
        name: 'Посвiдчення особи з iнвалiдністю ІІ групи',
        code: 'invalid',
        fields: [
          'document_series',
          'document_number',
          'document_issue_date',
          'document_issued',
        ],
      },
    ],
  },
  {
    name: `Особа, яка постраждала внаслідок Чорнобильської катастрофи,
       віднесена до I або II категорії`,
    code: 'chernobyl_victim',
    documents: [
      {
        name: 'Посвiдчення особи постраждалої від ЧАЭС',
        code: 'chernobyl_victim',
        fields: [
          'document_series',
          'document_number',
          'document_issue_date',
          'document_issued',
        ],
      },
    ],
  },
  {
    name: 'Пенсіонери громадяни України',
    code: 'pensioner',
    documents: [
      {
        name: 'Посвідчення пенсійне',
        code: 'pensioner',
        fields: [
          'document_series',
          'document_number',
          'document_issue_date',
          'document_issued',
        ],
      },
    ],
  },
];

export const mockVehicle = {
  title: 'VOLKSWAGEN  GOLF GOLF',
  vin: 'TESTVINCODEDATA',
  plate_num: 'АА0825РК',
  mark: {
    name: 'VOLKSWAGEN  GOLF',
  },
  model: {
    name: 'GOLF',
  },
  type: 'B2',
  koatuu: '8036100000',
  year: '2011',
};
export const mockVehicleCitiesSearch = {
  current_page: 1,
  data: [
    {
      id: '6810400000',
      name: 'Кам\'янець-Подільський',
      fullname: 'м. Кам\'янець-Подільський, Хмельницька обл.',
      stringified: 'м. Кам\'янець-Подільський',
    },
    {
      id: '6810500000',
      name: 'Нетішин',
      fullname: 'м. Нетішин, Хмельницька обл.',
      stringified: 'м. Нетішин',
    },
    {
      id: '3211000000',
      name: 'Переяслав-Хмельницький',
      fullname: 'м. Переяслав-Хмельницький, Київська обл.',
      stringified: 'м. Переяслав-Хмельницький',
    },
    {
      id: '6810600000',
      name: 'Славута',
      fullname: 'м. Славута, Хмельницька обл.',
      stringified: 'м. Славута',
    },
    {
      id: '6810800000',
      name: 'Старокостянтинів',
      fullname: 'м. Старокостянтинів, Хмельницька обл.',
      stringified: 'м. Старокостянтинів',
    },
    {
      id: '6810100000',
      name: 'Хмельницький',
      fullname: 'м. Хмельницький, Хмельницька обл.',
      stringified: 'м. Хмельницький',
    },
    {
      id: '6810700000',
      name: 'Шепетівка',
      fullname: 'м. Шепетівка, Хмельницька обл.',
      stringified: 'м. Шепетівка',
    },
    {
      id: '6820910100',
      name: 'Волочиськ',
      fullname: 'м. Волочиськ, Волочиський р-н, Хмельницька обл.',
      stringified: 'м. Волочиськ',
    },
    {
      id: '6821210100',
      name: 'Городок',
      fullname: 'м. Городок, Городоцький р-н, Хмельницька обл.',
      stringified: 'м. Городок',
    },
    {
      id: '6821510100',
      name: 'Деражня',
      fullname: 'м. Деражня, Деражнянський р-н, Хмельницька обл.',
      stringified: 'м. Деражня',
    },
  ],
  first_page_url: 'http://test.xsurance.com.ua/api/v1/mtpli/get-vehicle-cities/search?page=1',
  from: 1,
  last_page: 154,
  last_page_url: 'http://test.xsurance.com.ua/api/v1/mtpli/get-vehicle-cities/search?page=154',
  next_page_url: 'http://test.xsurance.com.ua/api/v1/mtpli/get-vehicle-cities/search?page=2',
  path: 'http://test.xsurance.com.ua/api/v1/mtpli/get-vehicle-cities/search',
  per_page: 10,
  prev_page_url: null,
  to: 10,
  total: 1537,
};
export const mockVehicleTypesList = [
  {
    name: 'менше 300 см3',
    code: 'A1',
  },
  {
    name: 'більше 300 см3',
    code: 'A2',
  },
  {
    name: 'до 1600 см3',
    code: 'B1',
  },
  {
    name: '1601 - 2000 см3',
    code: 'B2',
  },
  {
    name: '2001 - 3000 см3',
    code: 'B3',
  },
  {
    name: 'понад 3000 см3',
    code: 'B4',
  },
  {
    name: 'електромобіль (з силовим електродвигуном, окрім гібридних авто)',
    code: 'B5',
  },
  {
    name: 'менше 2-х тонн',
    code: 'C1',
  },
  {
    name: 'більше 2-х тонн',
    code: 'C2',
  },
  {
    name: 'менше 20 чоловік',
    code: 'D1',
  },
  {
    name: 'більше 20 чоловік',
    code: 'D2',
  },
  {
    name: 'до легкового автомобіля',
    code: 'F',
  },
  {
    name: 'до вантажного автомобіля',
    code: 'E',
  },
];
