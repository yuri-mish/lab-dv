import { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import {
  SelectFieldsList,
} from 'components/ep-form-field/lists/select-fields-list';
import { Button } from 'devextreme-react/button';
import { ValidationSummary } from 'devextreme-react';

import { generalCharacteristicsFields } from 'moks/epFormsData';
import { checkCanSend, extractCodes } from 'utils/ep-form';
import { timeDateFormat } from 'utils/date-formats';
import { SetAllValues } from '../setAllValues';
import styles from './forms.module.scss';

export const GeneralCharacteristics = (props) => {
  const {
    handleChange = () => {},
    handlePopupClose = () => {},
    data = {},
    blocked,
    number_doc,
  } = props;
  const [ form, setForm ] = useState(data);
  const [ startTime ] = useState(data?.startTime || dayjs().format());

  const canSend = checkCanSend({
    form,
    defaultFields: generalCharacteristicsFields,
  });
  const validationGroupName = 'generalCharacteristics';
  // submit form
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

  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>
            Початок {dayjs(startTime).format(timeDateFormat)}
        </span>
        <span>{number_doc !== '' && 'ЕП №'}{number_doc}</span>
      </div>

      <h2 className={styles.form_title}>
          Загальні характеристики технічного стану ТЗ та його складиків
      </h2>

      <hr className={styles.form_line} />

      <SelectFieldsList
        fields={generalCharacteristicsFields}
        form={form}
        setForm={setForm}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <ValidationSummary validationGroup={validationGroupName} />
      <SetAllValues elements={generalCharacteristicsFields} setData={setForm}/>
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

GeneralCharacteristics.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
