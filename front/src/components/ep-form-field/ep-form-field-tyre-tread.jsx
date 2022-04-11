import PropTypes from 'prop-types';
import { TextBox } from 'devextreme-react/text-box';
import Box, { Item } from 'devextreme-react/box';
import Validator, {
  PatternRule,
  RequiredRule,
} from 'devextreme-react/validator';

import {
  fieldText,
  required,
  patternOnlyDigits,
  messageOnlyDigits,
} from 'app-constants';

import styles from './epFormField.module.scss';

export const EpFormFieldTyreTread = (props) => {
  const { setForm, field, value, title } = props;

  const onChange = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: e.value,
    }));
  };

  return (
    <Box direction="row" width="100%" align="center">
      <Item ratio={0} baseSize={'60%'}>
        <span>{title}</span>
      </Item>
      <Item ratio={0} baseSize={'40%'}>
        <div className={styles.input_label}>
          <span>Виміряне значення</span>
          <TextBox
            width={410}
            stylingMode={'outlined'}
            onValueChanged={onChange}
            value={value[field]}
          >
            <Validator>
              <RequiredRule message={`${fieldText} 
                            вимірянне значення - ${required}`} />
              <PatternRule
                pattern={patternOnlyDigits}
                message={`${fieldText} 
                        вимірянне значення - ${messageOnlyDigits}`}
              />
            </Validator>
          </TextBox>
        </div>
      </Item>
    </Box>
  );
};

EpFormFieldTyreTread.propTypes = {
  title: PropTypes.string,
  field: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
};
