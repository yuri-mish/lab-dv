import {
  generalAnswersTwoVariants,
  codeInconsistencyText,
  constructionStateText,
  unexpectedCodeInconsistencyText,
  generalAnswersThreeVariants,
  techStateText,
  left,
  right,
  measurements,
} from 'pages/ep-main/constants';
// Загальні характеристики технічного стану ТЗ та його складників
export const generalCharacteristicsFields = [
  {
    title:
      'Пасажировмісткість ' +
      '(кількість пасажирських місць для сидіння, загальна)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'passengerCapacity',
    codeInconsistency: [ '901.010', unexpectedCodeInconsistencyText ],
  },
  {
    title:
      'Розміщення, стан конструкцції,' +
      ' закріплення сидінь (водія та пасажирів)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'constructionState',
    codeInconsistency: [ '901.020', unexpectedCodeInconsistencyText ],
  },
  {
    title: 'Ремені безпеки водія та пасажира (пасажирів) та їх марковання',
    radioGroupData: generalAnswersThreeVariants,
    field: 'seatBelts',
    codeInconsistency: [ '901.040', unexpectedCodeInconsistencyText ],
  },
  {
    title: 'Замок кабіни, кузова',
    radioGroupData: generalAnswersThreeVariants,
    field: 'bodyCabLock',
    codeInconsistency: [ '902', unexpectedCodeInconsistencyText ],
  },
  {
    title:
      'Протизасліпний пристрій водія (козирок, штора), ' +
      'пристрої обігріву (обдуву) втрового скла',
    radioGroupData: generalAnswersThreeVariants,
    field: 'antiGlareDevices',
    codeInconsistency: [ '301.020', unexpectedCodeInconsistencyText ],
  },
  {
    title:
      'Пристрої перешкоджання викиданню з під ' +
      'пневматичних коліс твердих предметів, бруду',
    radioGroupData: generalAnswersThreeVariants,
    field: 'obstacleDevices',
    codeInconsistency: [ unexpectedCodeInconsistencyText ],
  },
  {
    title: 'Передній та задній бампери',
    radioGroupData: generalAnswersThreeVariants,
    field: 'bumpers',
    codeInconsistency: [ '903', unexpectedCodeInconsistencyText ],
  },
  {
    title: 'Складники, що не передбачені виробником (переобладнення)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'unexpectedComponent',
    codeInconsistency: [
      '101.900',
      '201.110',
      '201.900',
      '202.900',
      '203.900',
      '204.900',
      '411.900',
      '502.020',
      '502.040',
      '1101.50',
      unexpectedCodeInconsistencyText,
    ],
  },
];

