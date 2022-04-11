export const file_img_types = [ '.jpg', '.jpeg', '.bmp', '.png' ];
export const file_accept = 'image/*';
export const checkDate = '2009-04-01';
export const forDangerousText = 'Для перевезення небезпечних вантажів';
export const mockText = {
  confirm: `Після збереження як <b>"Чистовик"</b> - подальше редагування
  <b>НЕ МОЖЛИВЕ</b></br></br><b>Ви впевнені в цій дії?</b>`,
  line_1: 'Номер у реєстрації суб`єктів ОТК та номер дільниці:',
  line_city: 'Місце проведення:',
  line_type: 'Тип:',
  line_date: 'Дата створення:',
  line_order: 'Заказ №',
  line_EP: 'ЭП №',
  line_user:
    'Назва юридичної особи / прізвище, ім`я,' +
    ' по батькові фізичної особи  (зазначити потрібне).',
  line_user_to_print: 'Назва для друку:',

  auto: {
    vin: 'VIN',
    number: 'Державний реєстраційний номер',
    manufacture_date: 'Дата виготовлення',
    first_registration_date: 'Дата першої державної реєстрації',
    last_registration_date: 'Дата останньої державної реєстрації',
    category_KTZ: 'Категорія КТЗ',
    carrying: 'Вантажопідйомність (т.)',
    re_equipment_date: 'Дата переобладнання',
    re_equipment_doc_number: 'Номер документа переобладнення',
    re_equipment_name: 'Назва документа переобладнення',
    re_equipment_description: 'Суть переобладнання',
    car_brand: 'Марка',
    car_model: 'Модель',
    fuel_type: 'Паливо',
    car_color: 'Колір',
    odometer: 'Одометр (км)',
    preliminary_mileage: 'Попередній пробіг',
    turbine_compressor: 'Турбіна / Компрессор',
    cylinders: 'Кількість циліндрів',
    ecological: 'Екологічний рівень',
    purpose: 'Призначення:',
    for_taxi: 'Таксі Так/Ні',
    for_dangerous: forDangerousText,
    air_temperature: 'Температура в боксі, ℃',
    humidity: 'Вологість, %',
    atmospheric_pressure: 'Атмосферний тиск, кПа',
  },
  foto_technical_passport_1: 'Техпаспорт (1-сторона)',
  foto_technical_passport_2: 'Техпаспорт (2-сторона)',
  foto_auto_left: 'Авто (ліва сторона)',
  foto_auto_right: 'Авто (права сторона)',
  foto_auto_general: 'Авто (загальний вигляд спереду)',
  foto_auto: 'Авто (загальний вигляд)',
  foto_brake_stand: 'Гальмівний стенд',
  foto_odometr: 'Одометр',
  foto_vin: 'Hомер кузова',
  foto_check_res: 'Чек з результатами',
  foto_norms: 'Норми вихлопів',
  inspection: 'Перевірку провели',
  codes_mismatch: 'Коди невідповідносі',
  comments: 'Думки та тлумачення',
  conclusion: 'Висновок',
  draft_btn: 'Зберегти як чорновик',
  save_btn: 'Зберегти як чистовик',
};
export const car_color_list = [
  'чорний',
  'синій',
  'зелений',
  'бежевий',
  'червоний',
  'фіолетовий',
  'оранжевий',
  'жовтий',
  'білий',
  'коричневий',
  'сірий',
  'комбінований',
];
export const re_equipment_name_list = [
  'Техпаспорт',
  'Висновок',
];
export const purpose_list = [
  'Таксі',
  'Швидка медична допомога',
  'Автобус(шкільний)',
  'Автобус(для осіб з інвалідністю)',
  'Великогабаритний/Великоваговий',
  'Учбовий',
  forDangerousText,
];
export const conclusion_list = [
  { text: 'Відповідає', value: true },
  { text: 'Не відповідає', value: false },
];
export const inspectors_list = [
  { field: 'inspector_1', pos_placeholder: 'ТКД' },
  { field: 'inspector_2', pos_placeholder: 'ЗТКД' },
  { field: 'inspector_3', pos_placeholder: 'Посада' },
];
export const check_items_list = [
  {
    text: 'Загальні характеристики технічного стану ТЗ та його складників',
    field: 'general_characteristics',
  },
  { text: 'Шини та Колеса', field: 'tyres_wheels' },
  { text: 'Захисні пристрої', field: 'protective_devices' },
  { text: 'Стекла / Фари / Дзеркала / Склоочисник та склоомивач',
    field: 'windows_headlights' },
  { text: 'Двигун та його системи', field: 'engine_systems' },
  {
    text: 'Характеристики негативного впливу на навколишнє природне середовище',
    field: 'environmental_impact',
  },
  { text: 'Гальмові системи', field: 'braking_systems' },
  { text: 'Система керування', field: 'control_system' },
  { text: 'Інше обладнання', field: 'other_equipments' },
];
export const check_items_addition_list = [
  { text: 'Додаток-1', field: 'dodatok_1',
    activeFor: [ 'Автобус(шкільний)', 'Автобус(для осіб з інвалідністю)' ] },
  { text: 'Додаток-2', field: 'dodatok_2', activeFor: [ 'Таксі' ] },
  { text: 'Додаток-3', field: 'dodatok_3',
    activeFor: [ forDangerousText ] },
  { text: 'Додаток-4', field: 'dodatok_4', activeFor: [ 'Учбовий' ] },
  { text: 'Додаток-5', field: 'dodatok_5',
    activeFor: [ 'Швидка медична допомога' ] },
  { text: 'Додаток-6', field: 'dodatok_6',
    activeFor: [ 'Великогабаритний/Великоваговий' ] },
];
export const fuel_type_list = [
  'Бензин',
  'Дизель',
  'Газ',
  'Газ-Бензин',
  'Газ-Дизель',
  // 'Гибрид',
  'Електро',
  'Без топлива',
  'Газ та Електро',
  'Бензин, Газ або Електро',
  'Дизель або Газ',
  'Бензин або Газ',
  'Електро або Бензин',
  'Електро або Дизель',
];
export const turbine_compressor_list = [ 'Нет', 'Турбіна / Компрессор' ];
export const ecological_list = [
  'Нз',
  'Євро-0',
  'Євро-1',
  'Євро-2',
  'Євро-3',
  'Євро-4',
  'Євро-5',
  'Євро-6',
];

