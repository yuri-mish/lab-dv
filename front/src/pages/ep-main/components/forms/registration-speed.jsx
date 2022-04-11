import { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import { Button } from 'devextreme-react/button';
import {
  ValidationSummary,
  TextBox,
  CheckBox,
} from 'devextreme-react';
import Validator, {
  RequiredRule,
  PatternRule,
} from 'devextreme-react/validator';


import { mockTahoText } from 'moks/moksData';
import { pPosNegNumDot } from 'moks/patterns';
import { Field } from '../field';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';

import { required } from 'pages/ep-main/constants';
export const RegistrationSpeed = (props) => {
  const {
    handleChange = () => {},
    handlePopupClose = () => {},
    data = {},
    blocked,
    number_doc,
  } = props;
  const [ form, setForm ] = useState(data);
  const [ dont_passed, setDont_passed ] = useState(data?.dont_passed || false);
  const [ startTime ] = useState(data?.startTime || dayjs().format());

  const handleFieldValueChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.element.id]: e.event?.target?.value || e?.value,
    }));
  };
  const validationGroupName = 'registrationSpeed';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      handleChange({
        ...form,
        startTime,
        dont_passed,
        status: dont_passed ? 'failed' : 'passed',
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
        Відхилення реєстрування швидкості, не більше ніж
      </h2>

      <hr className={styles.form_line} />

      <div className={styles.row_2x_950}>
        <div>
          <Field text={mockTahoText?.deviation_time?.after_installation}>
            <TextBox
              id={'after_installation'}
              value={form?.after_installation}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={250}
              readOnly={blocked}
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.after_installation}
                      - ${required}`}
                />
                <PatternRule pattern={pPosNegNumDot}
                  message="тільки цифри [+10 || -2,2]" />
              </Validator>
            </TextBox>
          </Field>
        </div>
        <div>
          <Field text={mockTahoText?.deviation_time?.in_exploitation}>
            <TextBox
              id={'in_exploitation'}
              value={form?.in_exploitation}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={250}
              readOnly={blocked}
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.after_installation}
                      - ${required}`}
                />
                <PatternRule pattern={pPosNegNumDot}
                  message="тільки цифри [+10 || -2,2]" />
              </Validator>
            </TextBox>
          </Field>
        </div>
      </div>
      <CheckBox
        style={{ fontSize: 'inherit' }}
        id={'dont_passed'}
        value={dont_passed}
        onOptionChanged={(e) => {
          if (e?.name === 'value') setDont_passed(e?.value);
        }}
        text={mockTahoText?.dont_passed}
        readOnly={blocked}
      />

      <ValidationSummary validationGroup={validationGroupName}/>

      {!blocked && (
        <Button
          text="Завершено"
          className={styles.form_button}
          validationGroup={validationGroupName}
          onClick={validateEditor}
          // disabled={canSend}
        />
      )}
    </div>
  );
};

RegistrationSpeed.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
