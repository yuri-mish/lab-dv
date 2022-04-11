import PropTypes from 'prop-types';
import { RadioGroup } from 'devextreme-react/radio-group';
import { TextBox } from 'devextreme-react/text-box';
import Box, { Item } from 'devextreme-react/box';
import Validator,
{ RequiredRule, PatternRule } from 'devextreme-react/validator';
import styles from './epFormField.module.scss';
import { onObjRBChanged, onObjValueChanged } from 'utils/ep-form';
import { pNum } from 'moks/patterns';

export const EpFormFieldInput = ({
  title,
  radioGroupData,
  placeholder,
  field,
  setForm,
  value,
  blocked,
  validationGroup,
  normMinRed,
  normMaxRed,
}) => {
  const defaultInputValue = value?.result;

  const defaultRadioValue = value?.general;
  const onRadioChanged = (e) => {
    onObjRBChanged({ e, setForm, field });
    if (e?.value === 'Нз') {
      const e = { value: null };
      onObjValueChanged({ e, setForm, field, subfield: 'result' });
    }
  };
  const onTextBoxChanged = (e) => {
    onObjValueChanged({ e, setForm, field, subfield: 'result' });
    if (e?.value < normMinRed) {
      onObjRBChanged({ e: { value: 'Ні' }, setForm, field });
    } else if (e?.value > normMinRed) {
      onObjRBChanged({ e: { value: 'Так' }, setForm, field });
    }
  };

  return (
    <Box direction="row" width="100%" crossAlign="center" align="space-between">
      <Item ratio={0} baseSize={'40%'}>
        <span>{title}</span>
      </Item>
      <Item ratio={0} baseSize={'30%'}>
        <TextBox
          className={(defaultInputValue < normMinRed ||
            defaultInputValue > normMaxRed) && styles?.border_red}
          stylingMode={'outlined'}
          placeholder={placeholder}
          width={'calc(100% - 40px)'}
          onValueChanged={
            (e) => {
              console.log(e);
              onTextBoxChanged(e);
            }
          }
          value={defaultInputValue}
          disabled={blocked || value?.general === 'Нз'}
        >
          <Validator validationGroup={validationGroup}>
            <RequiredRule
              message={`${placeholder} ${title} є обов'язковим полем`}
            />
            <PatternRule pattern={pNum} message="тільки цифри" />
          </Validator>
        </TextBox>
      </Item>
      <Item ratio={0} baseSize={'30%'}>
        <RadioGroup
          style={{ padding: '7px' }}
          dataSource={radioGroupData}
          layout="horizontal"
          onValueChanged={onRadioChanged}
          value={defaultRadioValue}
          disabled={blocked}
        />
      </Item>
    </Box>
  );
};

EpFormFieldInput.propTypes = {
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
  normMinRed: PropTypes.number,
  normMaxRed: PropTypes.number,

};
