import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import {
  TextBox,
  SelectBox,
} from 'devextreme-react';

import Validator, {
  RequiredRule,
} from 'devextreme-react/validator';

import styles from '../styles/ep-main.module.scss';

//components
import { ColumnField } from '../components/column-field';
import { PartnerSearch } from 'components/partner-search/partner-search';

import { Field } from '../components/field';

import {
  mockText,
  mockEKMTtext,
  serviceability_test_list,
} from 'moks/moksData';

import { required } from 'pages/ep-main/constants';
export const PartOne = ({
  data = {},
  setData = () => {},
  handleFieldValueChange = () => {},
}) => (

  <div className={`${styles?.df_space_between}
        ${styles?.col_reverse_950}`}>
    <div style={{ maxWidth: 1440, marginRight: 20, marginTop: 20 }}>
      <Field text={mockEKMTtext?.certificate}>
        <TextBox
          id={'certificate'}
          value={data?.certificate}
          stylingMode={'outlined'}
          onValueChanged={handleFieldValueChange}
          width={'300px'}
          readOnly={!data.draft}
        >
          <Validator>
            <RequiredRule
              message={`${mockEKMTtext?.certificate} - ${required}`}
            />
          </Validator>
        </TextBox>
      </Field>
      <Field text={mockText?.line_city}>
        <TextBox
          id={'service_address'}
          value={data?.service_address}
          stylingMode={'outlined'}
          onValueChanged={handleFieldValueChange}
          width={'300px'}
          readOnly={!data.draft}
        >
          <Validator>
            <RequiredRule
              message={
                      `${mockText?.line_city} - ${required}`
              }
            />
          </Validator>
        </TextBox>
      </Field>
      <ColumnField text={mockText?.line_user}
        className ={styles?.mr_bottom}>
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
      </ColumnField>
      <Field text={mockText?.line_user_to_print}>
        <TextBox
          id={'partner_to_print'}
          value={data?.partner_to_print}
          stylingMode={'outlined'}
          onValueChanged={handleFieldValueChange}
          width={'300px'}
          readOnly={!data.draft}
        />
      </Field>

      <Field text={`${mockEKMTtext?.serviceability_test} авто`} >
        <SelectBox
          id={'serviceability_test'}
          items={serviceability_test_list}
          onValueChanged={handleFieldValueChange}
          value={data?.serviceability_test || null}
          searchEnabled={true}
          showClearButton={true}
          stylingMode={'outlined'}
          width={'300px'}
          readOnly={!data.draft}
        >
          <Validator>
            <RequiredRule
              message={`${mockEKMTtext?.serviceability_test} - ${required}`}
            />
          </Validator>
        </SelectBox>
      </Field>
      <Field text={mockEKMTtext?.contract_basis}>
        <TextBox
          id={'contract_basis'}
          value={data?.contract_basis}
          stylingMode={'outlined'}
          onValueChanged={handleFieldValueChange}
          width={'300px'}
          readOnly={!data.draft}
        >
          <Validator>
            <RequiredRule
              message={`${mockEKMTtext
                ?.contract_basis} - ${required}`}
            />
          </Validator>
        </TextBox>
      </Field>

    </div>
    <div style={{ minWidth: 220 }}>
      <div className ={styles?.mr_b_16}>
        {`${mockText.line_date}
              ${dayjs(data?.date).format('DD.MM.YYYY') || ''}`}
      </div>
      {data?.order?.number_doc &&
          <div className ={styles?.mr_b_16}>
            <a href={`#/order/${data?.order?.ref || ''}`}>
              {`${mockText.line_order}${data?.order?.number_doc || ''}`}
            </a>
          </div>
      }
      <div className ={styles?.mr_b_16}>
        {`${mockText.line_EP}${data?.number_doc || ''}`}
      </div>
      <div className ={styles?.mr_b_16}>
        {`${mockText.line_type} EKMT`}
      </div>
    </div>
  </div>

);

PartOne.propTypes = {
  data: PropTypes.object,
  today: PropTypes.object,
  setData: PropTypes.func,
  handleFieldValueChange: PropTypes.func,
  handleDateChange: PropTypes.func,
};
export default PartOne;
