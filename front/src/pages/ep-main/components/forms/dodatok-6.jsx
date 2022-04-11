import { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Button } from 'devextreme-react/button';
import { ValidationSummary } from 'devextreme-react';
import {
  SelectFieldsList,
} from 'components/ep-form-field/lists/select-fields-list';

import { checkCanSend, extractCodes } from 'utils/ep-form';

import { additionalTruckCheckFields } from 'moks/epFormsData';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';

export const SixthDodatok = ({
  handleChange = () => {},
  handlePopupClose = () => {},
  blocked,
  number_doc,
  data = {},
}) => {
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const [ form, setForm ] = useState(data?.form || {});

  const canSend = checkCanSend({
    form,
    defaultFields: additionalTruckCheckFields,
  });

  const validationGroupName = 'dodatok-6';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = extractCodes(form);

      handleChange({
        form,
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
            Додаток 6
          <br />
          <span>{number_doc !== '' && 'ЕП №'}{number_doc}</span>
        </span>
      </div>

      <h2 className={styles.form_title}>
        Додаткова перевірка великогабаритного, великовагового транспортного
        засобу
      </h2>

      <hr className={styles.form_line} />

      <SelectFieldsList
        fields={additionalTruckCheckFields}
        form={form}
        setForm={setForm}
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

SixthDodatok.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
