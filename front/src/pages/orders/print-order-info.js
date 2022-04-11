import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export const openOrderInfo = async (data) => {
  const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
  const fontBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.create();

  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage();

  const size = 25;
  const x = 60;
  const textProps = { x, size, font: customFont, color: rgb(0, 0, 0) };
  const delta = 40;
  const top = 780;

  const docNumber = data.number_doc.replace(/^_+/, '');

  page.drawText(
    `Замовлення: ${docNumber}`, { y: top, ...textProps },
  );
  page.drawText(
    `Cyма: ${data.doc_amount} грн`, { y: top - delta, ...textProps },
  );
  page.drawText(
    `Тип: ${data.type || '-'}`, { y: top - (2 * delta), ...textProps },
  );
  page.drawText(
    `Телефон: ${data.ClientPersonPhone || '-'}`,
    { y: top - (3 * delta), ...textProps },
  );
  page.drawText(
    `ФИО: ${data.ClientPerson || '-'}`, { y: top - (4 * delta), ...textProps },
  );
  page.drawText(
    `Номенклатура: ${data.serviceList || '-'}`,
    { y: top - (5 * delta), ...textProps },
  );

  const pdfBytes = await pdfDoc.save();
  const filePDF =
    new Blob([ pdfBytes ], { type: 'application/pdf' });
  const fileURL = URL?.createObjectURL(filePDF);
  window.open(fileURL, '_blank');
};

