import file from 'moks/printPDFs/doc_6.pdf';

import { pdfBuilder } from './pdfBuilder';
export const modifyDoc6Pdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    rCode,
    getField = () => {},
  } = await pdfBuilder(file);

  // Додаток 6 до ПРОТОКОЛУ №
  getField('d6t0')?.setText(data?.docNumDate);
  getField('d6t0')?.updateAppearances(bFont);//nead to use cyrillic
  // 1.1 Наявний відповідний комплект противідкотних упорів, попереджувальних
  // конусів, знаків об’їзду, протиковзких ланцюгів пневматичних шин
  // автомобіля-тягача та причепів
  getField('d6t1')?.setText(`${data?.form
    ?.colorGraphMarking?.general || ''}`);
  getField('d6t2')?.setText(`${data?.form
    ?.colorGraphMarking?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.2 Наявний жорсткий буксир, миготливий ліхтар червоного кольору або знак
  // аварійної зупинки, жилет оранжевого кольору із світловідбивними елементами
  getField('d6t3')?.setText(`${data?.form?.hardTug?.general || ''}`);
  getField('d6t4')?.setText(`${data?.form
    ?.hardTug?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.3 Наявний розпізнавальний знак обмеження швидкості, передній
  // та задній сигнальні щитки “Негабаритний вантаж”
  getField('d6t5')?.setText(`${data?.form
    ?.speedLimitSign?.general || ''}`);
  getField('d6t6')?.setText(`${data?.form
    ?.speedLimitSign?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.4 Наявні в достатній кількості та відповідають вимогам ліхтарі
  // переднього білого та заднього червоного кольору для встановлення
  // на крайніх габаритних частинах негабаритного вантажу
  getField('d6t7')?.setText(`${data?.form?.frontBackLights?.general || ''}`);
  getField('d6t8')?.setText(`${data?.form
    ?.frontBackLights?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.5 Наявний та відповідає вимогам знак “Довгомірний транспортний засіб”
  // та ліхтарі білого, червоного та оранжевого кольору та пристосовані для
  // встановлення їх відповідно спереду, ззаду і з боків транспортного засобу
  getField('d6t9')?.setText(`${data?.form
    ?.longVehicleMark?.general || ''}`);
  getField('d6t10')?.setText(`${data?.form
    ?.longVehicleMark?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.6 Наявні та відповідають вимогам дзеркала заднього вигляду
  getField('d6t11')?.setText(`${data?.form
    ?.rearViewMirrors?.general || ''}`);
  getField('d6t12')?.setText(`${data?.form
    ?.rearViewMirrors?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.7 Наявне та відповідає вимогам кольографічне маркування
  getField('d6t13')?.setText(`${data?.form
    ?.colorGraphMarking?.general || ''}`);
  getField('d6t14')?.setText(`${data?.form
    ?.colorGraphMarking?.code?.replace(rCode, 'НКН') || ''}`);

  form?.updateFieldAppearances(lFont);//nead to use cyrillic
  return pdfDoc || undefined;

};