// Шини та Колеса
export const pneumaticTyresFields = [
  {
    title: 'Кількість і стан конструкції пренвматичних шин',
    radioGroupData: generalAnswersTwoVariants,
    codeInconsistency: [ '501.010',
      '501.040',
      '501.060',
      unexpectedCodeInconsistencyText ],
    field: 'quantityStateConstruction',
  },
  {
    title: 'Технічний стан пневматичних шин',
    radioGroupData: generalAnswersTwoVariants,
    codeInconsistency: [ '501.020',
      '501.080',
      unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
export const wheelsFields = [
  {
    title: 'Кількість і стан конструкції коліс',
    radioGroupData: generalAnswersTwoVariants,
    codeInconsistency: [ '502.010',
      '501.060',
      '501.080',
      unexpectedCodeInconsistencyText ],
    field: 'quantityStateConstruction',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersTwoVariants,
    codeInconsistency: [ '501.020',
      '501.060',
      unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
  {
    title: 'Затягнення болтів коліс',
    radioGroupData: generalAnswersTwoVariants,
    codeInconsistency: [ unexpectedCodeInconsistencyText ],
    field: 'tightening',
  },
];
export const tyreTreadField = {
  title: 'Категорія КТЗ',
  placeholder: 'Виміряне значення',
  codeInconsistency: [ '501.080', unexpectedCodeInconsistencyText ],
  field: 'tyreTread',
};
export const tyrePressureField = {
  title: 'Значення тиску повітря в шинах, Бар',
  field: 'tyrePressure',
};

// Захисні пристрої
export const protectiveDevicesFields = [
  {
    title: 'Задній захисний пристрій',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '904.010', unexpectedCodeInconsistencyText ],
    field: 'backProtectiveDevice',
  },
  {
    title: 'Бокові захисні пристрої',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '904.020', unexpectedCodeInconsistencyText ],
    field: 'sideProtectiveDevices',
  },
];

// Двигун та його системи
export const engineSystemsFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    field: 'constructionState',
    codeInconsistency: [ '502.010',
      '501.060',
      '501.080',
      unexpectedCodeInconsistencyText ],
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    field: 'techState',
    codeInconsistency: [ '603.050', unexpectedCodeInconsistencyText ],
  },
  {
    title: 'Витоки есплуатаційних рідин',
    radioGroupData: generalAnswersThreeVariants,
    field: 'operationSubstances',
    codeInconsistency: [ '803.090', unexpectedCodeInconsistencyText ],
  },
];

// Система керування
export const controlSystemFields = [
  {
    title: 'Стан конструкції',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [
      '201.040',
      '201.030',
      '201.060',
      '201.050',
      '201.090',
      '201.100',
      unexpectedCodeInconsistencyText,
    ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [
      '201.010',
      '201.020',
      '201.030',
      '201.050',
      '201.070',
      '201.080',
      '201.100',
      '201.110',
      '201.120',
      '201.130',
      '201.140',
      '201.150',
      '201.160',
      '201.170',
      '201.900',
      '202.010',
      '201.900',
      '203',
      '204',
      unexpectedCodeInconsistencyText,
    ],
    field: 'techState',
  },
];
export const controlSystemPKField = {
  title: 'Сумарний кутовий проміжок',
  field: 'controlSystemPK',
  codeInconsistency: [ unexpectedCodeInconsistencyText ],
};

// Стекла / Фари / Дзеркала / Склоочисник та склоомивач
export const windowsFields = [
  {
    title:
      'Відповідність консрукції стекол вимогам законодавства, їх маркуванню',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '302.010', unexpectedCodeInconsistencyText ],
    field: 'designCompliance',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '302.020', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
export const checkedParamsFields = [
  {
    title: 'Світлопропускання вітрового скла(не меньше 75%)',
    radioGroupData: generalAnswersThreeVariants,
    placeholder: measurements,
    field: 'lightTransmissionWindshield',
    normMinRed: 75,
  },
  {
    title: 'Світлопропускання 1-го бокового лівого скла(не меньше 70%)',
    radioGroupData: generalAnswersThreeVariants,
    placeholder: measurements,
    field: 'lightTransmissionFirstLeftSideWindow',
    normMinRed: 70,
  },
  {
    title: 'Світлопропускання 1-го бокового правого скла(не меньше 70%)',
    radioGroupData: generalAnswersThreeVariants,
    placeholder: measurements,
    field: 'lightTransmissionFirstRightSideWindow',
    normMinRed: 70,
  },
  {
    title: 'Світлопропускання 2-го бокового правого скла(не меньше 70%)',
    radioGroupData: generalAnswersThreeVariants,
    placeholder: measurements,
    field: 'lightTransmissionSecondRightSideWindow',
    normMinRed: 70,
  },
  {
    title: 'Світлопропускання 2-го бокового лівого скла(не меньше 70%)',
    radioGroupData: generalAnswersThreeVariants,
    placeholder: measurements,
    field: 'lightTransmissionSecondLeftSideWindow',
    normMinRed: 70,
  },
  {
    title: 'Світлопропускання заднього скла(не меньше 70%)',
    radioGroupData: generalAnswersThreeVariants,
    placeholder: measurements,
    field: 'lightTransmissionBackWindow',
    normMinRed: 70,
  },
];
export const existStateFunctionalityFields = [
  {
    title: 'Фари дальнього світла',
    radioGroupData: generalAnswersThreeVariants,
    field: 'highBeamHeadlights',
  },
  {
    title: 'Фари ближнього світла',
    radioGroupData: generalAnswersThreeVariants,
    field: 'lowBeamHeadlights',
  },
  {
    title: 'Передня протитуманна фара',
    radioGroupData: generalAnswersThreeVariants,
    field: 'frontFogLamp',
  },
];
export const highBeamHeadlightField = {
  title: '20000 - 225000 (дальнє сівтло)*',
  field: 'highBeamHeadlights',
  normMin: 20000,
  normMax: 225000,
};
export const lightPowerFields = [
  {
    title: '\u2264625 / \u2264625 (протит. фари у т. О)',
    firstPlaceholder: left,
    secondPlaceholder: right,
    field: 'fogLamp',
    requiredRule: false,
    normMax: 625,
  },
  {
    title: '\u22652200 (ближнє світло у зоні інтенсивної освітленості)',
    firstPlaceholder: left,
    secondPlaceholder: right,
    field: 'lowBeamHeadlightsIntensiveZone',
    requiredRule: true,
    normMin: 2200,
  },
  {
    title: '\u2264950 / \u2264950 (ближнє світло у зоні малої освітленості)',
    firstPlaceholder: left,
    secondPlaceholder: right,
    field: 'lowBeamHeadlightsSmallZone',
    requiredRule: true,
    normMax: 950,
  },
];
export const lightPowerInconsistency = {
  title: codeInconsistencyText,
  placeholder: codeInconsistencyText,
  field: 'code',
  codeInconsistency: [
    '401.010',
    '401.030',
    '401.040',
    '401.050',
    '402.010',
    '402.030',
    '402.040',
    '403.060',
    '406.010',
    '406.030',
    '406.040',
    unexpectedCodeInconsistencyText,
  ],
};
// const t2e = 'К-сть: 2 Колір: Автожовт.';
export const lightSignalsFirstFields = [
  {
    title: 'Передні покажчики поворотів (К-сть: 2 Колір: Автожовт.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'frontTurnSignals',
    // tooltipText: t2e,
  },
  {
    title: 'Бічні покажчики поворотів (К-сть: 2 Колір: Автожовт.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'sideTurnSignals',
    // tooltipText: t2e,
  },
  {
    title: 'Задні покажчики поворотів (К-сть: 2 Колір: Автожовт.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'backTurnSignals',
    // tooltipText: t2e,
  },
  {
    title: 'Сигнали гальмування (К-сть: 2/4 Колір: Черв.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'brakingSignals',
    // tooltipText: 'К-сть: 2/4 Колір: Черв.',
  },
  {
    title: 'Сигнали гальмування додатковий (К-сть: 1 Колір: Черв.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'additionalBrakingSignals',
    // tooltipText: 'К-сть: 1 Колір: Черв.',
  },
  {
    title: 'Передні габаритні ліхтарі (К-сть: 2 Колір: Білий)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'frontPositionLights',
    // tooltipText: 'К-сть: 2 Колір: Білий',
  },
  {
    title: 'Задні габаритні ліхтарі (К-сть: 2/4 Колір: Черв.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'backPositionLights',
    // tooltipText: 'К-сть: 2/4 Колір: Черв.',
  },
  {
    title: 'Бокові габаритні ліхтарі (К-сть: -- Колір: Автож./(Черв))',
    radioGroupData: generalAnswersThreeVariants,
    field: 'sidePositionLights',
    // tooltipText: 'К-сть: -- Колір: Автож./(Черв)',
  },
  {
    title: 'Аварійна сигналізація (К-сть: --- Колір: Автожовт.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'warningSignals',
    // tooltipText: 'К-сть: --- Колір: Автожовт.',
  },
  {
    title: 'Ліхтарі освітлення номер. знаку (К-сть: 1/2 Колір: Білий.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'lightingLights',
    // tooltipText: 'К-сть: 1/2 Колір: Білий.',
  },
  {
    title: 'Задні протитуманні ліхтарі (К-сть: 1/2 Колір: Черв.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'backFogLights',
    // tooltipText: 'К-сть: 1/2 Колір: Черв.',
  },
  {
    title: 'Передні протитуманні ліхтарі (К-сть: 2 Колір: Білий)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'frontFogLights',
    // tooltipText: 'К-сть: 2 Колір: Білий',
  },
  {
    title: 'Ліхтарі заднього ходу (К-сть: 1/2/4 Колір: Білий)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'reversingLights',
    // tooltipText: 'К-сть: 1/2/4 Колір: Білий',
  },
  {
    title: 'Світловідбивачі задні (нетрикутної форми) (К-сть: 2 Колір: Черв.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'backReflectorsNotTriangular',
    // tooltipText: 'К-сть: 2 Колір: Черв.',
  },
  {
    title: 'Світловідбивачі передні (нетрикутної форми) ' +
      '(К-сть: 2/4 Колір: Автожовт.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'frontReflectors',
    // tooltipText: 'К-сть: 2/4 Колір: Автожовт.',
  },
  {
    title: 'Світловідбивачі бокові (Колір: Автожовт./(Черв.))',
    radioGroupData: generalAnswersThreeVariants,
    field: 'sideReflectors',
    // tooltipText: 'Колір: Автожовт./(Черв.)',
  },
  {
    title: 'Світловідбивачі задні (трикутної форми) ' +
      '(К-сть: 2/4 Колір: Червоний.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'backReflectorsTriangular',
    // tooltipText: 'К-сть: 2/4 Колір: Червоний.',
  },
  {
    title: 'Контурні вогні передні/задні (К-сть: 2/2 Колір: Біл./Черв.)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'contourLights',
    // tooltipText: 'К-сть: 2/2 Колір: Біл./Черв.',
  },
];
export const frequencyBlinkingField = {
  title: 'Частота миготіння показника повороту ((90±30) хв-1)',
  field: 'frequencyBlinking',
  // tooltipText: '(90±30) хв-1',
  normMin: 60,
  normMax: 120,
};
export const lightSignalsSecondFields = [
  {
    title: 'Покажчики повороту з одного боку КТЗ (працюють в одній фазі)',
    radioGroupData: generalAnswersThreeVariants,
    field: 'turnSignalsOneSideKTZ',
    // tooltipText: 'працюють в одній фазі',
  },
  {
    title: 'Аварійний сигнал (Синхронне спрацювання)',
    radioGroupData: generalAnswersTwoVariants,
    field: 'emergencyAlert',
    // tooltipText: 'Синхронне спрацювання',
  },
];
export const lightSignalsInconsistency = {
  title: 'Код неідповідності',
  placeholder: 'Код неідповідності',
  field: 'code',
  codeInconsistency: [
    '401.010',
    '401.020',
    '402.010',
    '402.020',
    '403.010',
    '403.020',
    '404.010',
    '404.020',
    '404.030',
    '405.010',
    '405.020',
    '405.030',
    '405.040',
    '405.050',
    '406.010',
    '406.020',
    '406.050',
    '407.010',
    '407.020',
    '408.010',
    '408.020',
    '409.010',
    '409.020',
    '409.030',
    unexpectedCodeInconsistencyText,
  ],
};
export const mirrorsDevicesFields = [
  {
    title:
      'Наявність, стан конструкції, функціональні ' +
      'можливості та наявність марковання знаком оф. затвердження типу',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '303.01',
      '303.02',
      '303.05',
      '303.06',
      unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '303.03',
      '303.04',
      '303.05',
      '303.06',
      unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
export const windshieldWiperFields = [
  {
    title: 'Наявність, стан конструкції, функціональні можливості',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '302.050', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '302.060', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
export const movingFrequencyField = {
  title:
    'Частота переміщення щіток по мокрому склу' +
    ' в режимі максимальної швидкості ' +
    'повинна бути не менше ніж 35 подвійних ходів за хв.',
  radioGroupData: generalAnswersThreeVariants,
  placeholder: 'Результат',
  field: 'movingFrequency',
  codeInconsistency: [ unexpectedCodeInconsistencyText ],
};

// Інше обладнання
// Вимоги стосовно газобалонного обладнання
export const requirementsGasEquipmentsFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [
      '701.020',
      '701.010',
      '702.020',
      '702.040',
      '702.060',
      '703.010',
      '703.020',
      '703.030',
      '703.050',
      '703.070',
      '704.010',
      '704.030',
      '704.050',
      '704.070',
      '705.010',
      '705.020',
      unexpectedCodeInconsistencyText,
    ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '701.010',
      '701.030',
      '703.040',
      '702.010',
      '706',
      unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Вимоги до двигунів OBD, OBD-I, OBD-II, EOBD
export const requirementsEnginesFields = [
  {
    title: 'Технічний стан, функціональні можливості',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '603.050', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Рама, кузов, інші несівні елементи
export const frameBodyElementsFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '905', '910', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '905', '910', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Сідельно-зчіпний пристрій,
// шворінь напівпричепа (для категорій N2, N3, O3, 04)
export const saddleConnectingDeviceFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '906', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '906', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Передній, задній буксирувальні пристої (для категорій N2, N3, O3, 04)
export const frontBackTowingDevicesFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '907', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '907', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Вантажна платформа, вантажний кузов
export const loadPlatformFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '908', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '908', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Запасне пневматичне колесо
export const sparePneumaticWheelFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '911', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '911', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Силова передача і її механізми управління
// (коробка передач, кардан, редуктор)
export const transmissionMechanismsFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '912', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '912', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Мости, осі
export const driveAxleAxesFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '913', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '913', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Засоби фіксації, устримання зчіпних пристроїв
// у разі їх аварійного роз'єднання (для причепів та напівпричепів)
export const securingDevicesFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '914', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '914', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Прилади (спідометр, тахометр при необхідності)
export const devicesFields = [
  {
    title: constructionStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '915', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: techStateText,
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '915', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];
// Устаткування (звуковий сигнал, аптечка, вогнегансник, противідкатні упори)
export const equipmentsFields = [
  {
    title: 'Стан конструкції, функціональні можливості',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '916', unexpectedCodeInconsistencyText ],
    field: 'constructionState',
  },
  {
    title: 'Технічний стан',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '916', unexpectedCodeInconsistencyText ],
    field: 'techState',
  },
];

// Додаток 1 Додаткова перевірка автобусів,
// які призначені для перевезення школярів або осіб з інвалідністю
// Конструкція автобуса, його складові частини
export const doorConstructionFields = [
  {
    title:
      'Конструкція пасажирських, аварійних дверей ' +
      '(відчинення  зсередини і ззовні органом включення, ' +
      'виключення або дистанційне управління)',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.010', unexpectedCodeInconsistencyText ],
    field: 'doorConstruction',
  },
  {
    title: 'Захисні пристрої механізмів дверей',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.020', unexpectedCodeInconsistencyText ],
    field: 'doorProtectiveDevices',
  },
  {
    title: 'Засоби контролю за зачиненими дверей',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.030', unexpectedCodeInconsistencyText ],
    field: 'closeControlDevices',
  },
  {
    title: 'Аварійний вихід, доступ до нього',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.050', unexpectedCodeInconsistencyText ],
    field: 'emergencyDoor',
  },
  {
    title: 'Покриття підлоги автобусу (небезпека підсковзнутися, впасти)',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.070', unexpectedCodeInconsistencyText ],
    field: 'busFloorCovering',
  },
  {
    title: 'Сидіня для пасажирів, членів екіпажу',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.100', unexpectedCodeInconsistencyText ],
    field: 'crewPassengersSeats',
  },
  {
    title: 'Кількість поручнів, їх розташування та технічний стан',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.110', unexpectedCodeInconsistencyText ],
    field: 'handrailsNumber',
  },
  {
    title: 'Конструкція місць для лежання',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.120', unexpectedCodeInconsistencyText ],
    field: 'lyingPlacesConstruction',
  },
  {
    title:
      'Світлосигнальна, акустична відео система ' +
      'спілкування водій - член екіпажу',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.150', unexpectedCodeInconsistencyText ],
    field: 'lightSignalSystem',
  },
  {
    title: 'Засоби внутрішнього освітлення',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.190', unexpectedCodeInconsistencyText ],
    field: 'internalLightingDevices',
  },
  {
    title:
      'Освітлення та елементи закріплення трафаретів стосовно ' +
      'маршруту не встановлені чи пошкоджені',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.210', unexpectedCodeInconsistencyText ],
    field: 'lightingFixingElements',
  },
  {
    title:
      'Наявність та відповідність написів, позначки входу/виходу, ' +
      'пасажировмісності, позначки розташування аптечки, вгнегасника',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1001.220', unexpectedCodeInconsistencyText ],
    field: 'enterExitMark',
  },
];

// Перевірка автобусів, призначених для перевезення школярів
export const checkSchoolBusFields = [
  {
    title:
      'Діюче управління відчинення дверей та їх блокуванням, ' +
      'відкриття заблокованих дверей засобами аварійного відчинення',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.010', unexpectedCodeInconsistencyText ],
    field: 'openLockControl',
  },
  {
    title:
      'Відсутнє самовільне зняття блокування дверей ' +
      '(при швидкості більше 5км/год)',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.010', unexpectedCodeInconsistencyText ],
    field: 'doorLockRemoval',
  },
  {
    title:
      'Автобус не може зрушити з місця з відчиненими дверима. ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.010', unexpectedCodeInconsistencyText ],
    field: 'blockMoveWithOpenDoor',
  },
  {
    title:
      'При відчиненні дверей діє преривиста акустична сигналізація, ' +
      'звук якої проникає всередину автобуса',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.010', unexpectedCodeInconsistencyText ],
    field: 'intermittentAcousticAlarm',
  },
  {
    title:
      'На кузові наявний запис "Шкільний автобус" ' +
      'та розпізнавальний знак діти',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.030', unexpectedCodeInconsistencyText ],
    field: 'schoolBusMark',
  },
  {
    title: 'Задній хід автобуса супроводжує акустичний сигнал',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.040', unexpectedCodeInconsistencyText ],
    field: 'reverseBusSignal',
  },
  {
    title:
      'На місці для перевезення пасажирів на колясках ' +
      'наявне відповідне маркування',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.050', unexpectedCodeInconsistencyText ],
    field: 'wheelchairsPassengersMark',
  },
  {
    title: 'Наявні діючі засоби кріплення колясок',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.050', unexpectedCodeInconsistencyText ],
    field: 'wheelchairsFixingDevices',
  },
  {
    title:
      'Передбачені місця для закріплення крісле-колясок ' +
      'у розкладеному та (або) складеному стані',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.050', unexpectedCodeInconsistencyText ],
    field: 'wheelchairsFixingPlace',
  },
  {
    title: 'Забезпечений доступ для завантаження (розвантаження) коляски',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.050', unexpectedCodeInconsistencyText ],
    field: 'accessLoadingWheelchairs',
  },
  {
    title:
      'Сидіння, що межують з походом' +
      ' мають бокові елементи для утримання пасажирів',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1101.070', unexpectedCodeInconsistencyText ],
    field: 'sideElementsHoldPassengers',
  },
];
// Спеціальні обладнання
export const specialEquipmentFields = [
  {
    title:
      'Пристрій для підіймання школяра в кріслі-колясці ' +
      'діє та відповідає вимогам',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1102.010', unexpectedCodeInconsistencyText ],
    field: 'deviceLiftingWheelchairStudent',
  },
  {
    title: 'Діючі ремені безпеки, їх маркування',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1102.020', unexpectedCodeInconsistencyText ],
    field: 'activeSeatBelts',
  },
  {
    title:
      'Наявні діючі внутрішні дзеркала спостереження за пасажирами ' +
      'з місця водія та з місця особи, що супроводжує пасажирів',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1102.030', unexpectedCodeInconsistencyText ],
    field: 'interiorPassengersMirrors',
  },
  {
    title:
      'Наявні діючі засоби зв\'язку для сигналізації водієві ' +
      'з місця пасажира чи особи, ' +
      'що супроводжує пасажирів, про вимогу зупинки',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1102.040', unexpectedCodeInconsistencyText ],
    field: 'communicationDevices',
  },
  {
    title:
      'Наявні діючі проблискові маячки оранжевого кольору на даху, ' +
      'які вмикаються з робочого місця водія, незалежно від того, ' +
      'зачинені чи відчинені двері, двигун діє чи ні',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1102.060', unexpectedCodeInconsistencyText ],
    field: 'flashingOrangeSignals',
  },
  {
    title:
      'Наявний діючий обмежувач швидкості, ' +
      'відповідна сигналізація та тахограф',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1102.080', unexpectedCodeInconsistencyText ],
    field: 'activeSpeedLimiter',
  },
];

// Перевірка автобусів, які призначені та пристосовані
// для перевезення осіб з інвалідністю
export const checkHandicappedBusFields = [
  {
    title:
      'Закріплені горизонтальні поручні вздовж стінок кузова ' +
      'біля місця установки крісла-коляски',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1201.010', unexpectedCodeInconsistencyText ],
    field: 'fixedHorizontalHandrails',
  },
  {
    title:
      'Наявні закріплені засоби закріплення крісла-коляски ' +
      'в транспортному положенні',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1201.030', unexpectedCodeInconsistencyText ],
    field: 'devicesFixingWheelchairs',
  },
  {
    title:
      'Забезпечено блокування руху у разі, коли засоби ' +
      'підіймання-опускання, переміщення крісла-коляски не встановлено у ' +
      'транспортне положення, а пасажирські двері не зачинено',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1201.050', unexpectedCodeInconsistencyText ],
    field: 'trafficBlocking',
  },
  {
    title:
      'Наявна діюча сигналізація на робочому місці водія ' +
      'про місце розміщення засобів підіймання-опускання, крісла-коляски ' +
      'та про вимогу зупинки',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1201.070', unexpectedCodeInconsistencyText ],
    field: 'validAlarmDriverWorkplace',
  },
  {
    title:
      'Наявна транспортна коляска для переміщення інваліда в автобусі ' +
      'і коляска, суміщена з установленим унітазом ' +
      'туалету в автобусі ІІ і ІІІ класу ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1201.080', unexpectedCodeInconsistencyText ],
    field: 'transportWheelchair',
  },
  {
    title:
      'Наявність опори сидінь крісел-колясок для стоп, гомілок інвалідів' +
      'спинка сидіння фіксується у нахиленому положенні, повертається ' +
      'у вихідне положення, покриття подушок і спинок без пошкоджень, ' +
      'діючі ремені безпеки в автобусах ІІ і ІІІ класу, підлокітники ' +
      'сидінь, що розміщені біля проходу, відкидаються та без пошкоджень ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1201.100', unexpectedCodeInconsistencyText ],
    field: 'supportSeatWheelchairs',
  },
  {
    title:
      'Конструкція та засоби автобусу забезпечують доступ інвалідів ' +
      'в автобус та їх переміщення в середині ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1201.120', unexpectedCodeInconsistencyText ],
    field: 'constructionDevicesForDisabled',
  },
  {
    title:
      'Наявний та діючий пристрій закріплення складеної коляски ' +
      'у транспортному положенні ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1202.010', unexpectedCodeInconsistencyText ],
    field: 'fixedDevicesForFoldedWheelchairs',
  },
  {
    title: 'Наявна відповідна інструкція щодо перевезення пасажирів-інвалідів ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1202.050', unexpectedCodeInconsistencyText ],
    field: 'transportInstructionDisabled',
  },
];

// Додаткова перевірка таксі
export const additionalTaxiCheckFields = [
  {
    title:
      'Наявні ліхтарі "таксі", сигнальні ліхтарі з світлофільтрами ' +
      'червоного і зеленого кольорів, таксометр, ' +
      'інформаційні табличики про водія',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1301.010', unexpectedCodeInconsistencyText ],
    field: 'taxiLights',
  },
  {
    title:
      'Таксометр і сигнальні вогні не вмикаються/вимикаються ' +
      'з місця водія',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1302.010', unexpectedCodeInconsistencyText ],
    field: 'taximeterSignalLights',
  },
  {
    title:
      'Ліхтар "таксі" вмикається коли таксометр вимкнено та ' +
      'незалежно від увімкнення іншиї світлових приладів',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1302.020', unexpectedCodeInconsistencyText ],
    field: 'taxiLantern',
  },
];

// Додаткова перевірка транспортних засобів категорій
// FL, OX, AT, EX/II, EX/III, які призначено або пристосовано
// для перевезення небезпечних вантажів
export const checkDangerousBusFields = [
  {
    title:
      'Характеристики спеціального обладнання транспортного засобу для ' +
      'перевезення небезпечних вантажів підтверджені офіціними документами ' +
      'відповідно до законодавства, строк дії офіційних',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1601.010', unexpectedCodeInconsistencyText ],
    field: 'specialVehicleEquipmentCharacteristics',
  },
  {
    title:
      'Відповідність конструкції базового транспортного засобу ' +
      '(його складових частин) ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1601.020', unexpectedCodeInconsistencyText ],
    field: 'conformityBaseVehicle',
  },
  {
    title:
      'Наявні інформаційні таблички про небезпечні вантажі за кількісними ' +
      'та якісними складом, розміри та місце установлення ' +
      'відповідає вимогам ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1601.040', unexpectedCodeInconsistencyText ],
    field: 'dangerousGoodsInformationBoards',
  },
  {
    title:
      'Наявний комплект спеціального обладнання (противідкотні упори), ' +
      'засоби пожежогасіння, конусм із світловідбивною поверхнею, ' +
      'миготливі ліхтарі жовтого кольору з автономним живленням, ' +
      'знаки аварійної',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1601.080', unexpectedCodeInconsistencyText ],
    field: 'specialEquipmentSet',
  },
  {
    title:
      'Складові частини електромережі за конструкцією, виконанням ' +
      'і місцем установки відпвідають вимогам ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1601.100', unexpectedCodeInconsistencyText ],
    field: 'powerGridComponents',
  },
  {
    title:
      'Гальмові системи (робоча, стоянкова, тривалої дії ("зностривка"), ' +
      'аварійна) відпвідають спеціальним вимогам ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1601.120', unexpectedCodeInconsistencyText ],
    field: 'brakeSystems',
  },
  {
    title: 'Наявні відповідні пристрої обмеження швидкості ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1601.140', unexpectedCodeInconsistencyText ],
    field: 'speedLimitationDevices',
  },
  {
    title:
      'Місця установки опалювального пристрою та функціонування ' +
      'його вимикача, вимикання електрообладнання відповідає вимогам ' +
      'до транспортних засобів категорій EX/II та EX/III',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1602.010', unexpectedCodeInconsistencyText ],
    field: 'heatingDeviceInstallationPlace',
  },
  {
    title:
      'Вимоги транспортних засобів закритого типу категорії EX/II  ' +
      'щодо дверей, вікон, кришок ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1602.030', unexpectedCodeInconsistencyText ],
    field: 'closedRequirementsCategoryEXII',
  },
  {
    title:
      'Вимоги транспортних засобів незакритого типу категорії EX/III  ' +
      'щодо дверей а їх запірних пристроїв ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1602.060', unexpectedCodeInconsistencyText ],
    field: 'notClosedRequirementsCategoryEXIII',
  },
  {
    title:
      'Вимоги до транспортних засобів категорій FL, OX та AT ' +
      'щодо технічного стану елементів закріплення спеціальних засобів ' +
      'призначених для розміщення вантажу, заднього захисного ' +
      'пристрою, вимикача ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1602.080', unexpectedCodeInconsistencyText ],
    field: 'requirementsCategoryFLOXAT',
  },
  {
    title:
      'Вимоги до транспортного засобу, який призначено для перевезення ' +
      'самореактивних речовин класу небезпеки 4.1 та органічних пероксидів ' +
      'класу небепеки 5.2, щодо регулювання контролю',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1602.100', unexpectedCodeInconsistencyText ],
    field: 'requirementsSelfReactiveSubstances',
  },
];