export const mockTahoText = {
  previous_tachograph_service: 'Пункт попередньої перевірки',
  tachograph_service: 'Найменування та місцезнаходження' +
    ' пункту сервісу тахографів',
  number_tachograph_service: 'Номер пункту Сервісу тахографів у переліку' +
    ' суб`єктів господарювання',
  workshop_card: 'Номер картки майстерні',
  carrier_partner: 'Перевізник:',
  authorized_person: 'Уповноважена особа',
  phone: 'Номер контактного телефона',
  tachograph_model: 'Марка / Модель',
  tachograph_type: 'Тип',
  reason_to_check: 'Підстава для перевірки та адаптації',
  checking_by_using: 'Перевірка та адаптація тахографа до транспортного ' +
    'засобу здійснюються за допомогою',
  tachograph_factory_number: 'Заводський номер',
  tachograph_maker: 'Виробник',
  tachograph_manufacture_date: 'Дата виготовлення',
  previous_check_date: 'Дата попередньої перевірки та адаптації',
  worker_position: 'Посада робітника',
  worker_name: 'Прізвище робітника',
  confirm: 'Підтверджую, що я',
  dont_have_claims: 'Претензій(ї) до виконаних робіт',
  letterhead_number:
    'Номер оригінального бланку, на якому друкується протокол',
  dont_passed: 'Не відповідає',
  deviation_time: {
    after_installation: 'Після установлення',
    in_exploitation: 'В експлуатації',
    speed_limiter: 'Фактичне значення спрацьовування обмежувача ' +
      'швидкості (за наявності обмежувача)',
    opening: 'Реєстрування факту відкриття кришки аналогового тахографа ' +
      '(виймання тахокарти)',
    power_off: 'Реєстрування факту вимкнення живлення на час, ' +
      'довший ніж 100 мс',
    pulse_sensor: 'Реєстрування факту перерви з’єднання давача ' +
      'імпульсів з тахографом',
  },
  checking_adaptation: {
    mileage_before: 'Пробіг до перевірки та адаптації',
    mileage_after: 'Пробіг після перевірки та адаптації',
    tires_size: 'Розмір пневматичних шин',
    tires_pressure: 'Тиск у пневматичних шинах',
    effective_length: 'Ефективна довжина кола пневматичних шин, l',
    coefficient: 'Характеристичний коефіцієнт транспортного засобу, w',
    tachograph_constant: 'Константа тахографа, k',
  },
};
export const tachograph_type_list = [
  'цифровий',
  'аналоговий',
  'смарт',
];
export const reason_to_check_list = [
  'періодична',
  'внепланова',
];

export const checking_by_using_list = [
  'ділянки дороги довжиною не менше ніж 1000 метрів',
  'стенду з біговими барабанами чи роликами',
  'пристрою аналогічного відтворення параметрів руху транспортного засобу із ' +
    'застосуванням   устаткування   для   автоматичного реєстрування часу, ' +
    'швидкості та  пройденої  ним  відстані,  який відповідає вимогам згідно ' +
    'з процедурою оцінки відповідності',
];
export const check_taho_list = [
  { text: 'Перевірка та адаптація', field: 'checking_adaptation' },
  { text: 'Відхилення реєстрування шляху', field: 'rejection_path' },
  { text: 'Відхилення реєстрування швидкості', field: 'registration_speed' },
  { text: 'Відхилення реєстрування часу', field: 'deviation_time' },
];
export const serviceability_test_list = [
  'особливо зеленого і безпечного',
  'ЄВРО-ІІІ безпечного',
  'ЄВРО-ІV безпечного',
  'ЄВРО-V безпечного',
  'EEV- безпечного',
  'ЄВРО-VІ безпечного',
];
export const mockEKMTtext = {
  certificate: 'Атестат акредитації',
  serviceability_test: 'Тест на придатність до експлуатації',
  contract_basis: 'Договір підстава',
};
export const check_list_KTZ = [
  'M1',
  'M2',
  'M3',
  'N1',
  'N2',
  'N3',
  'O1',
  'O2',
  'O3',
  'O4',
  'N1S',
  'N2S',
  'N3S',
  'M1S',
  'M2S',
  'M3S',
  'O1S',
  'O2S',
  'O3S',
  'O4S',
  'N1GS',
  'N2GS',
  'N3GS',
  'M1GS',
  'M2GS',
  'M3GS',
  'O1GS',
  'O2GS',
  'O3GS',
  'O4GS',
  'N1S',
  'N2S',
  'N3S',
  'М1S',
  'М2S',
  'М3S',
  'O1S',
  'O2S',
  'O3S',
  'O4S',
  'N1GS',
  'N2GS',
  'N3GS',
  'М1GS',
  'М2GS',
  'М3GS',
  'O1S',
  'O2S',
  'O3S',
  'O4S',
  'M1G',
  'M2G',
  'M3G',
  'N1G',
  'N2G',
  'N3G',
  'L1',
  'L2',
  'L3',
  'L4',
  'L5',
  'L6',
  'L7',
];
