import { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import { Button } from 'devextreme-react/button';
import {
  ValidationSummary,
  TextBox,
  RadioGroup,
  CheckBox,
} from 'devextreme-react';
import Validator, {
  RequiredRule,
  PatternRule,
} from 'devextreme-react/validator';


import { generalAnswersTwoVariants } from '../../constants';
import { mockTahoText } from 'moks/moksData';
import { pNum, pPosNegNumDot } from 'moks/patterns';
import { Field } from '../../components/field';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';

import { required } from 'pages/ep-main/constants';
export const DeviationTime = (props) => {
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
  const validationGroupName = 'deviationTime';
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
        Відхилення реєстрування часу не більше ніж
      </h2>

      <hr className={styles.form_line} />

      <div className={styles.row_2x_950}>
        <div>
          <Field text={`${mockTahoText?.deviation_time?.after_installation}
            (+/-2)`}>
            <TextBox
              id={'after_installation2'}
              value={form?.after_installation2}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={250}
              readOnly={blocked}
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.after_installation}
                   (+/-2) - ${required}`}
                />
                <PatternRule pattern={pPosNegNumDot} message="тільки цифри" />
              </Validator>
            </TextBox>
          </Field>
        </div>
        <div>
          <Field text={`${mockTahoText?.deviation_time?.in_exploitation}
            (+/-2)`}>
            <TextBox
              id={'in_exploitation2'}
              value={form?.in_exploitation2}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={250}
              readOnly={blocked}
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.in_exploitation}
                    (+/-2) - ${required}`}
                />
                <PatternRule pattern={pPosNegNumDot} message="тільки цифри" />
              </Validator>
            </TextBox>
          </Field>
        </div>
      </div>
      <div className={styles.row_2x_950}>
        <div>
          <Field text={`${mockTahoText?.deviation_time?.after_installation}
            (+/-10)`}>
            <TextBox
              id={'after_installation10'}
              value={form?.after_installation10}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={250}
              readOnly={blocked}
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.after_installation}
                    (+/-10) - ${required}`}
                />
                <PatternRule pattern={pPosNegNumDot} message="тільки цифри" />
              </Validator>
            </TextBox>
          </Field>
        </div>
        <div>
          <Field text={`${mockTahoText?.deviation_time?.in_exploitation}
            (+/-10)`}>
            <TextBox
              id={'in_exploitation10'}
              value={form?.in_exploitation10}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={250}
              readOnly={blocked}
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.in_exploitation}
                    (+/-10) - ${required}`}
                />
                <PatternRule pattern={pPosNegNumDot} message="тільки цифри" />
              </Validator>
            </TextBox>
          </Field>
        </div>
      </div>
      <div className={styles.row_2x_950}>
        <div>
          <Field text={mockTahoText?.deviation_time?.speed_limiter}>
            <TextBox
              id={'speed_limiter'}
              value={form?.speed_limiter}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={250}
              readOnly={blocked}
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.speed_limiter}
                      - ${required}`}
                />
                <PatternRule pattern={pNum} message="тільки цифри" />
              </Validator>
            </TextBox>
          </Field>
        </div>
        <div>
          <Field text={mockTahoText?.deviation_time?.opening}>
            <RadioGroup
              id={'opening'}
              dataSource={generalAnswersTwoVariants}
              disabled={blocked}
              value={form?.opening}
              onValueChanged={handleFieldValueChange}
              layout="horizontal"
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.opening}
                    - ${required}`}
                />
              </Validator>
            </RadioGroup>
          </Field>
        </div>
      </div>
      <div className={styles.row_2x_950}>
        <div>
          <Field text={mockTahoText?.deviation_time?.power_off}>
            <RadioGroup
              id={'power_off'}
              dataSource={generalAnswersTwoVariants}
              disabled={blocked}
              value={form?.power_off}
              onValueChanged={handleFieldValueChange}
              layout="horizontal"
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.power_off}
                    - ${required}`}
                />
              </Validator>
            </RadioGroup>
          </Field>
        </div>
        <div>
          <Field text={mockTahoText?.deviation_time?.pulse_sensor}>
            <RadioGroup
              id={'pulse_sensor'}
              dataSource={generalAnswersTwoVariants}
              disabled={blocked}
              value={form?.pulse_sensor}
              onValueChanged={handleFieldValueChange}
              layout="horizontal"
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`${mockTahoText?.deviation_time?.pulse_sensor}
                    - ${required}`}
                />
              </Validator>
            </RadioGroup>
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

DeviationTime.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
