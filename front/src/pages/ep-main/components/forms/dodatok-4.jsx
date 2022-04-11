import { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Button } from 'devextreme-react/button';
import { TextLine } from '../text-line';
import { ValidationSummary } from 'devextreme-react';
import {
  SelectFieldsList,
} from 'components/ep-form-field/lists/select-fields-list';

import { checkCanSend, extractCodes } from 'utils/ep-form';

import {
  additionalCheckingFields,
  additionalRequirementsFields,
} from 'moks/epFormsData';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';

export const FourthDodatok = ({
  handleChange = () => {},
  handlePopupClose = () => {},
  blocked,
  number_doc,
  data = {},
}) => {
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const [ additionalChecking, setAdditionalChecking ] = useState(
    data?.additionalChecking || {},
  );
  const [ additionalRequirements, setAdditionalRequirements ] = useState(
    data?.additionalRequirements || {},
  );

  const canSend = checkCanSend({
    form: { ...additionalChecking, ...additionalRequirements },
    defaultFields: [
      ...additionalRequirementsFields,
      ...additionalCheckingFields,
    ],
  });

  const validationGroupName = 'dodatok-4';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = extractCodes({
        ...additionalChecking,
        ...additionalRequirements,
      });

      handleChange({
        additionalChecking,
        additionalRequirements,
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
            Додаток 4
          <br />
          <span>{number_doc !== '' && 'ЕП №'}{number_doc}</span>
        </span>
      </div>

      <h2 className={styles.form_title}>
        Додаткова перевірка учбового транспортного засобу
      </h2>

      <hr className={styles.form_line}/>

      <SelectFieldsList
        fields={additionalCheckingFields}
        form={additionalChecking}
        setForm={setAdditionalChecking}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <TextLine
          text="Додаткові вимоги до органів управління
          транспортним засобом, призначеним для підготовки водіїв
          з числа осіб з інвалідністю або маломобільних груп населення"
        />
      </div>


      <SelectFieldsList
        fields={additionalRequirementsFields}
        form={additionalRequirements}
        setForm={setAdditionalRequirements}
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

FourthDodatok.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
