import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Button } from 'devextreme-react/button';
import { modifyDoc1Pdf } from './doc-1-PDF';
import { modifyDoc2Pdf } from './doc-2-PDF';
import { modifyDoc3Pdf } from './doc-3-PDF';
import { modifyDoc4Pdf } from './doc-4-PDF';
import { modifyDoc5Pdf } from './doc-5-PDF';
import { modifyDoc6Pdf } from './doc-6-PDF';
import { doc7Pdf } from './doc-7-PDF';


import file from 'moks/printPDFs/OTK_base.pdf';

import { checkDate } from 'moks/moksData';
import { dateShortFormatD } from 'utils/date-formats';

import { pdfBuilder } from './pdfBuilder';
/* eslint-disable sonarjs/cognitive-complexity */
export const modifyPdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    rCode,
    getField = () => {},
    copyPages = () => {},
  } = await pdfBuilder(file);
  const isBefore = dayjs(data?.first_registration_date)?.isBefore(checkDate);

  // ПРОТОКОЛ ВИПРОБУВАННЯ №
  const docNumDate = `${(data?.suffix || '') +
    (data?.number_doc?.replace('ДА', '') || '') } - ВІД ${
    dayjs(data?.date).format(dateShortFormatD)}` || '';
  getField('t0')?.setText(docNumDate);
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
  data?.registration_date && getField('t11')?.setText(
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

  // // Призначення Таксі
  // getField('t17')?.setText(`${data?.for_taxi ? 'ТАК' : 'НІ'}`);
  // getField('t17')?.updateAppearances(bFont);
  // // Призначення Для перевезення небезпечних вантажів
  // getField('t18')?.setText(`${data?.for_dangerous ? 'ТАК' : 'НІ'}`);
  // getField('t18')?.updateAppearances(bFont);
  // Призначення
  getField('t17')?.setText(`${data?.purpose || ''}`);

  // Температура повітря, °С
  getField('t20')?.setText(`${data?.air_temperature || ''}`);
  // Вологість, %
  getField('t21')?.setText(`${data?.humidity || ''}`);
  // Атмосферний тиск, кПа
  getField('t22')?.setText(`${data?.atmospheric_pressure || ''}`);

  // 5.1 Загальні характеристики технічного стану ТЗ та його складників
  // 5.1.1 Пасажировмісність
  getField('t23')
    ?.setText(`${data?.general_characteristics
      ?.passengerCapacity?.general || ''}`);
  getField('t24')
    ?.setText(`${data?.general_characteristics
      ?.passengerCapacity?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t23')?.updateAppearances(bFont);
  getField('t24')?.updateAppearances(bFont);
  // 5.1.2 Розміщення, стан конструкції
  getField('t25')
    ?.setText(`${data?.general_characteristics
      ?.constructionState?.general || ''}`);
  getField('t26')
    ?.setText(`${data?.general_characteristics
      ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t25')?.updateAppearances(bFont);
  getField('t26')?.updateAppearances(bFont);

  // 5.1.3 Ремені безпеки водія та пасажира
  getField('t27')
    ?.setText(`${data?.general_characteristics
      ?.seatBelts?.general || ''}`);
  getField('t28')
    ?.setText(`${data?.general_characteristics
      ?.seatBelts?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t27')?.updateAppearances(bFont);
  getField('t28')?.updateAppearances(bFont);

  // 5.1.4 Замок кабіни, кузова
  getField('t29')
    ?.setText(`${data?.general_characteristics
      ?.bodyCabLock?.general || ''}`);
  getField('t30')
    ?.setText(`${data?.general_characteristics
      ?.bodyCabLock?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t29')?.updateAppearances(bFont);
  getField('t30')?.updateAppearances(bFont);

  // 5.1.5 Протизасліпний пристрій водія
  getField('t31')
    ?.setText(`${data?.general_characteristics
      ?.antiGlareDevices?.general || ''}`);
  getField('t32')
    ?.setText(`${data?.general_characteristics
      ?.antiGlareDevices?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t31')?.updateAppearances(bFont);
  getField('t32')?.updateAppearances(bFont);

  // 5.1.6 Пристрої перешкоджання
  getField('t33')
    ?.setText(`${data?.general_characteristics
      ?.obstacleDevices?.general || ''}`);
  getField('t34')
    ?.setText(`${data?.general_characteristics
      ?.obstacleDevices?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t33')?.updateAppearances(bFont);
  getField('t34')?.updateAppearances(bFont);

  // 5.1.7 Передній та задній бампери
  getField('t35')
    ?.setText(`${data?.general_characteristics
      ?.bumpers?.general || ''}`);
  getField('t36')
    ?.setText(`${data?.general_characteristics
      ?.bumpers?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t35')?.updateAppearances(bFont);
  getField('t36')?.updateAppearances(bFont);

  // 5.1.8 Складники, що не передбачені виробником
  getField('t37')
    ?.setText(`${data?.general_characteristics
      ?.unexpectedComponent?.general || ''}`);
  getField('t38')
    ?.setText(`${data?.general_characteristics
      ?.unexpectedComponent?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t37')?.updateAppearances(bFont);
  getField('t38')?.updateAppearances(bFont);

  // 5.2 Пневматичні шини
  // 5.2.1 Кількість і стан конструкції пневматичних шин
  getField('t39')
    ?.setText(`${data?.tyres_wheels?.pneumaticTires
      ?.quantityStateConstruction?.general || ''}`);
  getField('t40')
    ?.setText(`${data?.tyres_wheels?.pneumaticTires
      ?.quantityStateConstruction?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t39')?.updateAppearances(bFont);
  getField('t40')?.updateAppearances(bFont);
  // 5.2.2 Технічний стан пневматичних шин
  getField('t41')
    ?.setText(`${data?.tyres_wheels?.pneumaticTires
      ?.techState?.general || ''}`);
  getField('t42')
    ?.setText(`${data?.tyres_wheels?.pneumaticTires
      ?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t41')?.updateAppearances(bFont);
  getField('t42')?.updateAppearances(bFont);


  // 5.3 Висота рисунка протектора шин
  getField('t4_1')?.setText(`${data?.category_KTZ_text || ''}`);
  getField('t4_1')?.updateAppearances(bFont);
  // ???????????
  getField('t43')?.setText(`${data?.tyres_wheels
    ?.tyreTread?.tyreTread?.general || ''}`);
  getField('t44')
    ?.setText(`${data?.tyres_wheels
      ?.tyreTread?.tyreTread?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t44')?.updateAppearances(bFont);
  // 5.4 Тиск повітря в шинах на осях
  getField('t45')
    ?.setText(`${data?.tyres_wheels?.tyrePressure
      ?.firstAxis?.first || ''} / ${data?.tyres_wheels?.tyrePressure
        ?.firstAxis?.second || ''}`);
  getField('t46')
    ?.setText(`${data?.tyres_wheels?.tyrePressure
      ?.secondAxis?.first || ''} / ${data?.tyres_wheels?.tyrePressure
        ?.secondAxis?.second || ''}`);
  getField('t47')
    ?.setText(`${data?.tyres_wheels?.tyrePressure
      ?.thirdAxis?.first || ''} / ${data?.tyres_wheels?.tyrePressure
        ?.thirdAxis?.second || ''}`);
  getField('t48')
    ?.setText(`${data?.tyres_wheels?.tyrePressure
      ?.fourthAxis?.first || ''} / ${data?.tyres_wheels?.tyrePressure
        ?.fourthAxis?.second || ''}`);

  // 5.5 Колеса
  // 5.5.1 Кількість і стан конструкції коліс
  getField('t49')
    ?.setText(`${data?.tyres_wheels?.wheels
      ?.quantityStateConstruction?.general || ''}`);
  getField('t50')
    ?.setText(`${data?.tyres_wheels?.wheels
      ?.quantityStateConstruction?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t49')?.updateAppearances(bFont);
  getField('t50')?.updateAppearances(bFont);
  // 5.5.2 Технічний стан
  getField('t51')
    ?.setText(`${data?.tyres_wheels?.wheels
      ?.techState?.general || ''}`);
  getField('t52')
    ?.setText(`${data?.tyres_wheels?.wheels
      ?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t51')?.updateAppearances(bFont);
  getField('t52')?.updateAppearances(bFont);
  // 5.5.3 Затягнення болтів коліс
  getField('t53')
    ?.setText(`${data?.tyres_wheels?.wheels
      ?.tightening?.general || ''}`);
  getField('t54')
    ?.setText(`${data?.tyres_wheels?.wheels
      ?.tightening?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t53')?.updateAppearances(bFont);
  getField('t54')?.updateAppearances(bFont);

  // 5.6 Захисні пристрої
  // 5.6.1 Задній захисний пристрій
  getField('t55')
    ?.setText(`${data?.protective_devices?.form?.backProtectiveDevice
      ?.general || ''}`);
  getField('t56')
    ?.setText(`${data?.protective_devices?.form?.backProtectiveDevice
      ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t55')?.updateAppearances(bFont);
  getField('t56')?.updateAppearances(bFont);
  // 5.6.2 Бокові захисні пристрої
  getField('t57')
    ?.setText(`${data?.protective_devices?.form?.sideProtectiveDevices
      ?.general || ''}`);
  getField('t58')
    ?.setText(`${data?.protective_devices?.form?.sideProtectiveDevices
      ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t57')?.updateAppearances(bFont);
  getField('t58')?.updateAppearances(bFont);
  // 5.7 Стекла
  // 5.7.1 Відповідність конструкції с
  getField('t59')
    ?.setText(`${data?.windows_headlights?.windows?.designCompliance
      ?.general || ''}`);
  getField('t60')
    ?.setText(`${data?.windows_headlights?.windows?.designCompliance
      ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t59')?.updateAppearances(bFont);
  getField('t60')?.updateAppearances(bFont);
  // 5.7.2 Технічний стан
  getField('t61')
    ?.setText(`${data?.windows_headlights?.windows?.techState
      ?.general || ''}`);
  getField('t62')
    ?.setText(`${data?.windows_headlights?.windows?.techState
      ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t61')?.updateAppearances(bFont);
  getField('t62')?.updateAppearances(bFont);
  // Світлопропускання вітрового скла
  getField('t63')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionWindshield?.result || ''}`);
  getField('t64')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionWindshield?.general || ''}`);
  getField('t63')?.updateAppearances(bFont);
  getField('t64')?.updateAppearances(bFont);
  // Світлопропускання 1- го бокового лівого скла
  getField('t65')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionFirstLeftSideWindow?.result || ''}`);
  getField('t66')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionFirstLeftSideWindow?.general || ''}`);
  getField('t65')?.updateAppearances(bFont);
  getField('t66')?.updateAppearances(bFont);
  // Світлопропускання1- го бокового правого скла
  getField('t67')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionFirstRightSideWindow?.result || ''}`);
  getField('t68')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionFirstRightSideWindow?.general || ''}`);
  getField('t67')?.updateAppearances(bFont);
  getField('t68')?.updateAppearances(bFont);
  // Світлопропускання2-го бокового правого скла
  getField('t69')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionSecondRightSideWindow?.result || ''}`);
  getField('t70')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionSecondRightSideWindow?.general || ''}`);
  getField('t69')?.updateAppearances(bFont);
  getField('t70')?.updateAppearances(bFont);
  // Світлопропускання 2-го бокового лівого скла
  getField('t71')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionSecondLeftSideWindow?.result || ''}`);
  getField('t72')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionSecondLeftSideWindow?.general || ''}`);
  getField('t71')?.updateAppearances(bFont);
  getField('t72')?.updateAppearances(bFont);
  // **Світлопропускання заднього скла
  getField('t73')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionBackWindow?.result || ''}`);
  getField('t74')
    ?.setText(`${data?.windows_headlights?.checkedParams
      ?.lightTransmissionBackWindow?.general || ''}`);
  getField('t73')?.updateAppearances(bFont);
  getField('t74')?.updateAppearances(bFont);
  // 5.8 Зовнішні світлові прилади
  // Наявність, стан конструкції, функціональні можливості
  getField('t76')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.constructionState?.highBeamHeadlights?.general || ''}`);
  getField('t77')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.constructionState?.lowBeamHeadlights?.general || ''}`);
  getField('t78')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.constructionState?.frontFogLamp?.general || ''}`);
  getField('t76')?.updateAppearances(bFont);
  getField('t77')?.updateAppearances(bFont);
  getField('t78')?.updateAppearances(bFont);
  // Технічний стан
  getField('t79')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.techState?.highBeamHeadlights?.general || ''}`);
  getField('t80')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.techState?.lowBeamHeadlights?.general || ''}`);
  getField('t81')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.techState?.frontFogLamp?.general || ''}`);
  getField('t79')?.updateAppearances(bFont);
  getField('t80')?.updateAppearances(bFont);
  getField('t81')?.updateAppearances(bFont);
  // Відрегулювання напрямку поширення променів
  getField('t82')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.directionPropagationRays?.highBeamHeadlights?.general || ''}`);
  getField('t83')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.directionPropagationRays?.lowBeamHeadlights?.general || ''}`);
  getField('t84')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.directionPropagationRays?.frontFogLamp?.general || ''}`);
  getField('t82')?.updateAppearances(bFont);
  getField('t83')?.updateAppearances(bFont);
  getField('t84')?.updateAppearances(bFont);
  // Світлорозподіл
  getField('t85')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.lightDistribution?.highBeamHeadlights?.general || ''}`);
  getField('t86')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.lightDistribution?.lowBeamHeadlights?.general || ''}`);
  getField('t87')
    ?.setText(`${data?.windows_headlights?.externalLightingDevices
      ?.lightDistribution?.frontFogLamp?.general || ''}`);
  getField('t85')?.updateAppearances(bFont);
  getField('t86')?.updateAppearances(bFont);
  getField('t87')?.updateAppearances(bFont);
  // Сила світла, кд
  // дальнє світло
  getField('t88')?.setText(`${data?.windows_headlights?.lightPower
    ?.highBeamHeadlights || ''}`);
  // (протит. фари у т. О)
  getField('t89')?.setText(`${data?.windows_headlights?.lightPower
    ?.fogLamp?.left || ''}`);
  getField('t90')?.setText(`${data?.windows_headlights?.lightPower
    ?.fogLamp?.right || ''}`);
  // (ближнє світло у зоні інтенсивної освітленості)
  getField('t91')?.setText(`${data?.windows_headlights?.lightPower
    ?.lowBeamHeadlightsIntensiveZone?.left || ''}`);
  getField('t92')?.setText(`${data?.windows_headlights?.lightPower
    ?.lowBeamHeadlightsIntensiveZone?.right || ''}`);
  // (ближнє світло у зоні малої освітленості)
  getField('t93')?.setText(`${data?.windows_headlights?.lightPower
    ?.lowBeamHeadlightsSmallZone?.left || ''}`);
  getField('t94')?.setText(`${data?.windows_headlights?.lightPower
    ?.lowBeamHeadlightsSmallZone?.right || ''}`);
  // Код невідповідності
  getField('t95')?.setText(`${data?.windows_headlights?.lightPower
    ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t95')?.updateAppearances(bFont);
  // 5.8.2 Світлові сигнальні вогні
  // Передні покажчики поворотів
  getField('t96')?.setText(`${data?.windows_headlights?.lightSignals
    ?.frontTurnSignals?.general || ''}`);
  getField('t96')?.updateAppearances(bFont);
  // Бічні покажчики поворотів
  getField('t97')?.setText(`${data?.windows_headlights?.lightSignals
    ?.sideTurnSignals?.general || ''}`);
  getField('t97')?.updateAppearances(bFont);
  // Задні покажчики поворотів
  getField('t98')?.setText(`${data?.windows_headlights?.lightSignals
    ?.backTurnSignals?.general || ''}`);
  getField('t98')?.updateAppearances(bFont);
  // Сигнали гальмування
  getField('t99')?.setText(`${data?.windows_headlights?.lightSignals
    ?.brakingSignals?.general || ''}`);
  getField('t99')?.updateAppearances(bFont);
  // Сигнал гальмування додатковий
  getField('t100')?.setText(`${data?.windows_headlights?.lightSignals
    ?.additionalBrakingSignals?.general || ''}`);
  getField('t100')?.updateAppearances(bFont);
  // Передні габаритні ліхтарі
  getField('t101')?.setText(`${data?.windows_headlights?.lightSignals
    ?.frontPositionLights?.general || ''}`);
  getField('t101')?.updateAppearances(bFont);
  // Задні габаритні ліхтарі
  getField('t102')?.setText(`${data?.windows_headlights?.lightSignals
    ?.backPositionLights?.general || ''}`);
  getField('t102')?.updateAppearances(bFont);
  // Бокові габаритні ліхтарі 2
  getField('t103')?.setText(`${data?.windows_headlights?.lightSignals
    ?.sidePositionLights?.general || ''}`);
  getField('t103')?.updateAppearances(bFont);
  // Аварійна сигналізація
  getField('t104')?.setText(`${data?.windows_headlights?.lightSignals
    ?.warningSignals?.general || ''}`);
  getField('t104')?.updateAppearances(bFont);
  // Ліхтарі освітлення номер. знаку
  getField('t105')?.setText(`${data?.windows_headlights?.lightSignals
    ?.lightingLights?.general || ''}`);
  getField('t105')?.updateAppearances(bFont);
  // Задні протитуманні ліхтарі
  getField('t106')?.setText(`${data?.windows_headlights?.lightSignals
    ?.backFogLights?.general || ''}`);
  getField('t106')?.updateAppearances(bFont);
  // Передні протитуманні ліхтарі
  getField('t107')?.setText(`${data?.windows_headlights?.lightSignals
    ?.frontFogLights?.general || ''}`);
  getField('t107')?.updateAppearances(bFont);
  // Ліхтарі заднього ходу
  getField('t108')?.setText(`${data?.windows_headlights?.lightSignals
    ?.reversingLights?.general || ''}`);
  getField('t108')?.updateAppearances(bFont);
  // Світловідбивачі задні (нетрикутної форми)
  getField('t109')?.setText(`${data?.windows_headlights?.lightSignals
    ?.backReflectorsNotTriangular?.general || ''}`);
  getField('t109')?.updateAppearances(bFont);
  // Світловідбивачі передні (нетрикутної форми)
  getField('t110')?.setText(`${data?.windows_headlights?.lightSignals
    ?.frontReflectors?.general || ''}`);
  getField('t110')?.updateAppearances(bFont);
  // Світловідбивачі бокові 2
  getField('t111')?.setText(`${data?.windows_headlights?.lightSignals
    ?.sideReflectors?.general || ''}`);
  getField('t111')?.updateAppearances(bFont);
  // Світловідбивачі задні (трикутної форми)
  getField('t112')?.setText(`${data?.windows_headlights?.lightSignals
    ?.backReflectorsTriangular?.general || ''}`);
  getField('t112')?.updateAppearances(bFont);
  // Контурні вогні передні/задні
  getField('t113')?.setText(`${data?.windows_headlights?.lightSignals
    ?.contourLights?.general || ''}`);
  getField('t113')?.updateAppearances(bFont);
  // Частота миготіння показника повороту
  getField('t114')?.setText(`${data?.windows_headlights?.lightSignals
    ?.frequencyBlinking || ''}`);
  // Покажчики повороту з одного боку КТЗ
  getField('t115')?.setText(`${data?.windows_headlights?.lightSignals
    ?.turnSignalsOneSideKTZ?.general || ''}`);
  getField('t115')?.updateAppearances(bFont);
  // Аварійний сигнал
  getField('t116')?.setText(`${data?.windows_headlights?.lightSignals
    ?.emergencyAlert?.general || ''}`);
  getField('t116')?.updateAppearances(bFont);
  // Код невідповідності
  getField('t117')?.setText(`${data?.windows_headlights?.lightSignals
    ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t117')?.updateAppearances(bFont);
  // 5.9 Дзеркала, інші засоби заднього огляду
  // 5.9.1 Наявність, стан конструкції
  getField('t118')?.setText(`${data?.windows_headlights?.mirrorsDevices
    ?.constructionState?.general || ''}`);
  getField('t119')?.setText(`${data?.windows_headlights?.mirrorsDevices
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t118')?.updateAppearances(bFont);
  getField('t119')?.updateAppearances(bFont);
  // 5.9.2 Технічний стан
  getField('t120')?.setText(`${data?.windows_headlights?.mirrorsDevices
    ?.techState?.general || ''}`);
  getField('t121')?.setText(`${data?.windows_headlights?.mirrorsDevices
    ?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t120')?.updateAppearances(bFont);
  getField('t121')?.updateAppearances(bFont);
  // 5.10 Склоочисник та склоомивач
  // 5.10.1 Наявність, стан конструкції,
  getField('t122')?.setText(`${data?.windows_headlights?.windshieldWiper
    ?.constructionState?.general || ''}`);
  getField('t123')?.setText(`${data?.windows_headlights?.windshieldWiper
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t122')?.updateAppearances(bFont);
  getField('t123')?.updateAppearances(bFont);
  // 5.10.2 Технічний стан
  getField('t124')?.setText(`${data?.windows_headlights?.windshieldWiper
    ?.techState?.general || ''}`);
  getField('t125')?.setText(`${data?.windows_headlights?.windshieldWiper
    ?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t124')?.updateAppearances(bFont);
  getField('t125')?.updateAppearances(bFont);
  // Частота переміщення щіток по мокрому склу в режимі максимальної швидкості
  getField('t126')?.setText(`${data?.windows_headlights?.windshieldWiper
    ?.movingFrequency?.result || ''}`);
  getField('t127')?.setText(`${data?.windows_headlights?.windshieldWiper
    ?.movingFrequency?.general || ''}`);
  getField('t128')?.setText(`${data?.windows_headlights?.windshieldWiper
    ?.movingFrequency?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t127')?.updateAppearances(bFont);
  getField('t128')?.updateAppearances(bFont);
  // 5.11 Двигун та його системи
  // 5.11.1 Стан конструкції, функціональні можливості
  getField('t129')?.setText(`${data?.engine_systems?.constructionState
    ?.general || ''}`);
  getField('t130')?.setText(`${data?.engine_systems?.constructionState
    ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t129')?.updateAppearances(bFont);
  getField('t130')?.updateAppearances(bFont);
  // 5.11.2 Технічний стан
  getField('t131')?.setText(`${data?.engine_systems?.techState
    ?.general || ''}`);
  getField('t132')?.setText(`${data?.engine_systems?.techState
    ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t131')?.updateAppearances(bFont);
  getField('t132')?.updateAppearances(bFont);
  // 5.11.3 Витоки експлуатаційних рідин
  getField('t133')?.setText(`${data?.engine_systems?.operationSubstances
    ?.general || ''}`);
  getField('t134')?.setText(`${data?.engine_systems?.operationSubstances
    ?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t133')?.updateAppearances(bFont);
  getField('t134')?.updateAppearances(bFont);
  // 5.12 Чинники, характеристики негативного впливу
  // на навколишнє природне середовище
  // 5.12.1 Вміст у спалинах оксиду вуглецю, вуглеводнів та димність спалин
  if (data?.fuel_type === 'Дизель' || data?.fuel_type === 'Газ-Дизель') {
    getField('t135')?.setText(`${data?.environmental_impact?.contentCarbonsBurns
      ?.km1?.first || ''}`);
    getField('t136')?.setText(`${data?.environmental_impact?.contentCarbonsBurns
      ?.km1?.second || ''}`);
    getField('t137')?.setText(`${data?.environmental_impact?.contentCarbonsBurns
      ?.km1?.third || ''}`);
    getField('t138')?.setText(`${data?.environmental_impact?.contentCarbonsBurns
      ?.km1?.fourth || ''}`);
    getField('t139')?.setText(`${data?.environmental_impact?.contentCarbonsBurns
      ?.averageKM1 || ''}`);
    getField('t140')?.setText(`${data?.environmental_impact?.contentCarbonsBurns
      ?.engineKTZValue?.value || ''}`);
    getField('t141')?.setText(`${data?.environmental_impact?.contentCarbonsBurns
      ?.engineKTZValue?.general || ''}`);
    getField('t141')?.updateAppearances(bFont);
    getField('t142')?.setText(`${data?.environmental_impact?.contentCarbonsBurns
      ?.engineKTZValue?.code?.replace(rCode, 'НКН') || ''}`);
    getField('t142')?.updateAppearances(bFont);
  }


  // Концентрація оксиду вуглецю, вуглеводнів у спалинах ТЗ з двигунами,
  // що живляться бензином або газовим паливом до 01.04.2009
  if (isBefore) {
    if (data?.fuel_type === 'Бензин' &&
      data?.environmental_impact?.concentrationCO2
        ?.fuel?.neutralization === 'Не обладнаний') {
      getField('t143')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.contentCO?.resultNMin || ''}`);
      getField('t144')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.contentCO?.resultNPidv || ''}`);
      getField('t145')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.contentCH?.resultNMin || ''}`);
      getField('t146')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.contentCH?.resultNPidv || ''}`);
      getField('t147')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.noteInconsistency?.resultNMin || ''}`);
      getField('t148')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.noteInconsistency?.resultNPidv || ''}`);
      getField('t161')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.noteInconsistency?.code?.replace(rCode, 'НКН') || ''}`);
      getField('t147')?.updateAppearances(bFont);
      getField('t148')?.updateAppearances(bFont);
    }
    if (data?.fuel_type === 'Газ' || data?.fuel_type === 'Газ-Бензин') {
      getField('t149')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.contentCO?.resultNMin || ''}`);
      getField('t150')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.contentCO?.resultNPidv || ''}`);
      getField('t151')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.contentCH?.resultNMin || ''}`);
      getField('t152')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.contentCH?.resultNPidv || ''}`);
      getField('t153')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.noteInconsistency?.resultNMin || ''}`);
      getField('t154')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.noteInconsistency?.resultNPidv || ''}`);
      getField('t161')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.noteInconsistency?.code?.replace(rCode, 'НКН') || ''}`);
      getField('t153')?.updateAppearances(bFont);
      getField('t154')?.updateAppearances(bFont);
    }
    if (data?.fuel_type === 'Бензин' &&
      data?.environmental_impact?.concentrationCO2
        ?.fuel?.neutralization === 'Обладнаний') {
      // getField('t155')?.setText(`${data?.environmental_impact
      //   ?.concentrationCO2?.contentCO?.resultNMin || ''}`);
      // getField('t156')?.setText(`${data?.environmental_impact
      //   ?.concentrationCO2?.contentCO?.resultNPidv || ''}`);
      // getField('t157')?.setText(`${data?.environmental_impact
      //   ?.concentrationCO2?.contentCH?.resultNMin || ''}`);
      // getField('t158')?.setText(`${data?.environmental_impact
      //   ?.concentrationCO2?.contentCH?.resultNPidv || ''}`);
      getField('t159')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.noteInconsistency?.resultNMin || ''}`);
      getField('t160')?.setText(`${data?.environmental_impact?.concentrationCO2
        ?.noteInconsistency?.resultNPidv || ''}`);
      // getField('t161')?.setText(`${data?.environmental_impact
      //   ?.concentrationCO2?.noteInconsistency
      //     ?.code?.replace(rCode, 'НКН') || ''}`);
      getField('t159')?.updateAppearances(bFont);
      getField('t160')?.updateAppearances(bFont);
    }
  }
  // Концентрація оксиду вуглецю, вуглеводнів у спалинах ТЗ з двигунами,
  // що живляться бензином або газовим паливом після 01.04.2009
  if (!isBefore) {
    if (data?.ecological === 'Євро-2') {
      getField('t162')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.airOverdimension || ''}`);
      getField('t163')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNMin || ''}`);
      getField('t164')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNPidv || ''}`);
    }
    if (data?.ecological === 'Євро-3') {
      getField('t165')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.airOverdimension || ''}`);
      getField('t166')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNMin || ''}`);
      getField('t167')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNPidv || ''}`);
    }
    if (data?.ecological === 'Євро-4') {
      getField('t168')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.airOverdimension || ''}`);
      getField('t169')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNMin || ''}`);
      getField('t170')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNPidv || ''}`);
    }
    if (data?.ecological === 'Євро-5') {
      getField('t171')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.airOverdimension || ''}`);
      getField('t172')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNMin || ''}`);
      getField('t173')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNPidv || ''}`);
    }
    if (data?.ecological === 'Євро-6') {
      getField('t174')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.airOverdimension || ''}`);
      getField('t175')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNMin || ''}`);
      getField('t176')?.setText(`${data?.environmental_impact
        ?.concentrationCO2Values?.volumeCO?.resultNPidv || ''}`);
    }
    getField('t177')?.setText(`${data?.environmental_impact
      ?.concentrationCO2Values?.code?.replace(rCode, 'НКН') || ''}`);
  }
  // 5.13 Гальмові системи
  // РГС
  // Загальна питома гальмівна сила
  getField('t178')?.setText(`${data?.braking_systems
    ?.form?.brakingSystemRGS || ''}`);
  // Коефіцієнт нерівномірності гальмівних сил коліс осі, %
  getField('t179')?.setText(`${data?.braking_systems
    ?.form?.unevenBrakingForces?.first || ''}`);
  getField('t180')?.setText(`${data?.braking_systems
    ?.form?.unevenBrakingForces?.second || ''}`);
  getField('t181')?.setText(`${data?.braking_systems
    ?.form?.unevenBrakingForces?.third || ''}`);
  getField('t182')?.setText(`${data?.braking_systems
    ?.form?.unevenBrakingForces?.fourth || ''}`);
  // Тривалість спрацьовування, с
  getField('t183')?.setText(`${data?.braking_systems
    ?.form?.responseTime || ''}`);
  // Зусилля на органі керування, Н
  getField('t184')?.setText(`${data?.braking_systems
    ?.form?.controlEffortsRGS?.value || ''}`);
  getField('t185')?.setText(`${data?.braking_systems
    ?.form?.controlEffortsRGS?.general || ''}`);
  getField('t185')?.updateAppearances(bFont);
  // СГС
  // Загальна питома гальмівна сила
  getField('t186')?.setText(`${data?.braking_systems
    ?.form?.brakingSystemSGS || ''}`);
  // Зусилля на органі керування, Н
  getField('t187')?.setText(`${data?.braking_systems
    ?.form?.controlEffortsSGS?.value || ''}`);
  getField('t188')?.setText(`${data?.braking_systems
    ?.form?.controlEffortsSGS?.general || ''}`);
  getField('t188')?.updateAppearances(bFont);
  // 5.13.2 Інші гальмові системи, функціонування, технічний стан
  getField('t189')?.setText(`${data?.braking_systems
    ?.form?.otherSystemTechState?.general || ''}`);
  getField('t189')?.updateAppearances(bFont);
  // 5.13.2 Марковання, технічний стан складників
  getField('t190')?.setText(`${data?.braking_systems
    ?.form?.markingTechState?.general || ''}`);
  getField('t190')?.updateAppearances(bFont);
  // Коди невідповідності
  getField('t191')?.setText(`${data?.braking_systems
    ?.form?.code?.replace(rCode, 'НКН') || ''}`);

  // 5.14 Система керування
  // 5.14.1 Стан конструкції
  getField('t192')?.setText(`${data?.control_system
    ?.constructionState?.general || ''}`);
  getField('t193')?.setText(`${data?.control_system
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t193')?.updateAppearances(bFont);
  // 5.14.2 Технічний стан
  getField('t194')?.setText(`${data?.control_system
    ?.techState?.general || ''}`);
  getField('t195')?.setText(`${data?.control_system
    ?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t195')?.updateAppearances(bFont);
  // Сумарний кутовий проміжок РК
  getField('t196')?.setText(`${data?.control_system
    ?.controlSystemPK?.general || ''}`);
  getField('t197')?.setText(`${data?.control_system
    ?.controlSystemPK?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t197')?.updateAppearances(bFont);

  // Інше обладнання
  // 5.15.1 Вимоги стосовно газобалонного обладнання
  // Стан конструкції, функціональні можливості
  getField('t198')?.setText(`${data?.other_equipments
    ?.requirementsGasEquipments?.constructionState?.general || ''}`);
  getField('t199')?.setText(`${data?.other_equipments?.requirementsGasEquipments
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t198')?.updateAppearances(bFont);
  getField('t199')?.updateAppearances(bFont);
  // Технічний стан
  getField('t200')?.setText(`${data?.other_equipments
    ?.requirementsGasEquipments?.techState?.general || ''}`);
  getField('t201')?.setText(`${data?.other_equipments?.requirementsGasEquipments
    ?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t200')?.updateAppearances(bFont);
  getField('t201')?.updateAppearances(bFont);

  // 5.15.2 Вимоги до двигунів з OBD, OBD-I, OBD-II, EOBD
  getField('t202')?.setText(`${data?.other_equipments
    ?.requirementsEngines?.techState?.general || ''}`);
  getField('t203')?.setText(`${data?.other_equipments
    ?.requirementsEngines?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t202')?.updateAppearances(bFont);
  getField('t203')?.updateAppearances(bFont);
  // 5.16 Рама, кузов, інші несівні елементи
  // 5.16.1 Стан конструкції
  getField('t204')?.setText(`${data?.other_equipments
    ?.frameBodyElements?.constructionState?.general || ''}`);
  getField('t205')?.setText(`${data?.other_equipments?.frameBodyElements
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t204')?.updateAppearances(bFont);
  getField('t205')?.updateAppearances(bFont);
  // 5.16.2 Технічний стан
  getField('t206')?.setText(`${data?.other_equipments
    ?.frameBodyElements?.techState?.general || ''}`);
  getField('t207')?.setText(`${data?.other_equipments
    ?.frameBodyElements?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t206')?.updateAppearances(bFont);
  getField('t207')?.updateAppearances(bFont);
  // 5.17 Сідельно-зчіпний пристрій, шворінь
  // напівпричепа (для категорій N2, N3, О3, О4)
  // 5.17.1 Стан конструкції
  getField('t208')?.setText(`${data?.other_equipments
    ?.saddleConnectingDevice?.constructionState?.general || ''}`);
  getField('t209')?.setText(`${data?.other_equipments?.saddleConnectingDevice
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t208')?.updateAppearances(bFont);
  getField('t209')?.updateAppearances(bFont);
  // 5.17.2 Технічний стан
  getField('t210')?.setText(`${data?.other_equipments
    ?.saddleConnectingDevice?.techState?.general || ''}`);
  getField('t211')?.setText(`${data?.other_equipments
    ?.saddleConnectingDevice?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t210')?.updateAppearances(bFont);
  getField('t211')?.updateAppearances(bFont);
  // 5.18 Передній, задній буксирувальні пристрої (для категорій N2, N3, О3, О4)
  // 5.18.1 Стан конструкції
  getField('t212')?.setText(`${data?.other_equipments
    ?.frontBackTowingDevices?.constructionState?.general || ''}`);
  getField('t213')?.setText(`${data?.other_equipments?.frontBackTowingDevices
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t212')?.updateAppearances(bFont);
  getField('t213')?.updateAppearances(bFont);
  // 5.18.2 Технічний стан
  getField('t214')?.setText(`${data?.other_equipments
    ?.frontBackTowingDevices?.techState?.general || ''}`);
  getField('t215')?.setText(`${data?.other_equipments
    ?.frontBackTowingDevices?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t214')?.updateAppearances(bFont);
  getField('t215')?.updateAppearances(bFont);
  // 5.19 Вантажна платформа, вантажний кузов
  // 5.19.1 Стан конструкції
  getField('t216')?.setText(`${data?.other_equipments
    ?.loadPlatform?.constructionState?.general || ''}`);
  getField('t217')?.setText(`${data?.other_equipments
    ?.loadPlatform?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t216')?.updateAppearances(bFont);
  getField('t217')?.updateAppearances(bFont);
  // 5.19.2 Технічний стан
  getField('t218')?.setText(`${data?.other_equipments
    ?.loadPlatform?.techState?.general || ''}`);
  getField('t219')?.setText(`${data?.other_equipments
    ?.loadPlatform?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t218')?.updateAppearances(bFont);
  getField('t219')?.updateAppearances(bFont);
  // 5.20 Запасне пневматичне колесо
  // 5.20.1 Стан конструкції
  getField('t220')?.setText(`${data?.other_equipments
    ?.sparePneumaticWheel?.constructionState?.general || ''}`);
  getField('t221')?.setText(`${data?.other_equipments?.sparePneumaticWheel
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t220')?.updateAppearances(bFont);
  getField('t221')?.updateAppearances(bFont);
  // 5.20.2 Технічний стан
  getField('t222')?.setText(`${data?.other_equipments
    ?.sparePneumaticWheel?.techState?.general || ''}`);
  getField('t223')?.setText(`${data?.other_equipments
    ?.sparePneumaticWheel?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t222')?.updateAppearances(bFont);
  getField('t223')?.updateAppearances(bFont);

  // 5.21 Силова передача і її механізми управління
  // 5.21.1 Стан конструкції
  getField('t224')?.setText(`${data?.other_equipments
    ?.transmissionMechanisms?.constructionState?.general || ''}`);
  getField('t225')?.setText(`${data?.other_equipments?.transmissionMechanisms
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t224')?.updateAppearances(bFont);
  getField('t225')?.updateAppearances(bFont);
  // 5.21.2 Технічний стан
  getField('t226')?.setText(`${data?.other_equipments
    ?.transmissionMechanisms?.techState?.general || ''}`);
  getField('t227')?.setText(`${data?.other_equipments
    ?.transmissionMechanisms?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t226')?.updateAppearances(bFont);
  getField('t227')?.updateAppearances(bFont);

  // 5.22 Мости, осі
  // 5.22.1 Стан конструкції
  getField('t228')?.setText(`${data?.other_equipments
    ?.driveAxleAxes?.constructionState?.general || ''}`);
  getField('t229')?.setText(`${data?.other_equipments?.driveAxleAxes
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t228')?.updateAppearances(bFont);
  getField('t229')?.updateAppearances(bFont);
  // 5.22.2 Технічний стан
  getField('t230')?.setText(`${data?.other_equipments
    ?.driveAxleAxes?.techState?.general || ''}`);
  getField('t231')?.setText(`${data?.other_equipments
    ?.driveAxleAxes?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t230')?.updateAppearances(bFont);
  getField('t231')?.updateAppearances(bFont);

  // 5.23 Засоби фіксації, утримання зчіпних пристроїв
  // 5.23.1 Стан конструкції
  getField('t232')?.setText(`${data?.other_equipments
    ?.securingDevices?.constructionState?.general || ''}`);
  getField('t233')?.setText(`${data?.other_equipments?.securingDevices
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t232')?.updateAppearances(bFont);
  getField('t233')?.updateAppearances(bFont);
  // 5.23.2 Технічний стан
  getField('t234')?.setText(`${data?.other_equipments
    ?.securingDevices?.techState?.general || ''}`);
  getField('t235')?.setText(`${data?.other_equipments
    ?.securingDevices?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t234')?.updateAppearances(bFont);
  getField('t235')?.updateAppearances(bFont);

  // 5.24 Прилади (спідометр, тахометр при необхідності)
  // 5.24.1 Стан конструкції
  getField('t236')?.setText(`${data?.other_equipments
    ?.devices?.constructionState?.general || ''}`);
  getField('t237')?.setText(`${data?.other_equipments?.devices
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t236')?.updateAppearances(bFont);
  getField('t237')?.updateAppearances(bFont);
  // 5.24.2 Технічний стан
  getField('t238')?.setText(`${data?.other_equipments
    ?.devices?.techState?.general || ''}`);
  getField('t239')?.setText(`${data?.other_equipments
    ?.devices?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t238')?.updateAppearances(bFont);
  getField('t239')?.updateAppearances(bFont);

  // 5.25 Устаткування (звуковий сигнал, аптечка,
  // вогнегасник, противідкатні упори)
  // 5.25.1 Стан конструкції
  getField('t240')?.setText(`${data?.other_equipments
    ?.equipments?.constructionState?.general || ''}`);
  getField('t241')?.setText(`${data?.other_equipments?.equipments
    ?.constructionState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t240')?.updateAppearances(bFont);
  getField('t241')?.updateAppearances(bFont);
  // 5.25.2 Технічний стан
  getField('t242')?.setText(`${data?.other_equipments
    ?.equipments?.techState?.general || ''}`);
  getField('t243')?.setText(`${data?.other_equipments
    ?.equipments?.techState?.code?.replace(rCode, 'НКН') || ''}`);
  getField('t242')?.updateAppearances(bFont);
  getField('t243')?.updateAppearances(bFont);

  // 6. Перевірка рівня зовнішнього шуму
  if (data?.noise_level?.form?.tz === 'carsTrack') {
    getField('t244')?.setText(`${data?.noise_level?.form?.windSpeed || ''}`);
    getField('t245')?.setText(`${data?.noise_level?.form
      ?.backgroundNoise || ''}`);
    getField('t246')?.setText(`${data?.noise_level?.form?.results || ''}`);
    getField('t247')?.setText(`${data?.noise_level?.form
      ?.responsiveness || ''}`);
    getField('t247')?.updateAppearances(bFont);
  }
  if (data?.noise_level?.form?.tz === 'busesWeight3500' &&
    data?.noise_level?.form?.requirement === '150 та більше') {
    getField('t248')?.setText(`${data?.noise_level?.form?.windSpeed || ''}`);
    getField('t249')?.setText(`${data?.noise_level?.form
      ?.backgroundNoise || ''}`);
    getField('t250')?.setText(`${data?.noise_level?.form?.results || ''}`);
    getField('t251')?.setText(`${data?.noise_level?.form
      ?.responsiveness || ''}`);
    getField('t251')?.updateAppearances(bFont);
  }
  if (data?.noise_level?.form?.tz === 'busesWeight3500' &&
    data?.noise_level?.form?.requirement === 'менше ніж 150') {
    getField('t252')?.setText(`${data?.noise_level?.form?.windSpeed || ''}`);
    getField('t253')?.setText(`${data?.noise_level?.form
      ?.backgroundNoise || ''}`);
    getField('t254')?.setText(`${data?.noise_level?.form?.results || ''}`);
    getField('t255')?.setText(`${data?.noise_level?.form
      ?.responsiveness || ''}`);
    getField('t255')?.updateAppearances(bFont);
  }
  if (data?.noise_level?.form?.tz === 'busesTrack' &&
    data?.noise_level?.form?.requirement === 'не більше ніж 2000') {
    getField('t256')?.setText(`${data?.noise_level?.form?.windSpeed || ''}`);
    getField('t257')?.setText(`${data?.noise_level?.form
      ?.backgroundNoise || ''}`);
    getField('t258')?.setText(`${data?.noise_level?.form?.results || ''}`);
    getField('t259')?.setText(`${data?.noise_level?.form
      ?.responsiveness || ''}`);
    getField('t259')?.updateAppearances(bFont);
  }
  if (data?.noise_level?.form?.tz === 'busesTrack' &&
    data?.noise_level?.form?.requirement ===
    'понад 2000, але не більше ніж 3500') {
    getField('t260')?.setText(`${data?.noise_level?.form?.windSpeed || ''}`);
    getField('t261')?.setText(`${data?.noise_level?.form
      ?.backgroundNoise || ''}`);
    getField('t262')?.setText(`${data?.noise_level?.form?.results || ''}`);
    getField('t263')?.setText(`${data?.noise_level?.form
      ?.responsiveness || ''}`);
    getField('t263')?.updateAppearances(bFont);
  }
  if (data?.noise_level?.form?.tz === 'trainTrackWeight3500' &&
    data?.noise_level?.form?.requirement === 'менше ніж 75') {
    getField('t264')?.setText(`${data?.noise_level?.form?.windSpeed || ''}`);
    getField('t265')?.setText(`${data?.noise_level?.form
      ?.backgroundNoise || ''}`);
    getField('t266')?.setText(`${data?.noise_level?.form?.results || ''}`);
    getField('t267')?.setText(`${data?.noise_level?.form
      ?.responsiveness || ''}`);
    getField('t267')?.updateAppearances(bFont);
  }
  if (data?.noise_level?.form?.tz === 'trainTrackWeight3500' &&
    data?.noise_level?.form?.requirement ===
    '75 та більше, але менше ніж 150') {
    getField('t268')?.setText(`${data?.noise_level?.form?.windSpeed || ''}`);
    getField('t269')?.setText(`${data?.noise_level?.form
      ?.backgroundNoise || ''}`);
    getField('t270')?.setText(`${data?.noise_level?.form?.results || ''}`);
    getField('t271')?.setText(`${data?.noise_level?.form
      ?.responsiveness || ''}`);
    getField('t271')?.updateAppearances(bFont);
  }
  if (data?.noise_level?.form?.tz === 'trainTrackWeight3500' &&
    data?.noise_level?.form?.requirement === '150 та більше') {
    getField('t272')?.setText(`${data?.noise_level?.form?.windSpeed || ''}`);
    getField('t273')?.setText(`${data?.noise_level?.form
      ?.backgroundNoise || ''}`);
    getField('t274')?.setText(`${data?.noise_level?.form?.results || ''}`);
    getField('t275')?.setText(`${data?.noise_level?.form
      ?.responsiveness || ''}`);
    getField('t275')?.updateAppearances(bFont);
  }

  // 7. Перевірку провели
  getField('t276_1')?.setText(`${data?.inspector_1_position || ''}`);
  getField('t277_1')?.setText(`${data?.inspector_2_position || ''}`);
  getField('t278_1')?.setText(`${data?.inspector_3_position || ''}`);
  getField('t276_2')?.setText(`${data?.inspector_1_name || ''}`);
  getField('t277_2')?.setText(`${data?.inspector_2_name || ''}`);
  getField('t278_2')?.setText(`${data?.inspector_3_name || ''}`);


  // 8. Коди невідповідності
  getField('t278')?.setText(`${data?.codes_mismatch || ''}`);

  // 9. Думки та тлумачення
  getField('t279')?.setText(`${data?.comments || ''}`);

  // 10 Висновок
  getField('t280')?.setText(`${data
    ?.conclusion ? 'Відповідає' : 'Не відповідає'}`);
  getField('t280')?.updateAppearances(bFont);

  if (data?.dodatok_1) {
    getField('t281')?.setText('Так');
    const res = await modifyDoc1Pdf({ docNumDate, ...data.dodatok_1 });
    await copyPages(res);
  }
  if (data?.dodatok_2) {
    getField('t282')?.setText('Так');
    const res = await modifyDoc2Pdf({ docNumDate, ...data.dodatok_2 });
    await copyPages(res);
  }
  if (data?.dodatok_3) {
    getField('t283')?.setText('Так');
    const res = await modifyDoc3Pdf({ docNumDate, ...data.dodatok_3 });
    await copyPages(res);
  }
  if (data?.dodatok_4) {
    getField('t284')?.setText('Так');
    const res = await modifyDoc4Pdf({ docNumDate, ...data.dodatok_4 });
    await copyPages(res);
  }
  if (data?.dodatok_5) {
    getField('t285')?.setText('Так');
    const res = await modifyDoc5Pdf({ docNumDate, ...data.dodatok_5 });
    await copyPages(res);
  }
  if (data?.dodatok_6) {
    getField('t286')?.setText('Так');
    const res = await modifyDoc6Pdf({ docNumDate, ...data.dodatok_6 });
    await copyPages(res);
  }
  const doc7 = await doc7Pdf({ docNumDate,
    codes_mismatch: data?.codes_mismatch });
  await copyPages(doc7);
  form?.updateFieldAppearances(lFont);//nead to use cyrillic
  const savePdfBytes = await pdfDoc?.save();
  const filePDF =
    new Blob([ savePdfBytes ], { type: 'application/pdf' });
  const fileURL = URL?.createObjectURL(filePDF);
  console.log('fileURL', fileURL);
  // const a = document.createElement('a');
  // a.setAttribute('href', fileURL);
  // a.setAttribute('target', '_blank');
  // a.setAttribute('download', 'test1.pdf');
  // a.click();
  // window.URL.revokeObjectURL(fileURL);
  // a.remove();
  window.open(fileURL, '_blank');

};

export const PrintPDFbtn = ({
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

export const fillParagraph = (text, font, fontSize, maxWidth) => {
  const paragraphs = text.split('\n');
  for (let index = 0; index < paragraphs.length; index++) {
    const paragraph = paragraphs[index];
    if (font.widthOfTextAtSize(paragraph, fontSize) > maxWidth) {
      const words = paragraph.split(' ');
      const newParagraph = [];
      let i = 0;
      newParagraph[i] = [];
      for (let k = 0; k < words.length; k++) {
        const word = words[k];
        newParagraph[i].push(word);
        if (font
          .widthOfTextAtSize(newParagraph[i].join(' '), fontSize) > maxWidth) {
          newParagraph[i].splice(-1); // retira a ultima palavra
          i += 1;
          newParagraph[i] = [];
          newParagraph[i].push(word);
        }
      }
      paragraphs[index] = newParagraph.map((p) => p.join(' ')).join('\n');
    }
  }
  return paragraphs.join('\n');
};

PrintPDFbtn.propTypes = {
  data: PropTypes.object,
  handlePdfLoading: PropTypes.func,
  forwardedRef: PropTypes.any,
};
export default PrintPDFbtn;
