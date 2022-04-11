import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { RadioGroup } from 'devextreme-react/radio-group';
// import { SelectBox } from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';
import Box, { Item } from 'devextreme-react/box';
import Validator, {
  PatternRule,
  RequiredRule,
} from 'devextreme-react/validator';

import { onObjRBChanged, onObjValueChanged } from 'utils/ep-form';

import {
  required,
  fieldText,
  patternOnlyDigits,
  messageOnlyDigits,
} from 'pages/ep-main/constants';
import { SelectCodeDescription } from './select-code-description';
import styles from './epFormField.module.scss';

export const EpFormFieldMovingFrequency = (props) => {
  const {
    title,
    radioGroupData,
    placeholder,
    disabled,
    value,
    setForm,
    field,
    codeInconsistency,
    blocked,
    validationGroup,
    textBoxMin,
  } = props;
  useEffect(() => {
    if (value?.result < textBoxMin) {
      onObjRBChanged({ e: { value: 'Ні' }, setForm, field });
    } else {
      onObjRBChanged({ e: { value: 'Так' }, setForm, field });
    }
  }, [ value?.result ]);
  return (
    <Box direction="row" width="100%" align="space-between" >
      <Item ratio={0} baseSize={'40%'}>
        <span style={{ paddingRight: 10 }}>{title}</span>
      </Item>
      <Item ratio={0} baseSize={'11%'} >
        <TextBox
          style={{ marginRight: 10 }}
          className={textBoxMin > value?.result && styles?.border_orange }
          stylingMode={'outlined'}
          placeholder={placeholder}
          onValueChanged={
            (e) => onObjValueChanged({ e, setForm, field, subfield: 'result' })
          }
          value={value?.result}
          disabled={blocked || value?.general === 'Нз'}
        >
          <Validator validationGroup={validationGroup}>
            <RequiredRule message={`${fieldText} ${title} ${required}`} />
            <PatternRule
              pattern={patternOnlyDigits}
              message={`${fieldText} ${title} - ${messageOnlyDigits}`}
            />
          </Validator>
        </TextBox>
      </Item>
      <Item ratio={0} baseSize={'29%'}>
        <div className={styles.radioGroup_wrapper}>
          <RadioGroup
            dataSource={radioGroupData}
            layout="horizontal"
            onValueChanged={(e) => onObjRBChanged({ e, setForm, field })}
            value={value?.general}
            disabled={blocked}
          />
        </div>
      </Item>
      <Item ratio={0} baseSize={'20%'}>
        <SelectCodeDescription
          {...props}
          style={{ marginBottom: '10px' }}
          dataSource={codeInconsistency}
          setForm={setForm}
          field={field}
          selectValue={value?.code}
          textAreaValue={value?.description}
          disabled={blocked || disabled}
          validationGroup={validationGroup}
          required={true}
        />
        {/* <SelectBox
          {...props}
          style={{ marginBottom: '10px' }}
          dataSource={codeInconsistency}
          placeholder="Виберіть код"
          stylingMode={'outlined'}
          disabled={blocked || disabled}
          onValueChanged={
            (e) => onObjValueChanged({ e, setForm, field, subfield: 'code' })
          }
          value={value?.code}
        >
          <Validator validationGroup={validationGroup}>
            <RequiredRule message={`${fieldText} ${title} ${required}`} />
          </Validator>
        </SelectBox> */}
      </Item>
    </Box>
  );
};

EpFormFieldMovingFrequency.propTypes = {
  title: PropTypes.string,
  radioGroupData: PropTypes.array,
  field: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  codeInconsistency: PropTypes.array,
  disabled: PropTypes.bool,
  blocked: PropTypes.bool,
  placeholder: PropTypes.string,
  validationGroup: PropTypes.string,
  textBoxMin: PropTypes.number,
};
