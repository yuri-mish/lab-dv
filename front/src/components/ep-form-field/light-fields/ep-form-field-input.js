import PropTypes from 'prop-types';

import { TextBox } from 'devextreme-react/text-box';
import { Tooltip } from 'devextreme-react/tooltip';
import Box, { Item } from 'devextreme-react/box';
import Validator, {
  PatternRule,
  RequiredRule,
} from 'devextreme-react/validator';

import styles from './lightFiedls.module.scss';

import { onValueChanged, calculateLightUnits } from 'utils/ep-form';

import {
  fieldText,
  patternOnlyDigits,
  messageOnlyDigits,
  required,
} from 'pages/ep-main/constants';
import { pNum_5_2 } from 'moks/patterns';

export const LightFieldInput = ({
  title,
  placeholder,
  setForm,
  value,
  field,
  blocked,
  validationGroup,
  tooltipText = '',
  normMin,
  normMax,
  luxUnits,
}) => {
  const defaultValue = value[field];
  const defaultLuxValue = value[`${field}InLux`];
  const onChange = ({ e }) => {
    const value = e?.value?.replace(',', '.');
    const calculeteRes = calculateLightUnits(value);
    setForm((prevState) => ({
      ...prevState,
      [`${field}InLux`]: value,
      [field]: calculeteRes,
    }));
  };

  return (
    <Box direction="row" width="100%" crossAlign="center" align="space-between">
      <Item ratio={0} baseSize={'60%'}>
        {tooltipText && <Tooltip target={ `#id_tool_${field}` }
          contentRender={() => <p>{tooltipText}</p>}
          position="right"
          showEvent="dxhoverstart"
          hideEvent="dxhoverend"
        />}
        <span id={ `id_tool_${field}` } style={{ width: 'fit-content' }}>
          {title}
        </span>
      </Item>
      <Item ratio={0} baseSize={'40%'}>
        <div style={{ width: '100%' }}>
          {luxUnits &&
          <TextBox
            stylingMode={'outlined'}
            placeholder={placeholder}
            width={'100%'}
            onValueChanged={(e) => onChange({ e })}
            value={defaultLuxValue}
            disabled={blocked}
          >
            <Validator validationGroup={validationGroup}>
              <RequiredRule message={required} />
              <PatternRule
                pattern={pNum_5_2}
                message={'тільки цифри максимум 2 знака пілся коми'}
              />
            </Validator>
          </TextBox>
          }
          <TextBox
            className={(defaultValue < normMin || defaultValue > normMax) &&
            styles.border_red}
            stylingMode={'outlined'}
            placeholder={luxUnits ? 'значення в кд' : placeholder}
            width={'100%'}
            onValueChanged={(e) => onValueChanged({ e, setForm, field })}
            value={defaultValue}
            disabled={blocked || luxUnits}
          >
            <Validator validationGroup={validationGroup}>
              <RequiredRule message={`${fieldText} ${title} ${required}`} />
              <PatternRule
                pattern={patternOnlyDigits}
                message={`${fieldText} ${title} - ${messageOnlyDigits}`}
              />
            </Validator>
          </TextBox>
        </div>
      </Item>
    </Box>
  );
};

LightFieldInput.propTypes = {
  title: PropTypes.string,
  radioGroupData: PropTypes.array,
  field: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  codeInconsistency: PropTypes.array,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  blocked: PropTypes.bool,
  validationGroup: PropTypes.string,
  tooltipText: PropTypes.string,
  normMin: PropTypes.number,
  normMax: PropTypes.number,
  luxUnits: PropTypes.bool,
};