// Додаткова перевірка учбового транспортного засобу
export const additionalCheckingFields = [
  {
    title:
      'Наявний відповідний розпізнавальний знак ' +
      '"Учбовий транспортний засіб" ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.010', unexpectedCodeInconsistencyText ],
    field: 'trainingVehicleMark',
  },
  {
    title:
      'Наявне обладнане місце для спеціаліста з підготовки ' +
      'до керування транспортним засобом',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.011', unexpectedCodeInconsistencyText ],
    field: 'trainingSpecialistPlace',
  },
  {
    title: 'Наявні додаткові дзеркала заднього виду ',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.012', unexpectedCodeInconsistencyText ],
    field: 'additionalRearViewMirrors',
  },
  {
    title:
      'Наявні додаткові педалі зчеплення ' +
      '(за наявності основної педалі зчеплення) і гальмування',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.013', unexpectedCodeInconsistencyText ],
    field: 'additionalClutchBrakingPedals',
  },
  {
    title:
      'Дублюючі механізми органів управління гальмовою системою та ' +
      'трансмісією (педалі, важелі тощо) установлені в зоні дії ніг ' +
      'спеціаліста з підготовки до керування транспортним засобом без ' +
      'порушень ергономічних вимог та не перешкоджають водію натискати ' +
      'на основні педалі',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.020', unexpectedCodeInconsistencyText ],
    field: 'duplicateMechanismsControls',
  },
  {
    title:
      'Осьовий люфт у шарнірах механізмів ' +
      'дублюючих педалей не перевищує 0,3 мм',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.030', unexpectedCodeInconsistencyText ],
    field: 'axialPlay',
  },
  {
    title: 'Дублюючі педалі повторюють положення основних педалей',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.040', unexpectedCodeInconsistencyText ],
    field: 'duplicatePedals',
  },
  {
    title:
      'Зусилля на педалях дублюючих механізмів ' +
      'не повинно перевищувати 147,1 Н',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.050', unexpectedCodeInconsistencyText ],
    field: 'effortsPedalsDuplicatingMechanisms',
  },
  {
    title:
      'Дублюючі механізми органів управління гальмовою системою ' +
      'та трансмісією не повинні змінювати зусилля спрацювання ' +
      'основних педалей більше ніж на 5 відсотків.',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.060', unexpectedCodeInconsistencyText ],
    field: 'duplicateBrakeControlSystems',
  },
  {
    title:
      'Дублюючі механізми повинні забезпечувати повний ' +
      'і вільний хід основних педалей та не дозволяти ' +
      'повному виключенню зчеплення та роботи приводу ' +
      'гальмових механізмів незалежно від водія; ' +
      'конструкція дублюючих механізмів не повинно призводити ' +
      'до заїдання чи самовільного спрацювання; ' +
      'дублюючі механізми не перешкоджають спрацюванню ' +
      'інших органів управління транспортним засобом та ' +
      'не призводять до пошкодження (відсутні обриви ' +
      'проводів рухомими деталями, відсутні труднощі ' +
      'повертання керма та подання звукового сигналу, ' +
      'переключення передач тощо)',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1701.070', unexpectedCodeInconsistencyText ],
    field: 'duplicateMechanismsMainPedals',
  },
];
// Додаткові вимоги до органів управління транспортним засобом,
// призначеним для підготовки водіїв з числа осіб з інвалідністю
// або маломобільних груп населення
export const additionalRequirementsFields = [
  {
    title:
      'Наявний зафіксований ручний привід акселератора ' +
      'постійної дії (у вигляді важелів або ' +
      'кільця на кермі (поза кермом: збоку чи під ним); ' +
      'ручний привід акселератора, установлений на кермі, не повинен ' +
      'призводити до збільшення зусилля обертання керма',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1702.010', unexpectedCodeInconsistencyText ],
    field: 'fixedManualAcceleratorDrive',
  },
  {
    title:
      'Зусилля на ручному приводі акселератора не повинно перевищувати ' +
      '19,6 - 29,4 Н на кожному важелі за умови одночасного натискання, ' +
      '29,4- 39,2Н на кільці та 49 Н на фіксованому приводі',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1702.011', unexpectedCodeInconsistencyText ],
    field: 'effortManualAcceleratorDrive',
  },
  {
    title:
      'Величина ходу ручного приводу акселератора повинна не перевищувати ' +
      '50-65 мм для важелів на кермі та 45-55 мм для кільця',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1702.012', unexpectedCodeInconsistencyText ],
    field: 'magnitudeStrokeAccelerator',
  },
  {
    title:
      'Конструкція ручного приводу акселератора повинна забезпечувати його ' +
      'роботу в повному діапазоні повороту колеса керма',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1702.020', unexpectedCodeInconsistencyText ],
    field: 'provideAcceleratorTurning',
  },
  {
    title:
      'Елементи ручних приводів органів управління транспортних засобів ' +
      'повинні мати не гострі краї та не виступаюти за площину колеса керма ' +
      '(крім акселератора на кермі)',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1702.030', unexpectedCodeInconsistencyText ],
    field: 'notSharpManualElements',
  },
];

