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
import { pNum, pPosNegNumDot } from 'moks/patterns';
import { Field } from '../field';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';

import { required } from 'pages/ep-main/constants';
export const CheckingAdaptation = (props) => {
  const {
    handleChange = () => {},
    handlePopupClose = () => {},
    data = {},
    blocked,
    number_doc,
  } = props;
  const tires_pattern =
    '^[0-9]{3}[,.]{0,1}[0-9]{0,1}[/]{1}[0-9]{2}[,.]{0,1}[0-9]{0,1}' +
     '[-]{1}[R]{1}[0-9]{2}[,.]{0,1}[0-9]{0,1}$';
  const [ form, setForm ] = useState(data);
  const [ dont_passed, setDont_passed ] = useState(data?.dont_passed || false);
  const [ startTime ] = useState(data?.startTime || dayjs().format());

  const handleFieldValueChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.element.id]: e.event?.target?.value || e?.value,
    }));
  };
  const validationGroupName = 'checkingAdaptation';
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
        Результати перевірки та адаптації тахографа
      </h2>

      <hr className={styles.form_line} />

      <div style={{
        maxWidth: 700,
        marginRight: 'auto',
        paddingLeft: '10px',
      }}>
        <Field text={mockTahoText?.checking_adaptation?.mileage_before}>
          <TextBox
            id={'mileage_before'}
            value={form?.mileage_before}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={blocked}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`${mockTahoText?.checking_adaptation?.mileage_before}
                    - ${required}`}
              />
              <PatternRule pattern={pNum} message="тільки цифри" />
            </Validator>
          </TextBox>
        </Field>

        <Field text={mockTahoText?.checking_adaptation?.mileage_after}>
          <TextBox
            id={'mileage_after'}
            value={form?.mileage_after}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={blocked}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`${mockTahoText?.checking_adaptation?.mileage_after}
                    - ${required}`}
              />
              <PatternRule pattern={pNum} message="тільки цифри" />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.checking_adaptation?.tires_size}>
          <TextBox
            id={'tires_size'}
            value={form?.tires_size}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={blocked}
            // ХХХ,X/ХХ,X-RХХ,X
            // mask={'000\\,0\\/00\\,0\\-\\R00\\,0'}
            // maskChar={'X'}
            // useMaskedValue={true}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`${mockTahoText?.checking_adaptation?.tires_size}
                    - ${required}`}
              />
              <PatternRule
                pattern={tires_pattern}
                message="формат вводу: 255/55-R18; 255,5/55,5-R18"
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.checking_adaptation?.tires_pressure}>
          <TextBox
            id={'tires_pressure'}
            value={form?.tires_pressure}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={blocked}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`${mockTahoText?.checking_adaptation?.tires_pressure}
                    - ${required}`}
              />
              <PatternRule pattern={pPosNegNumDot}
                message="тільки цифри [2,2 || 3] " />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.checking_adaptation?.effective_length}>
          <TextBox
            id={'effective_length'}
            value={form?.effective_length}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={blocked}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`${mockTahoText?.checking_adaptation?.effective_length}
                    - ${required}`}
              />
              <PatternRule pattern={pNum} message="тільки цифри" />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.checking_adaptation?.coefficient}>
          <TextBox
            id={'coefficient'}
            value={form?.coefficient}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={blocked}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`${mockTahoText?.checking_adaptation?.coefficient}
                  - ${required}`}
              />
              <PatternRule pattern={pNum} message="тільки цифри" />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.checking_adaptation?.tachograph_constant}>
          <TextBox
            id={'tachograph_constant'}
            value={form?.tachograph_constant}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={blocked}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={
                  `${mockTahoText?.checking_adaptation?.tachograph_constant}
                    - ${required}`}
              />
              <PatternRule pattern={pNum} message="тільки цифри" />
            </Validator>
          </TextBox>
        </Field>
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
      </div>
      <ValidationSummary validationGroup={validationGroupName}/>

      {!blocked && (
        <Button
          text="Завершено"
          className={styles.form_button}
          validationGroup={validationGroupName}
          onClick={validateEditor}
        />
      )}
    </div>
  );
};

CheckingAdaptation.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
