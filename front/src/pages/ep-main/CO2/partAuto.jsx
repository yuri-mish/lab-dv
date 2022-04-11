import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import dayjs from 'dayjs';
import { useDate } from '../../../hooks';
import { useApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import { showError } from 'utils/notify.js';
import { messages } from 'messages';

import {
  TextBox,
  TextArea,
  DateBox,
  SelectBox,
} from 'devextreme-react';

import Validator, {
  RequiredRule,
  PatternRule,
  StringLengthRule,
  RangeRule,
} from 'devextreme-react/validator';

import styles from '../styles/ep-main.module.scss';
//components
import { CarNumSearch } from 'components/car-num-search/car-num-search';
import { FormField } from 'components/form-field/form-field';
import { TextLine } from '../components/text-line';

import {
  mockText,
  fuel_type_list,
  turbine_compressor_list,
  ecological_list,
  car_color_list,
  re_equipment_name_list,
} from 'moks/moksData';
import { pNum, pNum_3_3,
  pVINCode_1, pVINCode_2 } from 'moks/patterns';

import { dateShortFormatL } from 'utils/date-formats';

import { required } from 'pages/ep-main/constants';
import { getNomsData } from './backend-data';

const getBrands = loader('../gql/getCarBrands.graphql');

export const Auto = ({ data = {}, handleFieldValueChange = () => {},
  setData = () => {} }) => {
  const gqlClient = useApolloClient();
  const { today, formatDate } = useDate();
  const [ category_KTZ_list, setCategory_KTZ_list ] = useState([]);
  const [ brandList, setBrandList ] = useState([]);

  const handleDateChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.element.id]: formatDate(e.value),
    }));
  };
  const handleSelectionChanged = (e) => {
    setData((prev) => ({
      ...prev,
      [e.element.id]: e?.selectedItem?.value || '',
      [`${e.element.id}_text`]: e?.selectedItem?.text || '',
      carrying: '',
    }));
  };
  const handleOnSerchCar = (data) => {
    if (data) {
      setData((prev) => ({
        ...prev,
        car_brand: data?.car_brand || '',
        car_color: data?.car_color || '',
        vin: data?.vin || '',
        manufacture_date: data?.manufacture_date || '',
        carrying: data?.carrying?.toString() || '',
        fuel_type: data?.fuel_type || '',
        car_model: data?.car_model || '',
      }));
    }
  };
  const getBrandsData = () => {
    gqlClient
      .query({
        query: getBrands,
        variables: {},
      })
      .then((response) => {
        const res = response?.data?.car_brand;
        if (res) {
          setBrandList(res?.map((item) => item?.name) || []);
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
  };
  useEffect(() => {
    getBrandsData();
    getNomsData({ setCategory_KTZ_list, gqlClient });
  }, []);
  return (<>
    <TextLine text={'Данні авто'} />
    <div className={`${styles?.df} ${styles?.df_wrap}`}>
      <div className={styles?.left_block}>
        <FormField text={mockText?.auto?.vin +
        (data?.vin?.length ? `(${ data?.vin?.length })` : '')}
        mrBottom = {true}>
          <TextBox
            id={'vin'}
            value={data?.vin?.replaceAll(/[ioіо ]/gi, '').toUpperCase()}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            maxLength={17}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.vin} - ${required}`}
              />
              <PatternRule
                pattern={pVINCode_1}
                message
                  ="не використовуйте спеціальні символи крім - '\'"
              />
              <PatternRule
                pattern={pVINCode_2}
                message="символи: 'і','о' - заборонені"
              />
              <StringLengthRule
                min={3}
                max={17}
                message="не меньше 3 символів"
              />
            </Validator>
          </TextBox>
        </FormField>

        <FormField text={mockText?.auto?.number} mrBottom = {true}>
          <CarNumSearch
            id={'car_number'}
            value={data?.car_number?.toUpperCase()}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'170px'}
            readOnly={!data.draft}
            onSerch={handleOnSerchCar}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.number} - ${required}`}
              />
            </Validator>
          </CarNumSearch>
          {/* <TextBox
            id={'car_number'}
            value={data?.car_number?.toUpperCase()}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.number} - ${required}`}
              />
            </Validator>
          </TextBox> */}
        </FormField>

        <FormField text={mockText?.auto?.manufacture_date}
          mrBottom = {true}>
          <DateBox
            value={data?.manufacture_date}
            id="manufacture_date"
            type="date"
            displayFormat={'yyyy'}
            useMaskBehavior={true}
            stylingMode={'outlined'}
            onValueChanged={handleDateChange}
            hint={mockText?.auto?.manufacture_date}
            max={today}
            width={'200px'}
            readOnly={!data.draft}
            calendarOptions={{
              zoomLevel: 'year',
              maxZoomLevel: 'year',
            }}
          >
            <Validator>
              <RequiredRule
                message={`${mockText
                  ?.auto?.manufacture_date} - ${required}`}
              />
            </Validator>
          </DateBox>
        </FormField>
        <FormField text={mockText?.auto?.first_registration_date}
          mrBottom = {true}>
          <DateBox
            value={data?.first_registration_date}
            id="first_registration_date"
            type="date"
            displayFormat={dateShortFormatL}
            useMaskBehavior={true}
            stylingMode={'outlined'}
            onValueChanged={handleDateChange}
            hint={mockText?.auto?.first_registration_date}
            min={data?.manufacture_date}
            max={today}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText
                  ?.auto?.first_registration_date} - ${required}`}
              />
            </Validator>
          </DateBox>
        </FormField>
        <FormField text={mockText?.auto?.last_registration_date}
          mrBottom = {true}>
          <DateBox
            value={data?.last_registration_date}
            id="last_registration_date"
            type="date"
            displayFormat={dateShortFormatL}
            useMaskBehavior={true}
            stylingMode={'outlined'}
            onValueChanged={handleDateChange}
            hint={mockText?.auto?.last_registration_date}
            min={data?.first_registration_date}
            max={today}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText
                  ?.auto?.last_registration_date} - ${required}`}
              />
            </Validator>
          </DateBox>
        </FormField>
        <FormField text={mockText?.auto?.category_KTZ} mrBottom={true}>
          <SelectBox
            id={'category_KTZ'}
            items={category_KTZ_list}
            onSelectionChanged={handleSelectionChanged}
            value={data?.category_KTZ || null}
            displayExpr="text"
            valueExpr="value"
            searchEnabled={true}
            showClearButton={true}
            stylingMode={'outlined'}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message=
                  {`${mockText?.auto?.category_KTZ} - ${required}`}
              />
            </Validator>
          </SelectBox>
        </FormField>
        <FormField text={mockText?.auto?.carrying} mrBottom = {true}>
          <TextBox
            id={'carrying'}
            value={data?.carrying}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            readOnly={!data.draft}
            disabled={!(data?.category_KTZ_text === 'N2' ||
            data?.category_KTZ_text === 'N3' ||
            data?.category_KTZ_text === 'O3' ||
            data?.category_KTZ_text === 'O4')}
          >
            <Validator>
              <RequiredRule
                message=
                  {`${mockText.auto.carrying} - ${required}`}
              />
              <PatternRule
                pattern={pNum_3_3}
                message="використовуйте формат для вводу: 3 | 1,725 "
              />
            </Validator>
          </TextBox>
        </FormField>
        <br />
        <br />
        <FormField text={mockText?.auto?.re_equipment_date}
          mrBottom = {true}>
          <DateBox
            value={data?.re_equipment_date}
            id="re_equipment_date"
            type="date"
            displayFormat={dateShortFormatL}
            useMaskBehavior={true}
            stylingMode={'outlined'}
            onValueChanged={handleDateChange}
            hint={mockText?.auto?.re_equipment_date}
            max={today}
            width={'200px'}
            readOnly={!data.draft}
          />
        </FormField>
        <FormField text={mockText?.auto?.re_equipment_doc_number}
          mrBottom = {true}>
          <TextBox
            id={'re_equipment_doc_number'}
            value={data?.re_equipment_doc_number}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            readOnly={!data.draft}
          />
        </FormField>
        <FormField text={mockText?.auto?.re_equipment_name}
          mrBottom = {true}>
          <SelectBox
            id={'re_equipment_name'}
            items={re_equipment_name_list}
            value={data?.re_equipment_name}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            readOnly={!data.draft}
          />
        </FormField>
        <FormField text={mockText?.auto?.re_equipment_description}
          mrBottom = {true}>
          <TextArea
            id={'re_equipment_description'}
            value={data?.re_equipment_description}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft}
          />
        </FormField>
      </div>
      <div className={styles?.right_block}>
        <FormField text={mockText?.auto?.car_brand} mrBottom = {true}
          dfGrow = {true}>
          <SelectBox
            id={'car_brand'}
            items={brandList}
            onValueChanged={handleFieldValueChange}
            value={data?.car_brand || null}
            searchEnabled={true}
            showClearButton={true}
            deferRendering={false}
            stylingMode={'outlined'}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.car_brand} - ${required}`}
              />
            </Validator>
          </SelectBox>
        </FormField>
        <FormField text={mockText?.auto?.car_model} mrBottom = {true}
          dfGrow = {true}>
          <TextBox
            id={'car_model'}
            value={data?.car_model}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.car_model} - ${required}`}
              />
            </Validator>
          </TextBox>
        </FormField>
        <FormField text={mockText?.auto?.fuel_type} mrBottom = {true}
          dfGrow = {true}>
          <SelectBox
            id={'fuel_type'}
            items={fuel_type_list}
            onValueChanged={handleFieldValueChange}
            value={data?.fuel_type || null}
            searchEnabled={true}
            showClearButton={true}
            stylingMode={'outlined'}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.fuel_type} - ${required}`}
              />
            </Validator>
          </SelectBox>
        </FormField>
        <FormField text={mockText?.auto?.car_color} mrBottom = {true}
          dfGrow = {true}>
          <SelectBox
            id={'car_color'}
            items={car_color_list}
            value={data?.car_color}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.car_color} - ${required}`}
              />
            </Validator>
          </SelectBox>
        </FormField>
        <FormField text={mockText?.auto?.odometer} mrBottom = {true}
          dfGrow = {true}>
          <TextBox
            id={'odometer'}
            value={data?.odometer}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.odometer} - ${required}`}
              />
              <PatternRule pattern={pNum} message="тільки цифри" />
            </Validator>
          </TextBox>
        </FormField>
        <FormField text={mockText?.auto?.turbine_compressor}
          mrBottom = {true} dfGrow = {true}>
          <SelectBox
            id={'turbine_compressor'}
            items={turbine_compressor_list}
            onValueChanged={handleFieldValueChange}
            value={data?.turbine_compressor || null}
            searchEnabled={true}
            showClearButton={true}
            stylingMode={'outlined'}
            width={'200px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule message={required} />
            </Validator>
          </SelectBox>
        </FormField>
        <br />
        <br />
        <FormField text={mockText?.auto?.cylinders} mrBottom = {true}
          dfGrow = {true}>
          <TextBox
            id={'cylinders'}
            value={data?.cylinders}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'200px'}
            readOnly={!data?.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.cylinders} - ${required}`}
              />
              <PatternRule pattern={pNum} message="тільки цифри" />
              <RangeRule max={24} min={1}
                message="допустиме значеня від 1 до 24"/>
            </Validator>
          </TextBox>
        </FormField>
        <FormField text={mockText?.auto?.ecological} mrBottom = {true}
          dfGrow = {true}>
          <SelectBox
            id={'ecological'}
            items={ecological_list}
            onValueChanged={handleFieldValueChange}
            value={data?.ecological || null}
            searchEnabled={true}
            showClearButton={true}
            stylingMode={'outlined'}
            width={'200px'}
            readOnly={!data?.draft}
            wrapItemText={true}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.ecological} - ${required}`}
              />
            </Validator>
          </SelectBox>
        </FormField>
      </div>
    </div>
    <br />
  </>
  );
};

Auto.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  handleFieldValueChange: PropTypes.func,
};

export default Auto;
