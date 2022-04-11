import file from 'moks/printPDFs/doc_4.pdf';
import { pdfBuilder } from './pdfBuilder';
export const modifyDoc4Pdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    rCode,
    getField = () => {},
  } = await pdfBuilder(file);
  // Додаток 4 до ПРОТОКОЛУ №
  getField('d4t0')?.setText(data?.docNumDate);
  getField('d4t0')?.updateAppearances(bFont);//nead to use cyrillic
  // 1.1 Наявний відповідний розпізнавальний знак "Учбовий транспортний засіб"
  getField('d4t1')?.setText(`${data?.additionalChecking
    ?.trainingVehicleMark?.general || ''}`);
  getField('d4t2')?.setText(`${data?.additionalChecking
    ?.trainingVehicleMark?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.2 Наявне обладнане місце для спеціаліста з підготовки до керування
  // транспортним засобом
  getField('d4t3')?.setText(`${data?.additionalChecking
    ?.trainingSpecialistPlace?.general || ''}`);
  getField('d4t4')?.setText(`${data?.additionalChecking
    ?.trainingSpecialistPlace?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.3 Наявні додаткові дзеркала заднього виду
  getField('d4t5')?.setText(`${data?.additionalChecking
    ?.additionalRearViewMirrors?.general || ''}`);
  getField('d4t6')?.setText(`${data?.additionalChecking
    ?.additionalRearViewMirrors?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.4 Наявні додаткові педалі зчеплення (за наявності основної педалі
  // зчеплення) і гальмування
  getField('d4t7')?.setText(`${data?.additionalChecking
    ?.additionalClutchBrakingPedals?.general || ''}`);
  getField('d4t8')?.setText(`${data?.additionalChecking
    ?.additionalClutchBrakingPedals?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.5 Дублюючі механізми органів управління гальмовою системою та трансмісією
  // (педалі, важелі тощо) установлені в зоні дії ніг спеціаліста з підготовки
  // до керування транспортним засобом без порушень ергономічних вимог та не
  // перешкоджають водію натискати на основні педалі
  getField('d4t9')?.setText(`${data?.additionalChecking
    ?.duplicateMechanismsControls?.general || ''}`);
  getField('d4t10')?.setText(`${data?.additionalChecking
    ?.duplicateMechanismsControls?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.6 Осьовий люфт у шарнірах механізмів дублюючих педалей
  // не перевищує 0,3 мм
  getField('d4t11')?.setText(`${data?.additionalChecking
    ?.axialPlay?.general || ''}`);
  getField('d4t12')?.setText(`${data?.additionalChecking
    ?.axialPlay?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.7 Дублюючі педалі повторюють положення основних педалей
  getField('d4t13')?.setText(`${data?.additionalChecking
    ?.duplicatePedals?.general || ''}`);
  getField('d4t14')?.setText(`${data?.additionalChecking
    ?.duplicatePedals?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.8 Зусилля на педалях дублюючих механізмів не повинно перевищувати 147,1 Н
  getField('d4t15')?.setText(`${data?.additionalChecking
    ?.effortsPedalsDuplicatingMechanisms?.general || ''}`);
  getField('d4t16')?.setText(`${data?.additionalChecking
    ?.effortsPedalsDuplicatingMechanisms?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.9 Дублюючі механізми органів управління гальмовою системою та трансмісією
  // не повинні змінювати зусилля спрацювання основних педалей більше
  // ніж на 5 відсотків.
  getField('d4t17')?.setText(`${data?.additionalChecking
    ?.duplicateBrakeControlSystems?.general || ''}`);
  getField('d4t18')?.setText(`${data?.additionalChecking
    ?.duplicateBrakeControlSystems?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.10 Дублюючі механізми повинні забезпечувати повний і вільний хід основних
  // педалей та не дозволяти повному виключенню зчеплення та роботи приводу
  // гальмових механізмів незалежно від водія; конструкція дублюючих механізмів
  // не повинно призводити до заїдання чи самовільного спрацювання; дублюючі
  // механізми не перешкоджають спрацюванню інших органів управління
  // транспортним засобом та не призводять до пошкодження (відсутні обриви
  // проводів рухомими деталями, відсутні труднощі повертання керма та подання
  // звукового сигналу, переключення передач тощо)
  getField('d4t19')?.setText(`${data?.additionalChecking
    ?.duplicateMechanismsMainPedals?.general || ''}`);
  getField('d4t20')?.setText(`${data?.additionalChecking
    ?.duplicateMechanismsMainPedals?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.0 Наявний зафіксований ручний привід акселератора постійної дії
  // (у вигляді важелів або кільця на кермі (поза кермом: збоку чи під ним);
  // ручний привід акселератора, установлений на кермі, не повинен призводити
  // до збільшення зусилля обертання керма
  getField('d4t21')?.setText(`${data?.additionalRequirements
    ?.fixedManualAcceleratorDrive?.general || ''}`);
  getField('d4t22')?.setText(`${data?.additionalRequirements
    ?.fixedManualAcceleratorDrive?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.1 Зусилля на ручному приводі акселератора не повинно перевищувати
  // 19,6 - 29,4 Н на кожному важелі за умови одночасного натискання,
  // 29,4- 39,2Н на кільці та 49 Н на фіксованому приводі
  getField('d4t23')?.setText(`${data?.additionalRequirements
    ?.effortManualAcceleratorDrive?.general || ''}`);
  getField('d4t24')?.setText(`${data?.additionalRequirements
    ?.effortManualAcceleratorDrive?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.2 Величина ходу ручного приводу акселератора повинна не перевищувати
  // 50-65 мм для важелів на кермі та 45-55 мм для кільця
  getField('d4t25')?.setText(`${data?.additionalRequirements
    ?.magnitudeStrokeAccelerator?.general || ''}`);
  getField('d4t26')?.setText(`${data?.additionalRequirements
    ?.magnitudeStrokeAccelerator?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.3 Конструкція ручного приводу акселератора повинна забезпечувати його
  // роботу в повному діапазоні повороту колеса керма
  getField('d4t27')?.setText(`${data?.additionalRequirements
    ?.provideAcceleratorTurning?.general || ''}`);
  getField('d4t28')?.setText(`${data?.additionalRequirements
    ?.provideAcceleratorTurning?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.4 Елементи ручних приводів органів управління транспортних засобів
  // повинні мати не гострі краї та не виступаюти за площину колеса керма
  // (крім акселератора на кермі)
  getField('d4t29')?.setText(`${data?.additionalRequirements
    ?.notSharpManualElements?.general || ''}`);
  getField('d4t30')?.setText(`${data?.additionalRequirements
    ?.notSharpManualElements?.code?.replace(rCode, 'НКН') || ''}`);

  form?.updateFieldAppearances(lFont);//nead to use cyrillic
  return pdfDoc || undefined;

};