// Додаткова перевірка спеціалізованого
// санітарного автомобіля бригади екстреної (швидкої) медичної допомоги
export const additionalAmbulanceCheckField = [
  {
    title: 'Наявне закріплене спеціальне обладнання',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1401.010', unexpectedCodeInconsistencyText ],
    field: 'specialFixeEquipment',
  },
  {
    title: 'Наявний діючий окремий вимикач додаткової акумуляторної батареї',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1401.020', unexpectedCodeInconsistencyText ],
    field: 'separateBatterySwitch',
  },
  {
    title:
      'Наявний діючий перетворювач постійного струму базового ' +
      'автомобіля в змінний струм напругою 220 В, частотою 50 Гц',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1401.040', unexpectedCodeInconsistencyText ],
    field: 'converterDCtoAC',
  },
  {
    title:
      'Не можливо здійснити пуск двигуна і рух у разі, ' +
      'коли спеціальне устатковання живить зовнішнє джерело',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1401.050', unexpectedCodeInconsistencyText ],
    field: 'notPossibleStartEngine',
  },
  {
    title:
      'Додаткові електричні системи живлення спеціального ' +
      'устатковання мають окремі запобіжники ' +
      'або відповідні електронні пристрої',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1401.060', unexpectedCodeInconsistencyText ],
    field: 'additionalElectricPowerSystems',
  },
  {
    title:
      'Кузов, елементи шасі не повинні використовуватись ' +
      'як “заземлення” додаткових електричних систем',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1401.070', unexpectedCodeInconsistencyText ],
    field: 'bodyChassisElements',
  },
  {
    title:
      'Двері медичного салону зафіксовуються у відчиненому положенні, ' +
      'аудіо- та (або) візуальний сигнал попереджає водія ' +
      'про відчинення дверей медичного салону',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1401.080', unexpectedCodeInconsistencyText ],
    field: 'medicalSalonDoors',
  },
  {
    title:
      'У систему вентилювання-обігрівання медичного салону ' +
      'не повинні потрапляти спалини',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1401.090', unexpectedCodeInconsistencyText ],
    field: 'ventilationHeatingSystem',
  },
];

