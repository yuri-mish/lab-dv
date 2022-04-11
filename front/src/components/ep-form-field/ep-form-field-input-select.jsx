import PropTypes from 'prop-types';

import { TextBox } from 'devextreme-react/text-box';
import Box, { Item } from 'devextreme-react/box';

import { onObjValueChanged } from 'utils/ep-form';

import Validator, {
  PatternRule,
  RequiredRule,
} from 'devextreme-react/validator';
import { pNum_2_1, pNum } from 'moks/patterns';
import { SelectCodeDescription } from './select-code-description';
import styles from './epFormField.module.scss';

export const EpFormFieldInputSelect = (props) => {
  const {
    title,
    field,
    setForm,
    codeInconsistency,
    placeholder = '',
    value,
    blocked = false,
    category_KTZ = '',
    pkValue = '',
    normToProtectorHeight = '',
    inputDisabled = false,
    validationGroup,
    patternNumDot = false,
  } = props;
  const defaultInputValue = value?.general;
  const required = !!(pkValue && pkValue < defaultInputValue) ||
    !!(normToProtectorHeight && normToProtectorHeight > defaultInputValue);
  return (
    <Box direction="row" width="100%" crossAlign="center" align="space-between">
      <Item baseSize={'20%'}>
        <span style={{ paddingRight: '10px' }}>
          {title}: {category_KTZ} {pkValue && `(${pkValue})`}
          {normToProtectorHeight && `(не меньше ${normToProtectorHeight})`}
        </span>
      </Item>
      <Item baseSize={'30%'}>
        <div style={{ paddingRight: '10px', width: '100%' }}>
          <TextBox
            className={required && styles?.border_red}
            width={'100%'}
            stylingMode={'outlined'}
            placeholder={placeholder}
            onValueChanged={
              (e) => onObjValueChanged({ e, setForm, field,
                subfield: 'general' })
            }
            value={defaultInputValue}
            disabled={blocked || inputDisabled}
          >
            <Validator validationGroup={validationGroup}>
              <RequiredRule
                message={`${title} є обов'язковим полем`}
              />
              {!patternNumDot &&
                <PatternRule pattern={pNum} message="Лише цифри" />
              }
              {patternNumDot &&
                <PatternRule
                  pattern={pNum_2_1}
                  message="Лише цифри: 10 | 10,5 | 10.5"
                />}
            </Validator>
          </TextBox>
        </div>
      </Item>
      <Item ratio={0} baseSize={'25%'} >
        <span style={{ paddingRight: '10px' }}>
          Код невідповідності
        </span>
      </Item>
      <Item ratio={0} baseSize={'25%'}>
        <SelectCodeDescription
          {...props}
          style={{ width: '100%' }}
          dataSource={codeInconsistency}
          field={field}
          setForm={setForm}
          disabled={blocked}
          selectValue={value?.code}
          textAreaValue={value?.description}
          required={required}
          validationGroup={validationGroup}
        />
      </Item>
    </Box>
  );
};

EpFormFieldInputSelect.propTypes = {
  title: PropTypes.string,
  radioGroupData: PropTypes.array,
  field: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  codeInconsistency: PropTypes.array,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  blocked: PropTypes.bool,
  category_KTZ: PropTypes.string,
  pkValue: PropTypes.number,
  normToProtectorHeight: PropTypes.number,
  inputDisabled: PropTypes.bool,
  validationGroup: PropTypes.string,
  patternNumDot: PropTypes.bool,
};
