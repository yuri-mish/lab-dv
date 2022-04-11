import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Button } from 'devextreme-react/button';

import file from 'moks/printPDFs/tachograph.pdf';

import { dateShortFormatD } from 'utils/date-formats';

import { pdfBuilder } from './pdfBuilder';
/* eslint-disable sonarjs/cognitive-complexity */
export const modifyPdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    getField = () => {},
  } = await pdfBuilder(file);
  // Ідентифікаційний номер UA ____ N_________   №
  getField('draft')?.setText(data?.draft ? 'Чорновик !!!' : '');
  getField('draft')?.updateAppearances(bFont);
  const docNum = `${(data?.number_tachograph_service || '') +
    (data?.number_doc?.replace('ДА', '') || '') }-${dayjs(data?.date)
      .format('YY') || ''} ` || '';
  const docDate = `${dayjs(data?.date).format(dateShortFormatD) || ''} року`;
  getField('t0')?.setText(docNum);
  getField('t1')?.setText(docDate);
  let checkingText = '';
  data?.checking_by_using?.forEach((item) => {
    checkingText += `${item};\n`;
  });
  // 1. Найменування та місцезнаходження пункту сервісу тахографів
  getField('t2')?.setText(data?.tachograph_service || '');
  // 2. Порядковий номер пункту сервісу тахографів
  getField('t3')?.setText(data?.number_tachograph_service || '');
  // 3. Номер картки майстерні (у разі обслуговування цифрових тахографів)
  getField('t4')?.setText(data?.workshop_card || '');
  // 4. Найменування (прізвище, ім'я, по батькові) автомобільного перевізника
  getField('t5')?.setText(data?.partner?.name || '');
  // уповноважена особа (прізвище, ім'я, по батькові)
  getField('t6')?.setText(data?.authorized_person || '');
  // 5. Дані транспортного засобу:
  // 1) марка, модель, рік випуску
  let tCarInfo = data?.car_brand ? (`${data?.car_brand },\t`) : '';
  tCarInfo += data?.car_model ? (`${data?.car_model },\t`) : '';
  tCarInfo += data?.manufacture_date ?
    dayjs(data?.manufacture_date)?.format('YYYY') : '';
  getField('t7')?.setText(tCarInfo);
  // 2) реєстраційний номер транспортного засобу (VRN)
  getField('t8')?.setText(data?.car_number || '');
  // 3) ідентифікаційний номер (VIN)
  getField('t9')?.setText(data?.vin || '');
  // 6. Дані тахографа:
  // 1) марка, модель
  getField('t10')?.setText(data?.tachograph_model || '');
  // 2) тип
  getField('t11')?.setText(data?.tachograph_type || '');
  // 3) виробник
  getField('t12')?.setText(data?.tachograph_maker || '');
  // 4) заводський номер
  getField('t13')?.setText(data?.tachograph_factory_number || '');
  // 5) дата виготовлення
  getField('t14')?.setText(data?.tachograph_manufacture_date ?
    dayjs(data?.tachograph_manufacture_date)?.format(dateShortFormatD) : '');
  // 6) підстава для перевірки та адаптації
  getField('t15')?.setText(data?.reason_to_check || '');
  // 7) дата попередньої перевірки та адаптаці
  getField('t16')?.setText(data?.previous_check_date ?
    dayjs(data?.previous_check_date)?.format('YYYY') : '');
  // UA(2) - "Пункт попередньої перевірки"
  getField('t17')?.setText(data?.previous_tachograph_service || '');

  // 7. Перевірка та адаптація тахографа до транспортного засобу здійснюються
  getField('t18')?.setText(checkingText);

  // Результати перевірки та адаптації тахографа
  // 1
  getField('t19')?.setText(`${data?.checking_adaptation?.mileage_before || ''
     } / ${ data?.checking_adaptation?.mileage_after || ''}`);
  // 2
  getField('t20')?.setText(data?.checking_adaptation?.tires_size || '');
  // 3
  getField('t21')?.setText(data?.checking_adaptation?.tires_pressure || '');
  // 4
  getField('t22')?.setText(data?.checking_adaptation?.effective_length || '');
  // 5
  getField('t23')?.setText(data?.checking_adaptation?.coefficient || '');
  // 6
  getField('t24')?.setText(data?.checking_adaptation
    ?.tachograph_constant || '');
  // 7
  getField('t25')?.setText(`${data?.rejection_path?.after_installation || ''
    } / ${data?.rejection_path?.in_exploitation || ''}`);
  // 8
  getField('t26')?.setText(
    `${data?.registration_speed?.after_installation || ''
    } / ${data?.registration_speed?.in_exploitation || ''}`);
  // 9
  getField('t27')?.setText(`${data?.deviation_time?.after_installation2 || ''
    } / ${data?.deviation_time?.in_exploitation2 || ''}`);
  getField('t27_2')?.setText(`
    ${data?.deviation_time?.after_installation10 || ''
    } / ${data?.deviation_time?.in_exploitation10 || ''}`);
  // 10
  getField('t28')?.setText(data?.deviation_time?.speed_limiter || '');
  // 11
  getField('t29')?.setText(data?.deviation_time?.opening || '');
  // 12
  getField('t30')?.setText(data?.deviation_time?.power_off || '');
  // 13
  getField('t31')?.setText(data?.deviation_time?.pulse_sensor || '');
  // 10. Роботи виконав
  getField('t32')?.setText(data?.worker_position || '');
  getField('t33')?.setText(data?.worker_name || '');
  // 11. Підтверджую, що я
  getField('t34')?.setText(data?.authorized_person || '');
  // Претензій(ї) до виконаних робіт
  getField('t35')?.setText(data?.dont_have_claims || '');

  form?.updateFieldAppearances(lFont);//nead to use cyrillic

  const savePdfBytes = await pdfDoc?.save();
  const filePDF = new Blob([ savePdfBytes ], { type: 'application/pdf' });
  const fileURL = URL.createObjectURL(filePDF);
  window.open(fileURL, '_blank ');

};

export const PrintTahoPDFbtn = ({
  data = {},
  handlePdfLoading = () => {},
  ...props
}) => {
  const handleClick = async () => {
    handlePdfLoading(true);
    try {
      await modifyPdf(data);
    } catch (e) {
      console.log('error', e);
    }
    handlePdfLoading(false);
  };
  return (
    <div>
      <Button {...props} ref={props?.forwardedRef} icon="print" text="Друк"
        onClick={handleClick} />
    </div>
  );
};
PrintTahoPDFbtn.propTypes = {
  data: PropTypes.object,
  handlePdfLoading: PropTypes.func,
  forwardedRef: PropTypes.any,
};
export default PrintTahoPDFbtn;
