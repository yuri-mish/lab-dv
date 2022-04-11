import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Button } from 'devextreme-react/button';
import { doc7Pdf } from './doc-7-PDF';

import file from 'moks/printPDFs/CO2.pdf';

import { dateShortFormatD } from 'utils/date-formats';

import { pdfBuilder } from './pdfBuilder';
import {
  showError,
} from 'utils/notify.js';

export const smokybBurns = ({ data = {},
  getField = () => {}, rCode, bFont }) => {
  // 6.1 Димність спалин дизелів, газодизелів
  if (data?.fuel_type === 'Дизель' || data?.fuel_type === 'Газ-Дизель') {
    getField('t22')?.setText(`${data?.co2_environmental_impact
      ?.contentCarbonsBurns?.km1?.first || ''}`);
    getField('t23')?.setText(`${data?.co2_environmental_impact
      ?.contentCarbonsBurns?.km1?.second || ''}`);
    getField('t24')?.setText(`${data?.co2_environmental_impact
      ?.contentCarbonsBurns?.km1?.third || ''}`);
    getField('t25')?.setText(`${data?.co2_environmental_impact
      ?.contentCarbonsBurns?.km1?.fourth || ''}`);
    getField('t26')?.setText(`${data?.co2_environmental_impact
      ?.contentCarbonsBurns?.averageKM1 || ''}`);
    getField('t27')?.setText(`${data?.co2_environmental_impact
      ?.contentCarbonsBurns?.engineKTZValue?.value || ''}`);
    getField('t28')?.setText(`${data?.co2_environmental_impact
      ?.contentCarbonsBurns?.engineKTZValue?.general || ''}`);
    getField('t28')?.updateAppearances(bFont);
    getField('t29')?.setText(`${data?.co2_environmental_impact
      ?.contentCarbonsBurns?.engineKTZValue
      ?.code?.replace(rCode, 'НКН') || ''}`);
    getField('t29')?.updateAppearances(bFont);
  }

  // 6.2 Концентрація оксиду вуглецю, вуглеводнів у спалинах ТЗ з двигунами,
  // що живляться бензином або газовим паливом

  // Бензин Не обладнаний
  if (data?.fuel_type === 'Бензин' &&
    data?.co2_environmental_impact?.concentrationCO2
      ?.fuel?.neutralization === 'Не обладнаний') {
    getField('t30')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.contentCO?.resultNMin || ''}`);
    getField('t31')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.contentCO?.resultNPidv || ''}`);
    getField('t32')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.contentCH?.resultNMin || ''}`);
    getField('t33')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.contentCH?.resultNPidv || ''}`);
    getField('t34')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.resultNMin || ''}`);
    getField('t35')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.resultNPidv || ''}`);
    getField('t54')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.code?.replace(rCode, 'НКН') || ''}`);
    getField('t54')?.updateAppearances(bFont);
  }

  // ГАЗ (СПГ або ЗНГ)
  if (data?.fuel_type === 'Газ' || data?.fuel_type === 'Газ-Бензин') {
    getField('t36')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.contentCO?.resultNMin || ''}`);
    getField('t37')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.contentCO?.resultNPidv || ''}`);
    getField('t38')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.contentCH?.resultNMin || ''}`);
    getField('t39')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.contentCH?.resultNPidv || ''}`);
    getField('t40')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.resultNMin || ''}`);
    getField('t41')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.resultNPidv || ''}`);
    getField('t54')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.code?.replace(rCode, 'НКН') || ''}`);
    getField('t54')?.updateAppearances(bFont);
  }
  // Бензин Обладнаний
  if (data?.fuel_type === 'Бензин' &&
    data?.co2_environmental_impact?.concentrationCO2
      ?.fuel?.neutralization === 'Обладнаний') {
    getField('t42')?.setText(`${data?.co2_environmental_impact
      ?.concentrationCO2?.contentCO?.resultNMin || ''}`);
    getField('t43')?.setText(`${data?.co2_environmental_impact
      ?.concentrationCO2?.contentCO?.resultNPidv || ''}`);
    getField('t44')?.setText(`${data?.co2_environmental_impact
      ?.concentrationCO2?.contentCH?.resultNMin || ''}`);
    getField('t45')?.setText(`${data?.co2_environmental_impact
      ?.concentrationCO2?.contentCH?.resultNPidv || ''}`);
    getField('t46')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.resultNMin || ''}`);
    getField('t47')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.resultNPidv || ''}`);
    getField('t54')?.setText(`${data?.co2_environmental_impact?.concentrationCO2
      ?.noteInconsistency?.code?.replace(rCode, 'НКН') || ''}`);
    getField('t54')?.updateAppearances(bFont);
  }
};
export const modifyPdf = async (data = {}) => {
  const {
    pdfDoc, // загружений pdf документ
    lFont, // шрифт для кирилиці
    bFont, // шрифт для кирилиці
    form, // форма pdf файлу
    rCode, // 'Непередбачені кодами несправності'- строка для заміни тексту на
    getField = () => {}, //функція отриманя поля форми pdf файла
    copyPages = () => {}, //функція копіювання сторінок з іншого pdf файлу
  } = await pdfBuilder(file);
  // отримуємо функції\обекти для запису даних в pdf
  // ПРОТОКОЛ ВИПРОБУВАННЯ №
  const docNumDate = `${(data?.suffix || '') +
    (data?.number_doc?.replace('ДА', '') || '') } - ВІД ${
    dayjs(data?.date).format(dateShortFormatD)}` || '';
  // отримуємо поле форми самого пдф файлу "t0" записуємо туди сформовану строку
  getField('t0')?.setText(docNumDate);
  // встановлюємо кириличний шрифт для поля форми "t0"
  getField('t0')?.updateAppearances(bFont);//nead to use cyrillic
  getField('draft')?.setText(data?.draft ? 'Чорновик !!!' : '');
  getField('draft')?.updateAppearances(bFont);
  // Номер у реєстрі суб’єктів ОТК
  getField('t1')?.setText(`${data?.suffix || ''}`);
  // Місце проведення
  getField('t2')?.setText(`${data?.city || ''}`);
  //Назва юридичної особи
  getField('t3')?.setText(`${data?.partner_to_print || ''}`);

  // VIN (№ рами)
  data?.vin?.split('').forEach((element, index) => {
    getField(`v${index}`)?.setText(element || '');
  });

  // Категорія КТЗ
  getField('t4')?.setText(`${data?.np_text || ''}`);
  getField('t4')?.updateAppearances(bFont);
  // Марка, модель
  getField('t5')?.setText(`${data?.car_brand || ''}, 
  ${data?.car_model || ''}`);
  // Державний реєстраційний номер
  getField('t6')?.setText(`${data?.car_number || ''}`);
  // Показник одометра (км)
  getField('t7')?.setText(`${data?.odometer || ''}`);
  // Тип палива
  getField('t8')?.setText(`${data?.fuel_type || ''}`);

  // Наявність турбіни чи компресора
  getField('t9')?.setText(`${data?.turbine_compressor || ''}`);

  // Дата виготовлення
  data?.manufacture_date && getField('t10')
    ?.setText(`${dayjs(data?.manufacture_date)?.format('YYYY') || ''}`);

  // Дата останньої державної реєстрації
  data?.last_registration_date && getField('t11')?.setText(
    `${dayjs(data?.last_registration_date)?.format(dateShortFormatD) || ''}`);

  // Дата і номер документа, яким переобладнання погоджено
  data?.re_equipment_date && getField('t12')
    ?.setText(`${dayjs(data?.re_equipment_date)?.format(dateShortFormatD) || ''
    } ${data?.re_equipment_doc_number || ''} ${data?.re_equipment_name || ''}`);
  // Суть переобладнання
  getField('t13')?.setText(`${data?.re_equipment_description || ''}`);

  // Кількість циліндрів
  getField('t14')?.setText(`${data?.cylinders || ''}`);

  // Екологічний рівень
  getField('t15')?.setText(`${data?.ecological || ''}`);

  // Колір
  getField('t16')?.setText(`${data?.car_color || ''}`);

  // Призначення
  // getField('t17')?.setText(`${data?.purpose || ''}`);

  // t18 код невідповідності
  // Температура повітря, °С
  getField('t19')?.setText(`${data?.air_temperature || ''}`);
  // Вологість, %
  getField('t20')?.setText(`${data?.humidity || ''}`);
  // Атмосферний тиск, кПа
  getField('t21')?.setText(`${data?.atmospheric_pressure || ''}`);

  // 5.12 Чинники, характеристики негативного впливу
  // на навколишнє природне середовище
  // 6. Вміст у спалинах оксиду вуглецю, вуглеводнів та димність спалин
  smokybBurns({ data, getField, rCode, bFont });

  // 7. Перевірку провели
  getField('t48')?.setText(`${data?.inspector_1_position || ''}`);
  getField('t49')?.setText(`${data?.inspector_1_name || ''}`);
  getField('t51')?.setText(`${data?.inspector_2_name || ''}`);
  getField('t50')?.setText(`${data?.inspector_2_position || ''}`);
  getField('t52')?.setText(`${data?.inspector_3_position || ''}`);
  getField('t53')?.setText(`${data?.inspector_3_name || ''}`);

  // 8 Висновок
  getField('res')?.setText(`${data
    ?.conclusion ? 'Відповідає' : 'Не відповідає'}`);
  getField('res')?.updateAppearances(bFont);
  if (data?.codes_mismatch) {
    const doc7 = await doc7Pdf({ docNumDate,
      codes_mismatch: data?.codes_mismatch });
    await copyPages(doc7);
  }

  form?.updateFieldAppearances(lFont);//nead to use cyrillic
  const savePdfBytes = await pdfDoc?.save();
  const filePDF =
    new Blob([ savePdfBytes ], { type: 'application/pdf' });
  const fileURL = URL?.createObjectURL(filePDF);
  window.open(fileURL, '_blank');

};

export const PrintCO2btn = ({
  data = {},
  handlePdfLoading = () => {},
  ...props
}) => {
  const handleClick = async () => {
    handlePdfLoading(true);
    try {
      await modifyPdf(data);
    } catch (e) {
      showError(e);
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


PrintCO2btn.propTypes = {
  data: PropTypes.object,
  handlePdfLoading: PropTypes.func,
  forwardedRef: PropTypes.any,
};
export default PrintCO2btn;
