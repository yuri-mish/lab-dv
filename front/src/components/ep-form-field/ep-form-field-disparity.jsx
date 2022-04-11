import PropTypes from 'prop-types';
import { RadioGroup } from 'devextreme-react/radio-group';
import Box, { Item } from 'devextreme-react/box';
import { onObjRBChanged } from 'utils/ep-form';
import { styles } from './epFormField.module.scss';
import { SelectCodeDescription } from './select-code-description';
export const EpFormFieldDisparity = (props) => {
  const {
    title,
    radioGroupData,
    field,
    setForm,
    value,
    codeInconsistency,
    disabled,
    blocked,
    validationGroup,
  } = props;

  const defaultSelectValue = value?.code;
  const defaultRadioValue = value?.general;

  return (
    <Box direction="row" width="100%" crossAlign="center" align="space-between">
      <Item ratio={0} baseSize={'20%'}>
        <span>{title}</span>
      </Item>
      <Item ratio={0} baseSize={'30%'}>
        <RadioGroup
          dataSource={radioGroupData}
          layout="horizontal"
          onValueChanged={(e) => onObjRBChanged({ e, setForm, field })}
          value={defaultRadioValue}
          disabled={blocked}
        />
      </Item>
      <Item ratio={0} baseSize={'25%'}>
        <span className={styles?.p_0_10}>Код невідповідності</span>
      </Item>
      <Item ratio={0} baseSize={'25%'}>
        <SelectCodeDescription
          {...props}
          style={{ width: '100%' }}
          dataSource={codeInconsistency}
          field={field}
          setForm={setForm}
          disabled={blocked || disabled}
          selectValue={defaultSelectValue}
          textAreaValue={value?.description}
          validationGroup={validationGroup}
          required={true}
        />
      </Item>
    </Box>
  );
};

EpFormFieldDisparity.propTypes = {
  title: PropTypes.string,
  radioGroupData: PropTypes.array,
  field: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  codeInconsistency: PropTypes.array,
  disabled: PropTypes.bool,
  blocked: PropTypes.bool,
  validationGroup: PropTypes.string,
};
