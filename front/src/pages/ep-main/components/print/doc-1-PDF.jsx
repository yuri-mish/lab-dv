import file from 'moks/printPDFs/doc_1.pdf';

import { pdfBuilder } from './pdfBuilder';
/* eslint-disable sonarjs/cognitive-complexity */
export const modifyDoc1Pdf = async (data = {}) => {
  const {
    pdfDoc,
    lFont,
    bFont,
    form,
    rCode,
    getField = () => {},
  } = await pdfBuilder(file);

  // Додаток 1 до ПРОТОКОЛУ №
  getField('d1t0')?.setText(data?.docNumDate);
  getField('d1t0')?.updateAppearances(bFont);//nead to use cyrillic
  // 1.1 Конструкція пасажирських, аварійних дверей
  getField('d1t1')?.setText(`${data?.doorConstruction
    ?.doorConstruction?.general || ''}`);
  getField('d1t2')?.setText(`${data?.doorConstruction
    ?.doorConstruction?.code || ''}`);
  // 1.2 Захисні пристрої механізмів дверей
  getField('d1t3')?.setText(`${data?.doorConstruction
    ?.doorProtectiveDevices?.general || ''}`);
  getField('d1t4')?.setText(`${data?.doorConstruction
    ?.doorProtectiveDevices?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.3 Засоби контролю за зачиненням дверей
  getField('d1t5')?.setText(`${data?.doorConstruction
    ?.closeControlDevices?.general || ''}`);
  getField('d1t6')?.setText(`${data?.doorConstruction
    ?.closeControlDevices?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.4 Аварійний вихід, доступ до нього
  getField('d1t7')?.setText(`${data?.doorConstruction
    ?.emergencyDoor?.general || ''}`);
  getField('d1t8')?.setText(`${data?.doorConstruction
    ?.emergencyDoor?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.5 Покриття підлоги автобусу (небезпека підсковзнутися, впасти)
  getField('d1t9')?.setText(`${data?.doorConstruction
    ?.busFloorCovering?.general || ''}`);
  getField('d1t10')?.setText(`${data?.doorConstruction
    ?.busFloorCovering?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.6 Сидіння для пасажирів, членів екіпажу
  getField('d1t11')?.setText(`${data?.doorConstruction
    ?.crewPassengersSeats?.general || ''}`);
  getField('d1t12')?.setText(`${data?.doorConstruction
    ?.crewPassengersSeats?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.7 Кількість поручнів, їх розташування та технічний стан
  getField('d1t13')?.setText(`${data?.doorConstruction
    ?.handrailsNumber?.general || ''}`);
  getField('d1t14')?.setText(`${data?.doorConstruction
    ?.handrailsNumber?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.8 Конструкція місць для лежання
  getField('d1t15')?.setText(`${data?.doorConstruction
    ?.lyingPlacesConstruction?.general || ''}`);
  getField('d1t16')?.setText(`${data?.doorConstruction
    ?.lyingPlacesConstruction?.code?.replace(rCode, 'НКН') || ''}`);
  //1.9 Світлосигнальна, акустична відео система
  // спілкування водій – член екіпажу
  getField('d1t17')?.setText(`${data?.doorConstruction
    ?.lightSignalSystem?.general || ''}`);
  getField('d1t18')?.setText(`${data?.doorConstruction
    ?.lightSignalSystem?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.10 Засобу внутрішнього освітлення
  getField('d1t19')?.setText(`${data?.doorConstruction
    ?.internalLightingDevices?.general || ''}`);
  getField('d1t20')?.setText(`${data?.doorConstruction
    ?.internalLightingDevices?.code?.replace(rCode, 'НКН') || ''}`);
  //1.11 Освітлення та елементи закріплення трафаретів стосовно маршруту не
  // встановлені чи пошкоджені
  getField('d1t21')?.setText(`${data?.doorConstruction
    ?.lightingFixingElements?.general || ''}`);
  getField('d1t22')?.setText(`${data?.doorConstruction
    ?.lightingFixingElements?.code?.replace(rCode, 'НКН') || ''}`);
  //1.12 Наявність та відповідність написів, позначки входу/виходу,
  // пасажировмісності, позначки розташування аптечки, вогнегасника
  getField('d1t23')?.setText(`${data?.doorConstruction
    ?.enterExitMark?.general || ''}`);
  getField('d1t24')?.setText(`${data?.doorConstruction
    ?.enterExitMark?.code?.replace(rCode, 'НКН') || ''}`);
  // 1.13 Конструкція пасажирських, аварійних
  // дверей (відчинення зсередини і ззовні органом включення, в
  // ??? немає кодів
  // getField('d1t25')?.setText(`${data?.doorConstruction
  //   ?.enterExitMark?.general || ''}`);
  // getField('d1t26')?.setText(`${data?.doorConstruction
  //   ?.enterExitMark?.code?.replace(rCode, 'НКН') || ''}`);

  // 2.1 Діюче управління відчинення дверей та їх блокуванням, відкриття
  // заблокованих дверей засобами аварійного відчинення,
  getField('d1t27')?.setText(`${data?.checkSchoolBus
    ?.openLockControl?.general || ''}`);
  getField('d1t28')?.setText(`${data?.checkSchoolBus
    ?.openLockControl?.code?.replace(rCode, 'НКН') || ''}`);
  //Відсутнє самовільне зняття блокування дверей (при швидкості більше 5 км/год)
  getField('d1t29')?.setText(`${data?.checkSchoolBus
    ?.doorLockRemoval?.general || ''}`);
  getField('d1t30')?.setText(`${data?.checkSchoolBus
    ?.doorLockRemoval?.code?.replace(rCode, 'НКН') || ''}`);
  // Автобус не може зрушити з місця з відчиненими дверима
  getField('d1t31')?.setText(`${data?.checkSchoolBus
    ?.blockMoveWithOpenDoor?.general || ''}`);
  getField('d1t32')?.setText(`${data?.checkSchoolBus
    ?.blockMoveWithOpenDoor?.code?.replace(rCode, 'НКН') || ''}`);
  // При відчиненні дверей діє переривиста акустична сигналізація, звук якої
  // проникає всередину автобуса
  getField('d1t33')?.setText(`${data?.checkSchoolBus
    ?.intermittentAcousticAlarm?.general || ''}`);
  getField('d1t34')?.setText(`${data?.checkSchoolBus
    ?.intermittentAcousticAlarm?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.2. На кузові наявний запис «Шкільний
  // автобус» та розпізнавальний знак «Діти»
  getField('d1t35')?.setText(`${data?.checkSchoolBus
    ?.schoolBusMark?.general || ''}`);
  getField('d1t36')?.setText(`${data?.checkSchoolBus
    ?.schoolBusMark?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.3 Задній хід автобуса супроводжує акустичний сигнал
  getField('d1t37')?.setText(`${data?.checkSchoolBus
    ?.reverseBusSignal?.general || ''}`);
  getField('d1t38')?.setText(`${data?.checkSchoolBus
    ?.reverseBusSignal?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.4 На місці для перевезення пасажирів на
  // колясках наявне відповідне марковання
  getField('d1t39')?.setText(`${data?.checkSchoolBus
    ?.wheelchairsPassengersMark?.general || ''}`);
  getField('d1t40')?.setText(`${data?.checkSchoolBus
    ?.wheelchairsPassengersMark?.code?.replace(rCode, 'НКН') || ''}`);
  // Наявні діючі засоби кріплення колясок
  getField('d1t41')?.setText(`${data?.checkSchoolBus
    ?.wheelchairsFixingDevices?.general || ''}`);
  getField('d1t42')?.setText(`${data?.checkSchoolBus
    ?.wheelchairsFixingDevices?.code?.replace(rCode, 'НКН') || ''}`);
  // Передбачені місця для закріплення крісел-колясок у розкладеному та (або)
  // складеному стані
  getField('d1t43')?.setText(`${data?.checkSchoolBus
    ?.wheelchairsFixingPlace?.general || ''}`);
  getField('d1t44')?.setText(`${data?.checkSchoolBus
    ?.wheelchairsFixingPlace?.code?.replace(rCode, 'НКН') || ''}`);
  // Забезпечений доступ для завантаження (розвантаження) коляски
  getField('d1t45')?.setText(`${data?.checkSchoolBus
    ?.accessLoadingWheelchairs?.general || ''}`);
  getField('d1t46')?.setText(`${data?.checkSchoolBus
    ?.accessLoadingWheelchairs?.code?.replace(rCode, 'НКН') || ''}`);
  // 2.5 Сидіння, що межують з проходом мають бокові елементи для утримання
  // пасажирів
  getField('d1t47')?.setText(`${data?.checkSchoolBus
    ?.sideElementsHoldPassengers?.general || ''}`);
  getField('d1t48')?.setText(`${data?.checkSchoolBus
    ?.sideElementsHoldPassengers?.code?.replace(rCode, 'НКН') || ''}`);
  // 3. Спеціальне обладнання
  // 3.1 Пристрій для підіймання школяра в
  // кріслі-колясці діє та відповідає вимогам
  getField('d1t49')?.setText(`${data?.specialEquipment
    ?.deviceLiftingWheelchairStudent?.general || ''}`);
  getField('d1t50')?.setText(`${data?.specialEquipment
    ?.deviceLiftingWheelchairStudent?.code?.replace(rCode, 'НКН') || ''}`);
  // 3.2 Діючі ремені безпеки, їх марковання
  getField('d1t51')?.setText(`${data?.specialEquipment
    ?.activeSeatBelts?.general || ''}`);
  getField('d1t52')?.setText(`${data?.specialEquipment
    ?.activeSeatBelts?.code?.replace(rCode, 'НКН') || ''}`);
  // 3.3 Наявні діючі внутрішні дзеркал спостереження за пасажирами з місця
  // водія та з місця особи, що супроводжує пасажирів
  getField('d1t53')?.setText(`${data?.specialEquipment
    ?.interiorPassengersMirrors?.general || ''}`);
  getField('d1t54')?.setText(`${data?.specialEquipment
    ?.interiorPassengersMirrors?.code?.replace(rCode, 'НКН') || ''}`);
  // 3.4 Наявні діючі засоби зв’язку для сигналізації водієві з місця пасажира
  // чи особи, що супроводжує пасажирів, про вимогу щодо зупинки
  getField('d1t55')?.setText(`${data?.specialEquipment
    ?.communicationDevices?.general || ''}`);
  getField('d1t56')?.setText(`${data?.specialEquipment
    ?.communicationDevices?.code?.replace(rCode, 'НКН') || ''}`);
  // 3.5 Наявні діючі проблискові маячки оранжевого кольору на даху, які
  // вмикаються з робочого місця водія, незалежно від того, зачинені чи
  // відчинені двері, двигун діє чи ні.
  getField('d1t57')?.setText(`${data?.specialEquipment
    ?.flashingOrangeSignals?.general || ''}`);
  getField('d1t58')?.setText(`${data?.specialEquipment
    ?.flashingOrangeSignals?.code?.replace(rCode, 'НКН') || ''}`);
  // 3.6 Наявний діючий обмежувач швидкості, відповідна сигналізація та тахограф
  getField('d1t59')?.setText(`${data?.specialEquipment
    ?.activeSpeedLimiter?.general || ''}`);
  getField('d1t60')?.setText(`${data?.specialEquipment
    ?.activeSpeedLimiter?.code?.replace(rCode, 'НКН') || ''}`);

  // 4. Перевірка автобусів, які призначені та пристосовані для перевезення
  // осіб з інвалідністю
  // 4.1 Закріплені горизонтальні поручні вздовж стінок кузова біля місця
  // установки крісла-коляски
  getField('d1t61')?.setText(`${data?.checkHandicappedBus
    ?.fixedHorizontalHandrails?.general || ''}`);
  getField('d1t62')?.setText(`${data?.checkHandicappedBus
    ?.fixedHorizontalHandrails?.code?.replace(rCode, 'НКН') || ''}`);
  // 4.2 Наявні закріплені засоби закріплення крісла-коляски в транспортному
  // положенні
  getField('d1t63')?.setText(`${data?.checkHandicappedBus
    ?.devicesFixingWheelchairs?.general || ''}`);
  getField('d1t64')?.setText(`${data?.checkHandicappedBus
    ?.devicesFixingWheelchairs?.code?.replace(rCode, 'НКН') || ''}`);
  // 4.3 Забезпечено блокування руху у разі, коли засоби підіймання-опускання
  // переміщення крісла-коляски не встановлено у транспортне положення, а
  // пасажирські двері не зачинено
  getField('d1t65')?.setText(`${data?.checkHandicappedBus
    ?.trafficBlocking?.general || ''}`);
  getField('d1t66')?.setText(`${data?.checkHandicappedBus
    ?.trafficBlocking?.code?.replace(rCode, 'НКН') || ''}`);
  // 4.4 Наявна діюча сигналізація на робочому місці водія про місце розміщення
  // засобів підійманняопускання, крісла-коляски та про вимогу зупинки
  getField('d1t67')?.setText(`${data?.checkHandicappedBus
    ?.validAlarmDriverWorkplace?.general || ''}`);
  getField('d1t68')?.setText(`${data?.checkHandicappedBus
    ?.validAlarmDriverWorkplace?.code?.replace(rCode, 'НКН') || ''}`);
  // 4.5 Наявна транспортна коляска для переміщення інваліда в автобусі і
  // коляска, суміщена з установленим унітазом туалету в автобусі II і III класу
  getField('d1t69')?.setText(`${data?.checkHandicappedBus
    ?.transportWheelchair?.general || ''}`);
  getField('d1t70')?.setText(`${data?.checkHandicappedBus
    ?.transportWheelchair?.code?.replace(rCode, 'НКН') || ''}`);
  // 4.6 Наявні опори сидінь крісел-колясок для стоп, гомілок інвалідів, спинка
  // сидіння фіксується у нахиленому положенні, повертається у вихідне
  // положення, покриття подушок і спинок без пошкоджень, діючі ремені безпеки в
  // автобусах II і III класу, підлокітники сидінь, що розміщені біля проходу,
  // відкидаються та без пошкоджень
  getField('d1t71')?.setText(`${data?.checkHandicappedBus
    ?.supportSeatWheelchairs?.general || ''}`);
  getField('d1t72')?.setText(`${data?.checkHandicappedBus
    ?.supportSeatWheelchairs?.code?.replace(rCode, 'НКН') || ''}`);
  // 4.7 Конструкція та засоби автобусу забезпечують доступ інвалідів в автобус
  // та їх переміщення всередині
  getField('d1t73')?.setText(`${data?.checkHandicappedBus
    ?.constructionDevicesForDisabled?.general || ''}`);
  getField('d1t74')?.setText(`${data?.checkHandicappedBus
    ?.constructionDevicesForDisabled?.code?.replace(rCode, 'НКН') || ''}`);
  // 4.8 Наявний та діючий пристрій закріплення складеної коляски у
  // транспортному положенні
  getField('d1t75')?.setText(`${data?.checkHandicappedBus
    ?.fixedDevicesForFoldedWheelchairs?.general || ''}`);
  getField('d1t76')?.setText(`${data?.checkHandicappedBus
    ?.fixedDevicesForFoldedWheelchairs?.code?.replace(rCode, 'НКН') || ''}`);
  // 4.9 Наявна відповідна інструкція щодо перевезення пасажирів-інвалідів
  getField('d1t77')?.setText(`${data?.checkHandicappedBus
    ?.transportInstructionDisabled?.general || ''}`);
  getField('d1t78')?.setText(`${data?.checkHandicappedBus
    ?.transportInstructionDisabled?.code?.replace(rCode, 'НКН') || ''}`);
  // Примітка
  getField('d1t79')?.setText(`${data?.note || ''}`);

  form?.updateFieldAppearances(lFont);//nead to use cyrillic
  return pdfDoc || undefined;

};
