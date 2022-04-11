import { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Button } from 'devextreme-react/button';
import { TextLine } from '../text-line';
import { ValidationSummary } from 'devextreme-react';
import {
  SelectFieldsList,
} from 'components/ep-form-field/lists/select-fields-list';

import {
  requirementsGasEquipmentsFields,
  requirementsEnginesFields,
  frameBodyElementsFields,
  saddleConnectingDeviceFields,
  frontBackTowingDevicesFields,
  loadPlatformFields,
  sparePneumaticWheelFields,
  transmissionMechanismsFields,
  driveAxleAxesFields,
  securingDevicesFields,
  equipmentsFields,
  devicesFields,
} from 'moks/epFormsData';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';

import { checkCanSend, extractCodes } from 'utils/ep-form';

export const OtherEquipments = (props) => {
  const {
    handleChange = () => {},
    handlePopupClose = () => {},
    data = {},
    blocked,
    number_doc,
    fuel_type,
    category_KTZ,
  } = props;
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const [ requirementsGasEquipments, setRequirementsGasEquipments ] = useState(
    data?.requirementsGasEquipments || {},
  );
  const [ requirementsEngines, setRequirementsEngines ] = useState(
    data?.requirementsEngines || {},
  );
  const [ frameBodyElements, setFrameBodyElements ] = useState(
    data?.frameBodyElements || {},
  );
  const [ saddleConnectingDevice, setSaddleConnectingDevice ] = useState(
    data?.saddleConnectingDevice || {},
  );
  const [ frontBackTowingDevices, setFrontBackTowingDevices ] = useState(
    data?.frontBackTowingDevices || {},
  );
  const [ loadPlatform, setLoadPlatform ] = useState(data?.loadPlatform || {});
  const [ sparePneumaticWheel, setSparePneumaticWheel ] = useState(
    data?.sparePneumaticWheel || {},
  );
  const [ transmissionMechanisms, setTransmissionMechanisms ] = useState(
    data?.transmissionMechanisms || {},
  );
  const [ driveAxleAxes, setDriveAxleAxes ] = useState(
    data?.driveAxleAxes || {},
  );
  const [ securingDevices, setSecuringDevices ] = useState(
    data?.securingDevices || {},
  );
  const [ equipments, setEquipments ] = useState(data?.equipments || {});
  const [ devices, setDevices ] = useState(data?.devices || {});

  const requirementsGasEquipmentsCanSend = checkCanSend({
    form: {
      ...requirementsGasEquipments,
    },
    defaultFields: requirementsGasEquipmentsFields,
  });

  const requirementsEnginesCanSend = checkCanSend({
    form: {
      ...requirementsEngines,
    },
    defaultFields: requirementsEnginesFields,
  });

  const frameBodyElementsCanSend = checkCanSend({
    form: {
      ...frameBodyElements,
    },
    defaultFields: frameBodyElementsFields,
  });

  const saddleConnectingDeviceCanSend = checkCanSend({
    form: {
      ...saddleConnectingDevice,
    },
    defaultFields: saddleConnectingDeviceFields,
  });

  const frontBackTowingDevicesCanSend = checkCanSend({
    form: {
      ...frontBackTowingDevices,
    },
    defaultFields: frontBackTowingDevicesFields,
  });

  const loadPlatformCanSend = checkCanSend({
    form: {
      ...loadPlatform,
    },
    defaultFields: loadPlatformFields,
  });

  const sparePneumaticWheelCanSend = checkCanSend({
    form: {
      ...sparePneumaticWheel,
    },
    defaultFields: sparePneumaticWheelFields,
  });

  const transmissionMechanismsCanSend = checkCanSend({
    form: {
      ...transmissionMechanisms,
    },
    defaultFields: transmissionMechanismsFields,
  });

  const driveAxleAxesCanSend = checkCanSend({
    form: {
      ...driveAxleAxes,
    },
    defaultFields: driveAxleAxesFields,
  });

  const securingDevicesCanSend = checkCanSend({
    form: {
      ...securingDevices,
    },
    defaultFields: securingDevicesFields,
  });

  const equipmentsCanSend = checkCanSend({
    form: {
      ...equipments,
    },
    defaultFields: equipmentsFields,
  });

  const devicesCanSend = checkCanSend({
    form: {
      ...devices,
    },
    defaultFields: devicesFields,
  });

  const isGasPatrolDiesel =
    fuel_type === 'Газ' ||
    fuel_type === 'Газ-Бензин' ||
    fuel_type === 'Газ-Дизель';

  const isN2N3O3O4 =
    category_KTZ === 'N2' ||
    category_KTZ === 'N3' ||
    category_KTZ === 'O3' ||
    category_KTZ === 'O4';

  const isM1M2M3 =
      category_KTZ === 'M1' ||
      category_KTZ === 'M2' ||
      category_KTZ === 'M3';

  const canSend =
    (!isGasPatrolDiesel || requirementsGasEquipmentsCanSend) &&
    requirementsEnginesCanSend &&
    frameBodyElementsCanSend &&
    (!isN2N3O3O4 || saddleConnectingDeviceCanSend) &&
    (!isN2N3O3O4 || frontBackTowingDevicesCanSend) &&
    (isM1M2M3 || loadPlatformCanSend) &&
    sparePneumaticWheelCanSend &&
    transmissionMechanismsCanSend &&
    driveAxleAxesCanSend &&
    securingDevicesCanSend &&
    equipmentsCanSend &&
    devicesCanSend;
  const validationGroupName = 'otherEquipments';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = [];
      codes.push(...extractCodes({ ...requirementsGasEquipments }));
      codes.push(...extractCodes({ ...requirementsEngines }));
      codes.push(...extractCodes({ ...frameBodyElements }));
      codes.push(...extractCodes({ ...saddleConnectingDevice }));
      codes.push(...extractCodes({ ...frontBackTowingDevices }));
      codes.push(...extractCodes({ ...loadPlatform }));
      codes.push(...extractCodes({ ...sparePneumaticWheel }));
      codes.push(...extractCodes({ ...transmissionMechanisms }));
      codes.push(...extractCodes({ ...driveAxleAxes }));
      codes.push(...extractCodes({ ...securingDevices }));
      codes.push(...extractCodes({ ...equipments }));
      codes.push(...extractCodes({ ...devices }));


      handleChange({
        requirementsGasEquipments,
        requirementsEngines,
        frameBodyElements,
        saddleConnectingDevice,
        frontBackTowingDevices,
        loadPlatform,
        sparePneumaticWheel,
        transmissionMechanisms,
        driveAxleAxes,
        securingDevices,
        equipments,
        devices,
        startTime,
        codes,
        status: codes.length > 0 ? 'failed' : 'passed',
      });
      handlePopupClose();
    }
  };

  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>Початок {dayjs(startTime).format(timeDateFormat)}</span>
        <span>
          {number_doc !== '' && 'ЕП №'}
          {number_doc}
        </span>
      </div>

      <h2 className={styles.form_title}>Інше обладнання</h2>

      <hr className={styles.form_line} />

      {isGasPatrolDiesel && (
        <>
          <div className={styles.line_wrapper}>
            <TextLine text="Вимоги стосовно газобалонного обладнання" />
          </div>

          <SelectFieldsList
            fields={requirementsGasEquipmentsFields}
            form={requirementsGasEquipments}
            setForm={setRequirementsGasEquipments}
            blocked={blocked}
            validationGroup={validationGroupName}
          />
        </>
      )}

      <div className={styles.line_wrapper}>
        <TextLine text="Вимоги до двигунів OBD, OBD-I, OBD-II, EOBD" />
      </div>

      <SelectFieldsList
        fields={requirementsEnginesFields}
        form={requirementsEngines}
        setForm={setRequirementsEngines}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Рама, кузов, інші несівні елементи" />
      </div>

      <SelectFieldsList
        fields={frameBodyElementsFields}
        form={frameBodyElements}
        setForm={setFrameBodyElements}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine
          text="Сідельно-зчіпний пристрій,
         шворінь напівпричепа (для категорій N2, N3, O3, 04)"
        />
      </div>

      <SelectFieldsList
        fields={saddleConnectingDeviceFields}
        form={saddleConnectingDevice}
        setForm={setSaddleConnectingDevice}
        blocked={blocked || !isN2N3O3O4}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine
          text="Передній, задній буксирувальні пристої
        (для категорій N2, N3, O3, 04)"
        />
      </div>

      <SelectFieldsList
        fields={frontBackTowingDevicesFields}
        form={frontBackTowingDevices}
        setForm={setFrontBackTowingDevices}
        blocked={blocked || !isN2N3O3O4}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Вантажна платформа, вантажний кузов" />
      </div>

      <SelectFieldsList
        fields={loadPlatformFields}
        form={loadPlatform}
        setForm={setLoadPlatform}
        blocked={blocked || isM1M2M3}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Запасне пневматичне колесо" />
      </div>

      <SelectFieldsList
        fields={sparePneumaticWheelFields}
        form={sparePneumaticWheel}
        setForm={setSparePneumaticWheel}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine
          text="Силова передача і її механізми управління
                        (коробка передач, кардан, редуктор)"
        />
      </div>

      <SelectFieldsList
        fields={transmissionMechanismsFields}
        form={transmissionMechanisms}
        setForm={setTransmissionMechanisms}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Мости, осі" />
      </div>

      <SelectFieldsList
        fields={driveAxleAxesFields}
        form={driveAxleAxes}
        setForm={setDriveAxleAxes}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine
          text="Засоби фіксації, устримання зчіпних пристроїв
         у разі їх аварійного роз'єднання (для причепів та напівпричепів)"
        />
      </div>

      <SelectFieldsList
        fields={securingDevicesFields}
        form={securingDevices}
        setForm={setSecuringDevices}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Прилади (спідометр, тахометр при необхідності)" />
      </div>

      <SelectFieldsList
        fields={devicesFields}
        form={devices}
        setForm={setDevices}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine
          text="Устаткування (звуковий сигнал,
                        аптечка, вогнегансник, противідкатні упори)"
        />
      </div>

      <SelectFieldsList
        fields={equipmentsFields}
        form={equipments}
        setForm={setEquipments}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <ValidationSummary validationGroup={validationGroupName}/>

      {!blocked && (
        <Button
          text="Завершено"
          className={styles.form_button}
          validationGroup={validationGroupName}
          onClick={validateEditor}
          disabled={!canSend}
        />
      )}
    </div>
  );
};

OtherEquipments.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
  fuel_type: PropTypes.string,
  category_KTZ: PropTypes.string,
};
