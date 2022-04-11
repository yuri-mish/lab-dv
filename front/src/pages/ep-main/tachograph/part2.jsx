import PropTypes from 'prop-types';

import {
  TextBox,
  DateBox,
  SelectBox,
  TagBox,
} from 'devextreme-react';

import Validator, {
  RequiredRule,

} from 'devextreme-react/validator';

import styles from '../styles/ep-main.module.scss';

//components
import { TextLine } from '../components/text-line';
import { Field } from '../components/field';

import {
  mockTahoText,
  tachograph_type_list,
  reason_to_check_list,
  checking_by_using_list,
} from 'moks/moksData';
import { required } from 'pages/ep-main/constants';

// import { dateShortFormatL } from 'utils/date-formats';

export const PartTwo = ({
  data = {},
  today = '',
  handleFieldValueChange = () => {},
  handleDateChange = () => {},
}) => (
  <>
    <TextLine text={'Данні тахографа'} />
    <div className={`${styles.row_2x_950} ${styles.max_w_1440}`}>
      <div>
        <Field text={mockTahoText?.tachograph_model}>
          <TextBox
            id={'tachograph_model'}
            value={data?.tachograph_model}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={
                  `${mockTahoText?.tachograph_model} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.tachograph_type}>
          <SelectBox
            id={'tachograph_type'}
            items={tachograph_type_list}
            onValueChanged={handleFieldValueChange}
            value={data?.tachograph_type || null}
            searchEnabled={true}
            showClearButton={true}
            stylingMode={'outlined'}
            width={250}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockTahoText?.tachograph_type} - ${required}`}
              />
            </Validator>
          </SelectBox>
        </Field>
        <Field text={mockTahoText?.reason_to_check}>
          <SelectBox
            id={'reason_to_check'}
            items={reason_to_check_list}
            onValueChanged={handleFieldValueChange}
            value={data?.reason_to_check || null}
            searchEnabled={true}
            showClearButton={true}
            stylingMode={'outlined'}
            width={250}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockTahoText?.reason_to_check} - ${required}`}
              />
            </Validator>
          </SelectBox>
        </Field>
        <Field text={mockTahoText?.checking_by_using}>
          <TagBox
            id={'checking_by_using'}
            dataSource={checking_by_using_list}
            onValueChanged={handleFieldValueChange}
            value={data?.checking_by_using || null}
            stylingMode={'outlined'}
            readOnly={!data.draft}
            width={250}
            multiline={true}
            wrapItemText={true}
            applyValueMode={'useButtons'}
          />
        </Field>
      </div>
      <div>
        <Field text={mockTahoText?.tachograph_factory_number}>
          <TextBox
            id={'tachograph_factory_number'}
            value={data?.tachograph_factory_number}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={
                  `${mockTahoText
                    ?.tachograph_factory_number} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.tachograph_maker}>
          <TextBox
            id={'tachograph_maker'}
            value={data?.tachograph_maker}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={250}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={
                  `${mockTahoText?.tachograph_maker} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.tachograph_manufacture_date}>
          <DateBox
            value={data?.tachograph_manufacture_date}
            id="tachograph_manufacture_date"
            type="date"
            // displayFormat={dateShortFormatL}
            displayFormat={'MM-yyyy'}
            useMaskBehavior={true}
            stylingMode={'outlined'}
            onValueChanged={handleDateChange}
            hint={mockTahoText?.tachograph_manufacture_date}
            max={today}
            width={250}
            readOnly={!data.draft}
            calendarOptions={{
              zoomLevel: 'year',
              maxZoomLevel: 'year',
            }}
          >
            <Validator>
              <RequiredRule
                message={`${mockTahoText
                  ?.tachograph_manufacture_date} - ${required}`}
              />
            </Validator>
          </DateBox>
        </Field>
        <Field text={mockTahoText?.previous_check_date}>
          <DateBox
            value={data?.previous_check_date}
            id="previous_check_date"
            type="date"
            displayFormat={'yyyy'}
            useMaskBehavior={true}
            stylingMode={'outlined'}
            onValueChanged={handleDateChange}
            hint={mockTahoText?.previous_check_date}
            max={today}
            min={data?.tachograph_manufacture_date}
            width={250}
            readOnly={!data.draft}
            calendarOptions={{
              zoomLevel: 'year',
              maxZoomLevel: 'year',
            }}
          >
          </DateBox>
        </Field>
      </div>
    </div>
  </>
);

PartTwo.propTypes = {
  data: PropTypes.object,
  today: PropTypes.object,
  handleFieldValueChange: PropTypes.func,
  handleDateChange: PropTypes.func,
};
export default PartTwo;
