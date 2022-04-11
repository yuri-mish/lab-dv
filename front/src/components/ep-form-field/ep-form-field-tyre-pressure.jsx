import PropTypes from 'prop-types';
import { TextBox } from 'devextreme-react/text-box';
import Validator, {
  RequiredRule, PatternRule,
} from 'devextreme-react/validator';

import { fieldText, required } from 'pages/ep-main/constants';
import { pNum_2_1 } from 'moks/patterns';

import styles from './epFormField.module.scss';

export const EpFormFieldTyrePressure = (props) => {
  const { setForm, title, value, blocked = false, validationGroup } = props;

  const onChange = ({ e, field, subfield }) => {
    setForm((prevState) => {
      const prevField = prevState[field];

      return {
        ...prevState,
        [field]: {
          ...prevField,
          [subfield]: e.value,
        },
      };
    });
  };

  return (
    <div className={styles.field_wrapper}>
      <div className={styles.field_title}>{title}</div>

      <div className={styles.axis_wrapper}>
        <div className={styles.axis_item}>
          <div>1 вісь</div>
          <div className={styles.flex}>
            <TextBox
              width={60}
              stylingMode={'outlined'}
              value={value?.firstAxis?.first}
              onValueChanged={
                (e) => onChange({ e, field: 'firstAxis', subfield: 'first' })
              }
              disabled={blocked}
            >
              <Validator validationGroup={validationGroup}>
                <RequiredRule message={`${fieldText} 1 вісь - ${required}`} />
                <PatternRule
                  pattern={pNum_2_1}
                  message="Лише цифри: 10 | 10,5 | 10.5"
                />
              </Validator>
            </TextBox>
            <TextBox
              width={60}
              stylingMode={'outlined'}
              value={value?.firstAxis?.second}
              onValueChanged={
                (e) => onChange({ e, field: 'firstAxis', subfield: 'second' })
              }
              disabled={blocked}
            >
              <Validator validationGroup={validationGroup}>
                <RequiredRule message={`${fieldText} 1 вісь - ${required}`} />
                <PatternRule
                  pattern={pNum_2_1}
                  message="Лише цифри: 10 | 10,5 | 10.5"
                />
              </Validator>
            </TextBox>
          </div>
        </div>

        <div className={styles.axis_item}>
          <div>2 вісь</div>
          <div className={styles.flex}>
            <TextBox
              width={60}
              stylingMode={'outlined'}
              value={value?.secondAxis?.first}
              onValueChanged={
                (e) => onChange({ e, field: 'secondAxis', subfield: 'first' })
              }
              disabled={blocked}
            />
            <TextBox
              width={60}
              stylingMode={'outlined'}
              value={value?.secondAxis?.second}
              onValueChanged={
                (e) => onChange({ e, field: 'secondAxis', subfield: 'second' })
              }
              disabled={blocked}
            />
          </div>
        </div>

        <div className={styles.axis_item}>
          <div>3 вісь</div>
          <div className={styles.flex}>
            <TextBox
              width={60}
              stylingMode={'outlined'}
              value={value?.thirdAxis?.first}
              onValueChanged={
                (e) => onChange({ e, field: 'thirdAxis', subfield: 'first' })
              }
              disabled={blocked}
            >
              <Validator validationGroup={validationGroup}>
                <PatternRule
                  pattern={pNum_2_1}
                  message="Лише цифри: 10 | 10,5 | 10.5"
                />
              </Validator>
            </TextBox>
            <TextBox
              width={60}
              stylingMode={'outlined'}
              value={value?.thirdAxis?.second}
              onValueChanged={
                (e) => onChange({ e, field: 'thirdAxis', subfield: 'second' })
              }
            >
              <Validator validationGroup={validationGroup}>
                <PatternRule
                  pattern={pNum_2_1}
                  message="Лише цифри: 10 | 10,5 | 10.5"
                />
              </Validator>
            </TextBox>
          </div>
        </div>

        <div className={styles.axis_item}>
          <div>4 вісь</div>
          <div className={styles.flex}>
            <TextBox
              width={60}
              stylingMode={'outlined'}
              value={value?.fourthAxis?.first}
              onValueChanged={
                (e) => onChange({ e, field: 'fourthAxis', subfield: 'first' })
              }
              disabled={blocked}
            />
            <TextBox
              width={60}
              stylingMode={'outlined'}
              value={value?.fourthAxis?.second}
              onValueChanged={
                (e) => onChange({ e, field: 'fourthAxis', subfield: 'second' })
              }
              disabled={blocked}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

EpFormFieldTyrePressure.propTypes = {
  title: PropTypes.string,
  field: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  blocked: PropTypes.bool,
  validationGroup: PropTypes.string,
};
