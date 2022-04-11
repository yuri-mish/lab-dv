import file from 'moks/printPDFs/doc_7.pdf';

import codesData from 'moks/codesData.json';
import { pdfBuilder } from './pdfBuilder';

export const doc7Pdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    rCode,
    getField = () => {},
  } = await pdfBuilder(file);
  const { codes_mismatch } = data;
  const codes = codes_mismatch?.replaceAll('; ', ';')?.slice(0, -1)
    ?.split(';') || [];
  const uniqCodes = [ ...new Set(codes) ];

  const tHeight = lFont.heightAtSize(10) + 1.5;
  const checkHeight = [ 665, 700 ];
  let calcHeight = 0;
  let checkIndex = 0;
  let codesToPDF = '';
  let codesField = 1;
  let codesNoAdd = true;
  uniqCodes.forEach((item, index) => {
    // if (index === 0) codesToPDF += `• НКН\t - \t${rCode}\n\n`;
    const tAdd = `• ${item}\t - \t${codesData[item]?.text || ''}\n\n`;
    const corectNum = parseInt(lFont.widthOfTextAtSize(tAdd, 10) / 520);
    if (item !== rCode) {
      calcHeight += tHeight * corectNum;
      calcHeight += tHeight * 2;
      if (calcHeight < checkHeight[checkIndex]) {
        codesToPDF += tAdd;
      } else if (checkIndex === 0) {
        getField('codes')?.setText(codesToPDF);
        codesNoAdd = false;
        calcHeight = 0;
        codesToPDF = tAdd;
        checkIndex = 1;
      }
      if ((calcHeight >= checkHeight[checkIndex] && checkIndex === 1) ||
        (checkIndex === 1 && index === uniqCodes.length - 1)) {
        ++codesField;
        const page = pdfDoc.addPage();
        form.createTextField(`codes${codesField}`);
        getField(`codes${codesField}`)?.setText(codesToPDF);
        getField(`codes${codesField}`)?.addToPage(page, {
          x: 40,
          y: 40,
          width: 520,
          height: 760,
          borderWidth: 0,
          font: lFont,
        });
        getField(`codes${codesField}`)?.enableReadOnly();
        getField(`codes${codesField}`)?.enableMultiline();
        getField(`codes${codesField}`)?.setFontSize(10);
        calcHeight = 0;
        codesToPDF = tAdd;
      }
    }
  });
  codesNoAdd && getField('codes')?.setText(codesToPDF);

  // Додаток 7 до ПРОТОКОЛУ №
  getField('d7t0')?.setText(data?.docNumDate);
  getField('d7t0')?.updateAppearances(bFont);//nead to use cyrillic

  form?.updateFieldAppearances(lFont);//nead to use cyrillic
  await pdfDoc?.save();
  return pdfDoc || undefined;

};
