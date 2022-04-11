import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import {
  SelectFieldsList,
} from 'components/ep-form-field/lists/select-fields-list';
import {
  EpFormFieldInputSelect,
} from 'components/ep-form-field/ep-form-field-input-select';
import {
  EpFormFieldTyrePressure,
} from 'components/ep-form-field/ep-form-field-tyre-pressure';
import { Button } from 'devextreme-react/button';
import { TextLine } from '../text-line';
import { ValidationSummary } from 'devextreme-react';

import {
  pneumaticTyresFields,
  tyrePressureField,
  tyreTreadField,
  wheelsFields,
} from 'moks/epFormsData';

import { checkCanSend, extractCodes } from 'utils/ep-form';
import { timeDateFormat } from 'utils/date-formats';
import { tyreTreadIsLessNorm, normList } from 'utils/check-norm-tyres-wheels';
import styles from './forms.module.scss';


export const TyresWheels = (props) => {
  const {
    handleChange = () => {},
    handlePopupClose = () => {},
    data = {},
    blocked,
    number_doc,
    category_KTZ,
  } = props;
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const [ pneumaticTires, setPneumaticTires ] = useState(
    data?.pneumaticTires || {},
  );
  const [ wheels, setWheels ] = useState(data?.wheels || {});
  const [ tyrePressure, setPressure ] = useState(data?.tyrePressure || {});
  const [ tyreTread, setTyreTread ] = useState(data?.tyreTread || {});

  const pneumaticTiresCanSend = checkCanSend({
    form: pneumaticTires,
    defaultFields: pneumaticTyresFields,
  });

  const wheelsCanSend = checkCanSend({
    form: wheels,
    defaultFields: wheelsFields,
  });

  const canSend = pneumaticTiresCanSend && wheelsCanSend;
  const validationGroupName = 'tyresWheels';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = [];
      codes.push(...extractCodes({ ...pneumaticTires }));
      codes.push(...extractCodes({ ...wheels }));
      codes.push(...extractCodes({ ...tyreTread }));

      handleChange({
        pneumaticTires,
        wheels,
        tyreTread,
        tyrePressure,
        codes,
        startTime,
        status: codes.length > 0 ? 'failed' : 'passed',
      });
      handlePopupClose();
    }
  };
  useEffect(() => {
    const val = tyreTread?.tyreTread?.general || '';
    const check =
      tyreTreadIsLessNorm({ category_KTZ, val });
    if (check) {
      setTyreTread(
        { tyreTread: { general: val,
          code: tyreTreadField?.codeInconsistency?.[0] || null },
        });
    }
  }, [ tyreTread?.tyreTread?.general ]);

  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>
          Початок {dayjs(startTime).format(timeDateFormat)}
        </span>
        <span>{number_doc !== '' && 'ЕП №'}{number_doc}</span>
      </div>

      <h2 className={styles.form_title}>Шини та Колеса</h2>

      <div className={styles.line_wrapper}>
        <TextLine text="Пневматичні шини" />
      </div>

      <SelectFieldsList
        fields={pneumaticTyresFields}
        form={pneumaticTires}
        setForm={setPneumaticTires}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Висота рисунка протектора шини" />
      </div>

      <EpFormFieldInputSelect
        {...tyreTreadField}
        setForm={setTyreTread}
        value={tyreTread?.tyreTread}
        blocked={blocked}
        category_KTZ={category_KTZ}
        normToProtectorHeight={normList?.[category_KTZ] || null}
        showClearButton={true}
        validationGroup={validationGroupName}
        patternNumDot={true}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Тиск повітря в шинах на осях" />
      </div>

      <EpFormFieldTyrePressure
        {...tyrePressureField}
        setForm={setPressure}
        value={tyrePressure}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="Колеса" />
      </div>

      <SelectFieldsList
        fields={wheelsFields}
        form={wheels}
        setForm={setWheels}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

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

TyresWheels.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
  category_KTZ: PropTypes.string,
};
