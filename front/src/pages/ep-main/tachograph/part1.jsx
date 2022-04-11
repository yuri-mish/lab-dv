import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import { showError } from 'utils/notify.js';
import { messages } from 'messages';

import {
  TextBox,
  DateBox,
  SelectBox,
} from 'devextreme-react';

import Validator, {
  RequiredRule,
  PatternRule,
  StringLengthRule,
} from 'devextreme-react/validator';

import styles from '../styles/ep-main.module.scss';

//components
import { CarNumSearch } from 'components/car-num-search/car-num-search';
import { ColumnField } from '../components/column-field';
import { PartnerSearch } from 'components/partner-search/partner-search';

import { Field } from '../components/field';


import {
  mockText,
  mockTahoText,
} from 'moks/moksData';
import { pTextNum, pVINCode_1, pVINCode_2, pTextNumLat } from 'moks/patterns';

import { required } from 'pages/ep-main/constants';

const getBrands = loader('../gql/getCarBrands.graphql');

export const PartOne = ({
  data = {},
  today = '',
  setData = () => {},
  handleFieldValueChange = () => {},
  handleDateChange = () => {},
}) => {
  const gqlClient = useApolloClient();
  const [ brandList, setBrandList ] = useState([]);
  const handleOnSerchCar = (data) => {
    if (data) {
      setData((prev) => ({
        ...prev,
        car_brand: data?.car_brand || '',
        vin: data?.vin || '',
        manufacture_date: data?.manufacture_date || '',
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
  }, []);
  return (

    <div className={`${styles?.df_space_between}
        ${styles?.col_reverse_950}`}>
      <div style={{ maxWidth: 1440, marginRight: 20, marginTop: 20 }}>
        <Field text={mockTahoText?.previous_tachograph_service}>
          <TextBox
            id={'previous_tachograph_service'}
            value={data?.previous_tachograph_service}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft}
          ></TextBox>
        </Field>
        <Field text={mockTahoText?.tachograph_service}>
          <TextBox
            id={'tachograph_service'}
            value={data?.tachograph_service}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft || true}
          >
            <Validator>
              <RequiredRule
                message={
                      `${mockTahoText.tachograph_service} - ${required}`
                }
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.number_tachograph_service}>
          <TextBox
            id={'number_tachograph_service'}
            value={data?.number_tachograph_service}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockTahoText
                  ?.number_tachograph_service} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.workshop_card}>
          <TextBox
            id={'workshop_card'}
            value={data?.workshop_card}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft}
          >
            <Validator>
              <PatternRule
                pattern={pTextNum}
                message="тільки цифри\букви"
              />
              <RequiredRule
                message={`${mockTahoText
                  ?.workshop_card} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
        <ColumnField text={mockTahoText?.carrier_partner}
          className ={styles?.mr_bottom}>
          <PartnerSearch
            isRequired={true}
            stylingMode={'outlined'}
            partner={data.partner}
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
                  message={`${mockTahoText?.carrier_partner} - ${required}`}/>
              </Validator>
            }
          />
        </ColumnField>
        <Field text={mockTahoText?.authorized_person}>
          <TextBox
            id={'authorized_person'}
            value={data?.authorized_person}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockTahoText
                  ?.authorized_person} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockTahoText?.phone}>
          <TextBox
            id={'phone'}
            value={data?.phone}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft}
            mask={'+38\\0 00 000-0000'}
            maskChar={'X'}
            useMaskedValue={true}
          >
            <Validator>
              <RequiredRule
                message={`${mockTahoText?.phone} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={`${mockText?.auto?.car_brand} авто`} >
          <SelectBox
            id={'car_brand'}
            items={brandList}
            onValueChanged={handleFieldValueChange}
            value={data?.car_brand || null}
            searchEnabled={true}
            showClearButton={true}
            deferRendering={false}
            stylingMode={'outlined'}
            width={'300px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.car_brand} - ${required}`}
              />
            </Validator>
          </SelectBox>
        </Field>
        <Field text={`${mockText?.auto?.car_model} авто`}>
          <TextBox
            id={'car_model'}
            value={data.car_model}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.car_model} - ${required}`}
              />
            </Validator>
          </TextBox>
        </Field>
        <Field text={mockText?.auto?.manufacture_date}>
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
            width={'300px'}
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
        </Field>
        <Field text={mockText?.auto?.number}>
          <CarNumSearch
            id={'car_number'}
            value={data?.car_number}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'270px'}
            readOnly={!data.draft}
            onSerch={handleOnSerchCar}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.number} - ${required}`}
              />
              <PatternRule
                pattern={pTextNumLat}
                message="Тільки латинські літери"
              />
            </Validator>
          </CarNumSearch>
          {/* <TextBox
            id={'car_number'}
            value={data?.car_number}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText?.auto?.number} - ${required}`}
              />
              <PatternRule
                pattern={pTextNumLat}
                message="Тільки латинські літери"
              />
            </Validator>
          </TextBox> */}
        </Field>
        <Field text={`${mockText?.auto?.vin } (№ рами) [${
          data?.vin?.length || 0 }]`}>
          <TextBox
            id={'vin'}
            value={data?.vin?.replaceAll(/[ioіо ]/gi, '').toUpperCase()}
            stylingMode={'outlined'}
            onValueChanged={handleFieldValueChange}
            width={'300px'}
            maxLength={17}
            readOnly={!data.draft}
          >
            <Validator>
              <RequiredRule
                message={`${mockText.auto.vin} - ${required}`}
              />
              <PatternRule
                pattern={pVINCode_1}
                message="не використовуйте спеціальні символи крім - '\'"
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
          {`${mockText.line_type} Taho`}
        </div>
      </div>
    </div>

  );
};

PartOne.propTypes = {
  data: PropTypes.object,
  today: PropTypes.object,
  setData: PropTypes.func,
  handleFieldValueChange: PropTypes.func,
  handleDateChange: PropTypes.func,
};
export default PartOne;
