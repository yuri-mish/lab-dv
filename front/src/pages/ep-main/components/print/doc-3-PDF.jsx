import file from 'moks/printPDFs/doc_3.pdf';

import { pdfBuilder } from './pdfBuilder';
export const modifyDoc3Pdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    rCode,
    getField = () => {},
  } = await pdfBuilder(file);
  // Додаток 3 до ПРОТОКОЛУ №
  getField('d3t0')?.setText(data?.docNumDate);
  getField('d3t0')?.updateAppearances(bFont);//nead to use cyrillic
  // 1.1 Характеристики спеціального обладнання транспортного засобу для
  // перевезення небезпечних вантажів підтверджені офіційними документами
  // відповідно до законодавства, строк дії офіційних документів не вичерпано
  getField('d3t1')?.setText(`${data?.form
    ?.specialVehicleEquipmentCharacteristics?.general || ''}`);
  getField('d3t2')?.setText(`${data?.form
    ?.specialVehicleEquipmentCharacteristics
    ?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.2 Відповідність конструкції базового транспортного засобу
  // (його складових частин)
  getField('d3t3')?.setText(`${data?.form
    ?.conformityBaseVehicle?.general || ''}`);
  getField('d3t4')?.setText(`${data?.form
    ?.conformityBaseVehicle?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.3 Наявні інформаційні таблички про небезпечні вантажі за кількісними
  // та якісними складом, розміри та місце установлення відповідає вимогам
  getField('d3t5')?.setText(`${data?.form
    ?.dangerousGoodsInformationBoards?.general || ''}`);
  getField('d3t6')?.setText(`${data?.form
    ?.dangerousGoodsInformationBoards?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.4 Наявний комплект спеціального обладнання (противідкотні упори,
  // засоби пожежогасіння, конуси із світловідбивною поверхнею, миготливі
  // ліхтарі жовтого кольору з автономним живленням, знаки аварійної зупинки,
  // жилети із світловідбивними елементами, переносні ліхтарі)
  getField('d3t7')?.setText(`${data?.form
    ?.specialEquipmentSet?.general || ''}`);
  getField('d3t8')?.setText(`${data?.form
    ?.specialEquipmentSet?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.5 Складові частини електромережі за конструкцією, виконанням і місцем
  // установки відпвідають вимогам
  getField('d3t9')?.setText(`${data?.form
    ?.powerGridComponents?.general || ''}`);
  getField('d3t10')?.setText(`${data?.form
    ?.powerGridComponents?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.6 Гальмові системи (робоча, стоянкова, тривалої дії ("зностривка"),
  // аварійна) відпвідають спеціальним вимогам
  getField('d3t11')?.setText(`${data?.form
    ?.brakeSystems?.general || ''}`);
  getField('d3t12')?.setText(`${data?.form
    ?.brakeSystems?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.7 Наявні відповідні пристрої обмеження швидкості
  getField('d3t13')?.setText(`${data?.form
    ?.speedLimitationDevices?.general || ''}`);
  getField('d3t14')?.setText(`${data?.form
    ?.speedLimitationDevices?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.8 Місця установки опалювального пристрою та функціонування його вимикача,
  // вимикання електрообладнання відповідає вимогам до транспортних засобів
  // категорій EX/II та EX/III
  getField('d3t15')?.setText(`${data?.form
    ?.heatingDeviceInstallationPlace?.general || ''}`);
  getField('d3t16')?.setText(`${data?.form
    ?.heatingDeviceInstallationPlace?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.9 Вимоги транспортних засобів закритого типу категорії EX/II щодо дверей,
  // вікон, кришок
  getField('d3t17')?.setText(`${data?.form
    ?.closedRequirementsCategoryEXII?.general || ''}`);
  getField('d3t18')?.setText(`${data?.form
    ?.closedRequirementsCategoryEXII?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.10 Вимоги транспортних засобів незакритого типу категорії EX/III щодо
  // дверей а їх запірних пристроїв
  getField('d3t19')?.setText(`${data?.form
    ?.notClosedRequirementsCategoryEXIII?.general || ''}`);
  getField('d3t20')?.setText(`${data?.form
    ?.notClosedRequirementsCategoryEXIII?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.11 Вимоги до транспортних засобів категорій FL, OX та AT щодо технічного
  // стану елементів закріплення спеціальних засобів призначених для розміщення
  // вантажу, заднього захисного пристрою, вимикача
  getField('d3t21')?.setText(`${data?.form
    ?.requirementsCategoryFLOXAT?.general || ''}`);
  getField('d3t22')?.setText(`${data?.form
    ?.requirementsCategoryFLOXAT?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.12 Вимоги до транспортного засобу, який призначено для перевезення
  // самореактивних речовин класу небезпеки 4.1 та органічних пероксидів
  // класу небепеки 5.2, щодо регулювання контролю
  getField('d3t23')?.setText(`${data?.form
    ?.requirementsSelfReactiveSubstances?.general || ''}`);
  getField('d3t24')?.setText(`${data?.form
    ?.requirementsSelfReactiveSubstances?.code?.replace(rCode, 'НКН') || ''}`);
  // Примітка
  getField('d3t25')?.setText(`${data?.note || ''}`);

  form?.updateFieldAppearances(lFont);//nead to use cyrillic
  return pdfDoc || undefined;

};
