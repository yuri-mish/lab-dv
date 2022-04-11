import PropTypes from 'prop-types';
import { RadioGroup } from 'devextreme-react/radio-group';

import { onObjRBChanged } from 'utils/ep-form';
import { SelectCodeDescription } from './select-code-description';

import styles from './epFormField.module.scss';

export const EpFormFieldSelect = (props) => {
  const {
    title,
    radioGroupData,
    field,
    setForm,
    disabled,
    value,
    codeInconsistency,
    blocked = false,
    validationGroup,
  } = props;

  const defaultSelectValue = value?.code;
  const defaultTextAreaValue = value?.description;
  const defaultRadioValue = value?.general;
  return (
    <div style ={{ display: 'flex', flexDirection: 'row', width: '100%',
      justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flex: '0 1 40%' }}>
        <span>{title}</span>
      </div>
      <div style={{ display: 'flex', flex: '0 1 30%' }}>
        <RadioGroup
          className={styles.radioGroup_wrapper}
          {...props}
          dataSource={radioGroupData}
          layout="horizontal"
          onValueChanged={(e) => onObjRBChanged({ e, setForm, field })}
          value={defaultRadioValue}
          disabled={blocked}
        />
      </div>
      <div style={{ display: 'flex', flex: '0 1 30%' }}>
        <SelectCodeDescription
          {...props}
          style={{ width: '100%' }}
          dataSource={codeInconsistency}
          setForm={setForm}
          field={field}
          selectValue={defaultSelectValue}
          textAreaValue={defaultTextAreaValue}
          disabled={blocked || disabled}
          validationGroup={validationGroup}
          required={true}
        />
      </div>
    </div>
  );
};

EpFormFieldSelect.propTypes = {
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
