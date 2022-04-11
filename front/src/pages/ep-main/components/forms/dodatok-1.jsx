import { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Button } from 'devextreme-react/button';
import { TextLine } from '../text-line';
import Box, { Item } from 'devextreme-react/box';
import { TextBox } from 'devextreme-react/text-box';
import { ValidationSummary } from 'devextreme-react';
import {
  SelectFieldsList,
} from 'components/ep-form-field/lists/select-fields-list';

import { checkCanSend, extractCodes } from 'utils/ep-form';

import {
  doorConstructionFields,
  checkSchoolBusFields,
  specialEquipmentFields,
  checkHandicappedBusFields,
} from 'moks/epFormsData';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';


export const FirstDodatok = ({
  handleChange = () => {},
  handlePopupClose = () => {},
  blocked,
  number_doc,
  data = {},
}) => {
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const [ doorConstruction, setDoorConstruction ] = useState(
    data?.doorConstruction || {},
  );
  const [ checkSchoolBus, setCheckSchoolBus ] = useState(
    data?.checkSchoolBus || {},
  );
  const [ specialEquipment, setSpecialEquipment ] = useState(
    data?.specialEquipment || {},
  );
  const [ checkHandicappedBus, setCheckHandicappedBus ] = useState(
    data?.checkHandicappedBus || {},
  );
  const [ note, setNote ] = useState(data?.note || '');

  const onValueChanged = (e) => {
    setNote(e.value);
  };

  const canSend = checkCanSend({
    form: {
      ...doorConstruction,
      ...checkSchoolBus,
      ...specialEquipment,
      ...checkHandicappedBus,
    },
    defaultFields: [
      ...doorConstructionFields,
      ...checkSchoolBusFields,
      ...specialEquipmentFields,
      ...checkHandicappedBusFields,
    ],
  });

  const validationGroupName = 'dodatok-1';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = extractCodes({
        ...doorConstruction,
        ...checkSchoolBus,
        ...specialEquipment,
        ...checkHandicappedBus,
      });

      handleChange({
        doorConstruction,
        checkSchoolBus,
        specialEquipment,
        checkHandicappedBus,
        note,
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
        <span>
            Початок {dayjs(startTime).format(timeDateFormat)}
        </span>
        <span>
             Додаток 1
          <br />
          <span>{number_doc !== '' && 'ЕП №'}{number_doc}</span>
        </span>
      </div>

      <h2 className={styles.form_title}>
          Додаткова перевірка автобусів, які призначені для перевезення школярів
          або осіб з інвалідністю
      </h2>

      <hr className={styles.form_line} />

      <div className={styles.line_wrapper}>
        <TextLine text="Конструкція автобуса, його складові частини" />
      </div>

      <SelectFieldsList
        fields={doorConstructionFields}
        form={doorConstruction}
        setForm={setDoorConstruction}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine
          text="Перевірка автобусів,
                        призначених для перевезення школярів"
        />
      </div>

      <SelectFieldsList
        fields={checkSchoolBusFields}
        form={checkSchoolBus}
        setForm={setCheckSchoolBus}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Спеціальні обладнання" />
      </div>

      <SelectFieldsList
        fields={specialEquipmentFields}
        form={specialEquipment}
        setForm={setSpecialEquipment}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine
          text="Перевірка автобусів, які призначені та пристосовані
                         для перевезення осіб з інвалідністю"
        />
      </div>

      <SelectFieldsList
        fields={checkHandicappedBusFields}
        form={checkHandicappedBus}
        setForm={setCheckHandicappedBus}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <span>Примітка</span>
      </div>
      <Box direction="row" width="100%" align="center">
        <Item ratio={0} baseSize={'100%'}>
          <TextBox
            stylingMode={'outlined'}
            onValueChanged={onValueChanged}
            value={note}
            disabled={blocked}
          />
        </Item>
      </Box>

      <ValidationSummary validationGroup={validationGroupName} />

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

FirstDodatok.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
