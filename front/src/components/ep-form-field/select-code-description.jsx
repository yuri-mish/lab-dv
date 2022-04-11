import PropTypes from 'prop-types';
import { SelectBox } from 'devextreme-react/select-box';
import { TextArea } from 'devextreme-react/text-area';
import Validator, { RequiredRule } from 'devextreme-react/validator';

import { onObjValueChanged, onValueChanged } from 'utils/ep-form';
import { unexpectedCodeInconsistencyText } from 'pages/ep-main/constants';
import styles from './epFormField.module.scss';

export const SelectCodeDescription = (props) => {
  const {
    title = '',
    dataSource,
    setForm,
    field,
    selectValue,
    textAreaValue,
    disabled,
    validationGroup,
    required = false,
    noSubfield = false,
  } = props;

  // const defaultSelectValue = value?.code;

  // const defaultRadioValue = value?.general;

  return (
    <div width={'100%'}>
      <SelectBox
        {...props}
        style={{ width: '100%' }}
        dataSource={dataSource}
        onValueChanged={(e) => (noSubfield ?
          onValueChanged({ e, setForm, field: 'code' }) :
          onObjValueChanged({ e, setForm, field,
            subfield: 'code' }))}
        placeholder="Виберіть код"
        stylingMode={'outlined'}
        disabled={disabled}
        value={selectValue}
      >
        <Validator validationGroup={validationGroup}>
          {required && <RequiredRule
            message={`Випадаючий список ${title} є обов'язковим полем`}
          /> }
        </Validator>
      </SelectBox>
      {selectValue === unexpectedCodeInconsistencyText &&
          <TextArea
            {...props}
            style={{ width: '100%' }}
            className={styles?.text_area_wrap}
            onValueChange={(e) => (noSubfield ? onValueChanged(
              { e: { value: e }, setForm, field: 'description' }) :
              onObjValueChanged({ e: { value: e }, setForm, field,
                subfield: 'description' }))}
            value={textAreaValue}
            disabled={disabled}
            stylingMode={'outlined'}
            placeholder={'Опис несправності'}
          >
            <Validator validationGroup={validationGroup}>
              {required && <RequiredRule
                message={`Опис несправності ${title} є обов'язковим полем`}
              />}
            </Validator>
          </TextArea>
      }
    </div>
  );
};

SelectCodeDescription.propTypes = {
  title: PropTypes.string,
  dataSource: PropTypes.array,
  setForm: PropTypes.func,
  field: PropTypes.string,
  onTextAreaChanged: PropTypes.func,
  selectValue: PropTypes.string,
  textAreaValue: PropTypes.string,
  disabled: PropTypes.bool,
  validationGroup: PropTypes.string,
  required: PropTypes.bool,
  noSubfield: PropTypes.bool,
};
