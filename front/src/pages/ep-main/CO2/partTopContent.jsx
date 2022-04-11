import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import {
  TextBox,
} from 'devextreme-react';

import Validator, {
  RequiredRule,
} from 'devextreme-react/validator';

import styles from '../styles/ep-main.module.scss';
//components
import { FormField } from 'components/form-field/form-field';

import { PartnerSearch } from 'components/partner-search/partner-search';

import {
  mockText,
} from 'moks/moksData';

import { required } from 'pages/ep-main/constants';

export const TopContent = ({ data = {}, setData = () => {},
  handleFieldValueChange = () => {} }) => (
  <>
    <div className={`${styles?.df_space_between} ${styles?.df_wrap}`}>
      <div className={styles?.mr_right}>
        <p>{`${mockText.line_1} ${data?.suffix || ''}`}</p>
        <div>
          <FormField text={mockText?.line_city}>
            <TextBox
              id={'city'}
              value={data?.city}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={'300px'}
              readOnly={!data.draft || true}
            >
              <Validator>
                <RequiredRule
                  message={`${mockText?.line_city} - ${required}`}
                />
              </Validator>
            </TextBox>
          </FormField>
        </div>
        <p> {`${mockText?.line_type} ${data?.type}`}</p>
      </div>
      <div>
        <p>{`${mockText?.line_date} ${
                dayjs(data?.date).format('DD.MM.YYYY') || ''
              }`}</p>
        {data?.order?.number_doc &&
                <a href={`#/order/${data?.order?.ref || ''}`}>
                  {`${mockText.line_order}${data?.order?.number_doc || ''}`}
                </a>
        }
        <p>{`${mockText.line_EP}${data?.number_doc || ''}`}</p>
      </div>
    </div>
    <div>
      <label>{mockText?.line_user}</label>
      <PartnerSearch
        isRequired={true}
        stylingMode={'outlined'}
        partner={data?.partner}
        readOnly={!data.draft}
        onSelect={(e) => {
          setData((prev) => ({
            ...prev,
            partner: {
              ref: e.ref || '',
              name: e.name || '',
            },
          }));
        }}
        validator={
          <Validator>
            <RequiredRule
              message={`${mockText?.line_user} - ${required}`}/>
          </Validator>
        }
      />
    </div>
    <br />
    <div>
      <FormField text={mockText?.line_user_to_print}>
        <TextBox
          id={'partner_to_print'}
          value={data?.partner_to_print}
          stylingMode={'outlined'}
          onValueChanged={handleFieldValueChange}
          width={'320px'}
          readOnly={!data.draft}
        />
      </FormField>
    </div>
  </>
);

TopContent.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  handleFieldValueChange: PropTypes.func,
};

export default TopContent;
