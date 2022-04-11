import React from 'react';
import PropTypes from 'prop-types';

import { TextBox } from 'devextreme-react';

import Validator, {
  RequiredRule,
  PatternRule,
  RangeRule,
} from 'devextreme-react/validator';

import styles from '../styles/ep-main.module.scss';
//components
import { ColumnField } from '../components/column-field';

import { mockText } from 'moks/moksData';
import { pTemperature, pNum_3_1, pNum_2_1 } from 'moks/patterns';

import { required } from 'pages/ep-main/constants';

export const InspectConditions = ({ data = {},
  handleFieldValueChange = () => {} }) => (<>
  <div className={`${styles?.df_space_around} 
      ${styles?.df_wrap} ${styles?.mr_wrap}`}>
    <ColumnField text={mockText?.auto?.air_temperature}>
      <TextBox
        id={'air_temperature'}
        value={data?.air_temperature}
        stylingMode={'outlined'}
        onValueChanged={handleFieldValueChange}
        width={'200px'}
        readOnly={!data.draft}
      >
        <Validator>
          <RequiredRule
            message=
              {`${mockText?.auto?.air_temperature} - ${required}`}
          />
          <PatternRule
            pattern={pTemperature}
            message={`використовуйте формат для вводу: +10
              | +10,5 | -10 | -10,5`}
          />
          <RangeRule
            min={5}
            max={35}
            message="значення має бути не меньше +5 i не більше +35"
          />
        </Validator>
      </TextBox>
    </ColumnField>
    <ColumnField text={mockText?.auto?.humidity}>
      <TextBox
        id={'humidity'}
        value={data?.humidity}
        stylingMode={'outlined'}
        onValueChanged={handleFieldValueChange}
        width={'200px'}
        readOnly={!data.draft}
      >
        <Validator>
          <RequiredRule
            message={`${mockText?.auto?.humidity} - ${required}`}
          />
          <PatternRule
            pattern={pNum_2_1}
            message="використовуйте формат для вводу: 40 | 40,5 "
          />
          <RangeRule
            min={10}
            max={80}
            message="значення має бути не меньше 10 i не більше 80"
          />
        </Validator>
      </TextBox>
    </ColumnField>
    <ColumnField text={mockText?.auto?.atmospheric_pressure}>
      <TextBox
        id={'atmospheric_pressure'}
        value={data?.atmospheric_pressure}
        stylingMode={'outlined'}
        onValueChanged={handleFieldValueChange}
        width={'200px'}
        readOnly={!data?.draft}
      >
        <Validator>
          <RequiredRule
            message={`${mockText?.auto
              ?.atmospheric_pressure} - ${required}`}
          />
          <PatternRule
            pattern={pNum_3_1}
            message="використовуйте формат для вводу: 100 | 100,5 "
          />
          <RangeRule
            min={92}
            max={107}
            message="значення має бути не меньше 92 i не більше 107"
          />
        </Validator>
      </TextBox>
    </ColumnField>
  </div>
  <br />
</>
);

InspectConditions.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  handleFieldValueChange: PropTypes.func,
};

export default InspectConditions;
