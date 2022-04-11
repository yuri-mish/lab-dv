import file from 'moks/printPDFs/doc_5.pdf';

import { pdfBuilder } from './pdfBuilder';
export const modifyDoc5Pdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    rCode,
    getField = () => {},
  } = await pdfBuilder(file);

  // Додаток 5 до ПРОТОКОЛУ №
  getField('d5t0')?.setText(data?.docNumDate);
  getField('d5t0')?.updateAppearances(bFont);//nead to use cyrillic
  // 1.1 Наявне закріплене спеціальне обладнання
  getField('d5t1')?.setText(`${data?.form
    ?.specialFixeEquipment?.general || ''}`);
  getField('d5t2')?.setText(`${data?.form
    ?.specialFixeEquipment?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.2 Наявний діючий окремий вимикач додаткової акумуляторної батареї
  getField('d5t3')?.setText(`${data?.form
    ?.separateBatterySwitch?.general || ''}`);
  getField('d5t4')?.setText(`${data?.form
    ?.separateBatterySwitch?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.3 Наявний діючий перетворювач постійного струму базового автомобіля
  // в змінний струм напругою 220 В, частотою 50 Гц
  getField('d5t5')?.setText(`${data?.form
    ?.converterDCtoAC?.general || ''}`);
  getField('d5t6')?.setText(`${data?.form
    ?.converterDCtoAC?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.4 Не можливо здійснити пуск двигуна і рух у разі, коли спеціальне
  // устатковання живить зовнішнє джерело
  getField('d5t7')?.setText(`${data?.form
    ?.notPossibleStartEngine?.general || ''}`);
  getField('d5t8')?.setText(`${data?.form
    ?.notPossibleStartEngine?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.5 Додаткові електричні системи живлення спеціального устатковання мають
  // окремі запобіжники або відповідні електронні пристрої
  getField('d5t9')?.setText(`${data?.form
    ?.additionalElectricPowerSystems?.general || ''}`);
  getField('d5t10')?.setText(`${data?.form
    ?.additionalElectricPowerSystems?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.6 Кузов, елементи шасі не повинні використовуватись як “заземлення”
  // додаткових електричних систем
  getField('d5t11')?.setText(`${data?.form
    ?.bodyChassisElements?.general || ''}`);
  getField('d5t12')?.setText(`${data?.form
    ?.bodyChassisElements?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.7 Двері медичного салону зафіксовуються у відчиненому положенні,
  // аудіо- та (або) візуальний сигнал попереджає водія про відчинення
  // дверей медичного салону
  getField('d5t13')?.setText(`${data?.form
    ?.medicalSalonDoors?.general || ''}`);
  getField('d5t14')?.setText(`${data?.form
    ?.medicalSalonDoors?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.8 У систему вентилювання-обігрівання медичного салону не повинні
  // потрапляти спалини
  getField('d5t15')?.setText(`${data?.form
    ?.ventilationHeatingSystem?.general || ''}`);
  getField('d5t16')?.setText(`${data?.form
    ?.ventilationHeatingSystem?.code?.replace(rCode, 'НКН') || ''}`);

  form?.updateFieldAppearances(lFont);//nead to use cyrillic
  return pdfDoc || undefined;

};
