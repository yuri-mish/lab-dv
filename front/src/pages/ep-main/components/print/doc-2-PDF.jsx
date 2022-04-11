import file from 'moks/printPDFs/doc_2.pdf';

import { pdfBuilder } from './pdfBuilder';
export const modifyDoc2Pdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    rCode,
    getField = () => {},
  } = await pdfBuilder(file);

  // Додаток 2 до ПРОТОКОЛУ №
  getField('d2t0')?.setText(data?.docNumDate);
  getField('d2t0')?.updateAppearances(bFont);//nead to use cyrillic
  // 1.1. Наявні ліхтар “таксі”, сигнальні ліхтарі з світлофільтрами червоного і
  // зеленого кольорів, таксометр, інформаційні таблички про водія
  getField('d2t1')?.setText(`${data?.form
    ?.taxiLights?.general || ''}`);
  getField('d2t2')?.setText(`${data?.form
    ?.taxiLights?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.2. Таксометр і сигнальні вогні не вмикаються/вимикаються з місця водія
  getField('d2t3')?.setText(`${data?.form
    ?.taximeterSignalLights?.general || ''}`);
  getField('d2t4')?.setText(`${data?.form
    ?.taximeterSignalLights?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.3. Ліхтар «таксі» вмикається коли таксометр вимкнено та незалежно від
  // увімкнення інших світлових приладів
  getField('d2t5')?.setText(`${data?.form
    ?.taxiLantern?.general || ''}`);
  getField('d2t6')?.setText(`${data?.form
    ?.taxiLantern?.code?.replace(rCode, 'НКН') || ''}`);
  // Примітка
  getField('d2t7')?.setText(`${data?.note || ''}`);

  form.updateFieldAppearances(lFont);//nead to use cyrillic
  return pdfDoc || undefined;

};
