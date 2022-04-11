import { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import {
  EpFormFieldSelect,
} from 'components/ep-form-field/ep-form-field-select';
import { Button } from 'devextreme-react/button';
import { ValidationSummary } from 'devextreme-react';

import { engineSystemsFields } from 'moks/epFormsData';
import { checkCanSend, extractCodes } from 'utils/ep-form';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';


export const EngineSystems = (props) => {
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
    defaultFields: engineSystemsFields,
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

  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>
          Початок {dayjs(startTime).format(timeDateFormat)}
        </span>
        <span>{number_doc !== '' && 'ЕП №'}{number_doc}</span>
      </div>

      <h2 className={styles.form_title}>Двигун та його системи</h2>

      <hr className={styles.form_line} />

      {engineSystemsFields.map((item) => {
        const { field } = item;
        const disabled = form[field]?.general !== 'Ні';

        return (
          <EpFormFieldSelect
            key={field}
            {...item}
            disabled={disabled}
            setForm={setForm}
            value={form[field]}
            blocked={blocked}
            validationGroup={validationGroupName}
          />
        );
      })}

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

EngineSystems.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