// Додаткова перевірка великогабаритного, великовагового транспортного засобу
export const additionalTruckCheckFields = [
  {
    title:
      'Наявний відповідний комплект противідкотних упорів, ' +
      'попереджувальних конусів, знаків об’їзду, протиковзких ланцюгів' +
      ' пневматичних шин автомобіля-тягача та причепів',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1501.010', unexpectedCodeInconsistencyText ],
    field: 'retractableStopSet',
  },
  {
    title:
      'Наявний жорсткий буксир, миготливий ліхтар червоного кольору ' +
      'або знак аварійної зупинки, жилет оранжевого кольору ' +
      'із світловідбивними елементами',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1501.020', unexpectedCodeInconsistencyText ],
    field: 'hardTug',
  },
  {
    title:
      'Наявний розпізнавальний знак обмеження швидкості, ' +
      'передній та задній сигнальні щитки “Негабаритний вантаж”',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1501.030', unexpectedCodeInconsistencyText ],
    field: 'speedLimitSign',
  },
  {
    title:
      'Наявні в достатній кількості та відповідають вимогам ліхтарі ' +
      'переднього білого та заднього червоного кольору для встановлення ' +
      'на крайніх габаритних частинах негабаритного вантажу',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1501.040', unexpectedCodeInconsistencyText ],
    field: 'frontBackLights',
  },
  {
    title:
      'Наявний та відповідає вимогам знак “Довгомірний транспортний засіб” ' +
      'та ліхтарі білого, червоного та оранжевого кольору та пристосовані ' +
      'для встановлення їх відповідно спереду, ' +
      'ззаду і з боків транспортного засобу',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1501.050', unexpectedCodeInconsistencyText ],
    field: 'longVehicleMark',
  },
  {
    title: 'Наявні та відповідають вимогам дзеркала заднього вигляду',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1501.060', unexpectedCodeInconsistencyText ],
    field: 'rearViewMirrors',
  },
  {
    title: 'Наявне та відповідає вимогам кольографічне маркування',
    radioGroupData: generalAnswersThreeVariants,
    codeInconsistency: [ '1502.010', unexpectedCodeInconsistencyText ],
    field: 'colorGraphMarking',
  },
];

export const fuelTypes = [ 'Бензин', 'Газ', 'Газ-Бензин' ];
export const existNeutralization = [ 'Не обладнаний', 'Обладнаний' ];
export const gasTypes = [ 'СПГ', 'ЗНГ' ];
export const concentrationCO2ValuesInconsistency = [ '801.010',
  unexpectedCodeInconsistencyText ];
export const brakingSystemInconsistency = [ '101',
  '102',
  '103',
  '104',
  '105',
  unexpectedCodeInconsistencyText ];
export const carbonsBurnsValuesInconsistency = [ '801.050',
  unexpectedCodeInconsistencyText ];
export const brakingSystemTypeList = [
  'гідравлічні', 'пневматичні', 'інерційні', 'без гальм',
];
export const contentCONorms = { nMin: 3.5, nPidv: 2 };
export const contentCHNormsLess4 = { nMin: 1200, nPidv: 600 };
export const contentCHNormsMore4 = { nMin: 2500, nPidv: 1000 };
