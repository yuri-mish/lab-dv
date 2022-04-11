import PropTypes from 'prop-types';

import { PDFDocument } from 'pdf-lib';
// https://pdf-lib.js.org/ - документація по бібліотеці
import fontkit from '@pdf-lib/fontkit';

import font from 'moks/printPDFs/fonts/LiberationSerif-Regular.ttf';
import fontBold from 'moks/printPDFs/fonts/LiberationSerif-Bold.ttf';

export const pdfBuilder = async (file) => {
  const pdfBytes = await fetch(file).then((res) => res.arrayBuffer())
    .catch((e) => console.log('pdf Error', e));
  const pdfDoc = await PDFDocument?.load(pdfBytes);
  pdfDoc?.registerFontkit(fontkit);
  const myFont = await fetch(font).then((res) => res.arrayBuffer())
    .catch((e) => console.log('pdf Error', e));
  const myBoldFont = await fetch(fontBold).then((res) => res.arrayBuffer())
    .catch((e) => console.log('pdf Error', e));

  const lFont = await pdfDoc?.embedFont(myFont);
  const bFont = await pdfDoc?.embedFont(myBoldFont);
  const form = pdfDoc?.getForm();
  const rCode = 'Непередбачені кодами несправності';

  const getField = (fildName) => {
    try {
      return form?.getTextField(fildName);
    } catch {
      return undefined;
    }
  };
  const copyPages = (res) => {
    const pages = res?.getPages();
    pages?.forEach(async (_, index) => {
      const [ cPage ] = await pdfDoc.copyPages(res, [ index ]);
      pdfDoc?.addPage(cPage);
    });
  };

  return (
    {
      pdfDoc,
      lFont,
      bFont,
      form,
      rCode,
      getField,
      copyPages,
    }
  );
};

pdfBuilder.propTypes = {
  file: PropTypes.any,
};
export default pdfBuilder;
