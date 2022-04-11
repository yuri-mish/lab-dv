import PropTypes from 'prop-types';

import Box, { Item } from 'devextreme-react/box';
import { TextBox } from 'devextreme-react/text-box';
import Validator, {
  PatternRule,
  RequiredRule,
} from 'devextreme-react/validator';

import {
  required,
  fieldText,
  patternOnlyDigits,
  messageOnlyDigits,
} from 'pages/ep-main/constants';
import { pNum_5_2 } from 'moks/patterns';
import { onObjValueChanged, calculateLightUnits } from 'utils/ep-form';

import styles from './lightFiedls.module.scss';

export const LightFieldTwoInput = (props) => {
  const {
    title,
    firstPlaceholder,
    secondPlaceholder,
    value,
    setForm,
    field,
    requiredRule,
    blocked,
    validationGroup,
    normMin,
    normMax,
    luxUnits,
  } = props;
  const defaultValue = value[field];

  const onChange = ({ e, field, subfield }) => {
    const value = e?.value?.replace(',', '.');
    const calculeteRes = calculateLightUnits(value);
    setForm((prevState) => {
      const prevField = prevState[field];
      return {
        ...prevState,
        [field]: {
          ...prevField,
          [subfield]: value,
          [subfield?.replace('InLux', '')]: calculeteRes,
        },
      };
    });
  };

  return (
    <Box direction="row" width="100%" crossAlign="center" align='space-between'>
      <Item baseSize={'60%'}>
        <span>{title}</span>
      </Item>
      <Item baseSize={'40%'}>
        <div className={styles.two_input_group}>
          <div style={{ width: 'calc(50% - 10px)' }}>
            {luxUnits && <TextBox
              stylingMode={'outlined'}
              placeholder={firstPlaceholder}
              onValueChanged={
                (e) => onChange(
                  { e, setForm, field, subfield: 'leftInLux' })
              }
              value={defaultValue?.leftInLux}
              disabled={blocked}
            >
              <Validator validationGroup={validationGroup}>
                {requiredRule && (
                  <RequiredRule
                    message={`${firstPlaceholder} ${required}`}
                  />
                )}
                <PatternRule
                  pattern={ pNum_5_2 }
                  message={'тільки цифри максимум 2 знака пілся коми'}
                />
              </Validator>
            </TextBox>}
            <TextBox
              className={(defaultValue?.left < normMin ||
              defaultValue?.left > normMax) && styles.border_red}
              stylingMode={'outlined'}
              placeholder={luxUnits ? `${firstPlaceholder} (кд)` :
                firstPlaceholder}
              onValueChanged={
                (e) => onObjValueChanged(
                  { e, setForm, field, subfield: 'left' })
              }
              value={defaultValue?.left}
              disabled={blocked || luxUnits}
            >
              <Validator validationGroup={validationGroup}>
                {requiredRule && (
                  <RequiredRule
                    message={`${fieldText} ${title}
                ${firstPlaceholder} ${required}`}
                  />
                )}
                <PatternRule
                  pattern={patternOnlyDigits}
                  message={`${fieldText} ${title} - ${messageOnlyDigits}`}
                />
              </Validator>
            </TextBox>
          </div>
          <div style={{ width: 'calc(50% - 10px)' }}>
            {luxUnits && <TextBox
              stylingMode={'outlined'}
              placeholder={secondPlaceholder}
              onValueChanged={
                (e) => onChange(
                  { e, setForm, field, subfield: 'rightInLux' })
              }
              value={defaultValue?.rightInLux}
              disabled={blocked}
            >
              <Validator validationGroup={validationGroup}>
                {requiredRule && (
                  <RequiredRule
                    message={`${secondPlaceholder} ${required}`}
                  />
                )}
                <PatternRule
                  pattern={pNum_5_2}
                  message={'тільки цифри максимум 2 знака пілся коми'}
                />
              </Validator>
            </TextBox>}
            <TextBox
              className={(defaultValue?.right < normMin ||
              defaultValue?.right > normMax) && styles.border_red}
              stylingMode={'outlined'}
              placeholder={luxUnits ? `${secondPlaceholder} (кд)` :
                secondPlaceholder}
              onValueChanged={(e) => onObjValueChanged(
                { e, setForm, field, subfield: 'right' })}
              value={defaultValue?.right}
              disabled={blocked || luxUnits}
            >
              <Validator validationGroup={validationGroup}>
                {requiredRule && (
                  <RequiredRule
                    message={`${fieldText} ${title}
                ${secondPlaceholder} ${required}`}
                  />
                )}
                <PatternRule
                  pattern={patternOnlyDigits}
                  message={`${fieldText} ${title} - ${messageOnlyDigits}`}
                />
              </Validator>
            </TextBox>
          </div>
        </div>
      </Item>
    </Box>
  );
};

LightFieldTwoInput.propTypes = {
  title: PropTypes.string,
  radioGroupData: PropTypes.array,
  field: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  codeInconsistency: PropTypes.array,
  disabled: PropTypes.bool,
  firstPlaceholder: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  requiredRule: PropTypes.bool,
  blocked: PropTypes.bool,
  validationGroup: PropTypes.string,
  normMin: PropTypes.number,
  normMax: PropTypes.number,
  luxUnits: PropTypes.bool,
};
