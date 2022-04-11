import PropTypes from 'prop-types';

import {
  TextBox,
  // CheckBox,
} from 'devextreme-react';
import { RadioGroup } from 'devextreme-react/radio-group';

import Validator, {
  RequiredRule,
} from 'devextreme-react/validator';

import styles from '../styles/ep-main.module.scss';
//components
import { TextLine } from '../components/text-line';
import { Field } from '../components/field';

import { mockTahoText } from 'moks/moksData';
import { required } from 'pages/ep-main/constants';

export const PartConfirm = ({
  data = {},
  handleFieldValueChange = () => {},
}) => (
  <>
    <TextLine />
    <div className={`${styles.row_2x_950} ${styles.max_w_1440}`}>
      <div>
        <Field text={mockTahoText?.worker_position}>
          <TextBox
            id={'worker_position'}
            value={data?.worker_position}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={
              `${mockTahoText?.worker_position} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
      </div>
      <div>
        <Field text={mockTahoText?.worker_name}>
          <TextBox
            id={'worker_name'}
            value={data?.worker_name}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={
              `${mockTahoText?.worker_name} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
      </div>
    </div>
    <div style={{ fontSize: 'inherit', marginBottom: 20,
      display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      <span>{mockTahoText?.confirm}</span>
      <span style={{ padding: '0 15px' }}>
        {data?.authorized_person || '________________'}
      </span>
      <span>{mockTahoText?.dont_have_claims}</span>
      <RadioGroup
        style={{ padding: '0 15px' }}
        layout={'horizontal'}
        id={'dont_have_claims'}
        onValueChanged={handleFieldValueChange}
        dataSource={ [ 'маю', 'не маю' ] }
        value={ data?.dont_have_claims || 'не маю' }
        readOnly={!data.draft}
      />
    </div>
    <div className={`${styles.row_2x_950} ${styles.max_w_1440}`}>
      <div>
        <Field text={mockTahoText?.letterhead_number}>
          <TextBox
            id={'letterhead_number'}
            value={data?.letterhead_number}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={!data.draft}
          />
        </Field>
      </div>
    </div>
  </>
);

PartConfirm.propTypes = {
  data: PropTypes.object,
  handleFieldValueChange: PropTypes.func,
};

export default PartConfirm;
