import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import {
  EpFormFieldDisparity,
} from 'components/ep-form-field/ep-form-field-disparity';
import {
  EpFormFieldInputSelect,
} from 'components/ep-form-field/ep-form-field-input-select';

import { Button } from 'devextreme-react/button';
import { ValidationSummary } from 'devextreme-react';

import { controlSystemFields, controlSystemPKField } from 'moks/epFormsData';

import { checkCanSend, extractCodes } from 'utils/ep-form';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';

export const ControlSystem = (props) => {
  const {
    handleChange = () => {},
    handlePopupClose = () => {},
    data = {},
    blocked,
    number_doc,
    category_KTZ,
    first_registration_date,
  } = props;
  const [ form, setForm ] = useState(data);
  const [ codeRequired, setCodeRequired ] = useState(false);
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const isBefore88 =
    dayjs(first_registration_date)?.isBefore('1989-01-01');
  const isM1M1GM2M2GN1N1G =
    category_KTZ === 'M1' ||
    category_KTZ === 'M1G' ||
    category_KTZ === 'M2' ||
    category_KTZ === 'M2G' ||
    category_KTZ === 'N1' ||
    category_KTZ === 'N1G';

  const isM3M3GN2N2GN3N3G =
    category_KTZ === 'M3' ||
    category_KTZ === 'M3G' ||
    category_KTZ === 'N2' ||
    category_KTZ === 'N2G' ||
    category_KTZ === 'N3' ||
    category_KTZ === 'N3G';

  const pkValue = !isBefore88 && isM1M1GM2M2GN1N1G ?
    10 :
    !isBefore88 && isM3M3GN2N2GN3N3G ?
      20 :
      25;

  const canSend = checkCanSend({
    form,
    defaultFields: controlSystemFields,
  });
  const validationGroupName = 'controlSystem';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = extractCodes(form);
      handleChange({
        ...form,
        startTime,
        codes,
        status: codes.length > 0 ? 'failed' : 'passed',
      });
      handlePopupClose();
    }
  };
  useEffect(() => {
    setCodeRequired(true);
  }, [ form[controlSystemPKField?.field]?.general ]);
  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>Початок {dayjs(startTime).format(timeDateFormat)}</span>
        <span>
          {number_doc !== '' && 'ЕП №'}
          {number_doc}
        </span>
      </div>

      <h2 className={styles.form_title}>Система керування</h2>

      <hr className={styles.form_line} />

      {controlSystemFields.map((item) => {
        const { field } = item;
        const disabled = form[field]?.general !== 'Ні';

        return (
          <EpFormFieldDisparity
            key={field}
            {...item}
            setForm={setForm}
            value={form[field]}
            disabled={disabled}
            blocked={blocked}
            validationGroup={validationGroupName}
          />
        );
      })}

      <EpFormFieldInputSelect
        {...controlSystemPKField}
        setForm={setForm}
        value={form[controlSystemPKField?.field]}
        blocked={blocked}
        pkValue={pkValue}
        category_KTZ={category_KTZ}
        inputDisabled={!(isM1M1GM2M2GN1N1G || isM3M3GN2N2GN3N3G)}
        showClearButton={true}
        validationGroup={validationGroupName}
        codeRequired={codeRequired}
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

ControlSystem.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
  category_KTZ: PropTypes.string,
  first_registration_date: PropTypes.string,
};
