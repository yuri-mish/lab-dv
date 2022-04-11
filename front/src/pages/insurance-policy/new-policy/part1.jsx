import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
//components
import { FormField } from 'components/form-field/form-field';
import { TextLine } from 'pages/ep-main/components/text-line';
import {
  TextBox,
  Button,
  // DateBox,
  SelectBox,
  Autocomplete,
  ValidationSummary,
  ValidationGroup,
} from 'devextreme-react';
import Validator, {
  RequiredRule,
  // PatternRule,
  // StringLengthRule,
  // RangeRule,
} from 'devextreme-react/validator';
import {
  // testGetToken,
  getVehicleByPlateNum,
  getVehicleCitiesSearch,
  getVehicleTypesList,
} from './api/requests';

const policy_types_list = [ { title: 'ОСАГО', value: 'osago' },
  { title: 'ОСАГО2', value: 'osago2' } ];

const required = 'обов`язкове поле';

export const Part1 = (props) => {
  const { setData = () => {}, data = {} } = props;
  // const [ formData, setFormData ] = useState(data);
  const groupRef = useRef();
  const [ vehicleCitysList, setVehicleCitysList ] = useState([]);
  const [ vehicleTypesList, setVehicleTypesList ] = useState([]);
  console.log('vehicleCitysList', vehicleCitysList);
  const handleSearch = () => {
    const validate = groupRef?.current?.instance?.validate();
    if (validate?.status === 'valid') {
      console.log('valid');
    } else {
      console.log('No valid');
    }
    setData((prev) => ({ ...prev, step: 2 }));
  };
  const handleGetVehicle = async () => {
    const vehicle = await getVehicleByPlateNum('АА0825РК');
    console.log('vehicle', vehicle);
    if (vehicle) {
      setData((prev) => ({
        ...prev,
        vehicle_plate_num: vehicle?.plate_num,
        vehicle_type: vehicle?.type,
        vehicle_year: vehicle?.year,
        vehicle_vin: vehicle?.vin,
        vehicle_mark: vehicle?.mark?.name,
        vehicle_model: vehicle?.model?.name,
      }));
    }
  };
  const handleValueChanged = (e) => {
    console.log(e);
    setData((prev) => ({
      ...prev,
      [e?.element?.id]: e?.event?.target?.value || e?.value }));
  };
  // const searchVehicleCity = async (e) => {
  //   console.log('searchVehicleCity', e);
  //   const res = await getVehicleCitiesSearch('111');
  //   setVehicleCitysList(res?.data);
  //   handleValueChanged(e);
  // };
  useEffect(async () => {
    const res = await getVehicleTypesList();
    setVehicleTypesList(res);
    const search = await getVehicleCitiesSearch('111');
    setVehicleCitysList(search?.data);
  }, []);
  return (<>
    <h3>Шаг 1</h3>
    <ValidationGroup ref={groupRef}>
      <FormField textWidth={'300px'} text={'Тип полісу: '}>
        <SelectBox
          id={'policy_type'}
          items={policy_types_list}
          onValueChanged={handleValueChanged}
          value={data?.policy_type}
          displayExpr="title"
          valueExpr="value"
          // searchEnabled={true}
          // showClearButton={true}
          wrapItemText={true}
          stylingMode={'outlined'}
          width={'200px'}
        // readOnly={!data.draft}
        >
          <Validator>
            <RequiredRule
              message=
                {`Тип полісу - ${required}`}
            />
          </Validator>
        </SelectBox>
      </FormField>
      <TextLine text=
        {'дані авто'}/>
      <br />
      <FormField textWidth={'300px'} text={'Гос номер авто: '}>
        <TextBox
          id={'vehicle_plate_num'}
          value={data?.vehicle_plate_num }
          stylingMode={'outlined'}
          onValueChanged={handleValueChanged}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Гос номер авто - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Пошук в базі МТСБУ по номеру:'}>
        <Button onClick={handleGetVehicle}>Перевірити</Button>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Марка: '}>
        <TextBox
          id={'vehicle_mark'}
          value={data?.vehicle_mark}
          stylingMode={'outlined'}
          onValueChanged={handleValueChanged}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Марка - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Модель: '}>
        <TextBox
          id={'vehicle_model'}
          value={data?.vehicle_model}
          stylingMode={'outlined'}
          onValueChanged={handleValueChanged}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Модель - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'VIN: '}>
        <TextBox
          id={'vehicle_vin'}
          value={data?.vehicle_vin}
          stylingMode={'outlined'}
          onValueChanged={handleValueChanged}
          width={'200px'}
          // mode="search"
          labelMode='floating' // dont work
          label='test' // dont work
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`VIN - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Тип ТЗ: '}>
        <SelectBox
          id={'vehicle_type'}
          items={vehicleTypesList}
          onValueChanged={handleValueChanged}
          value={data?.vehicle_type}
          displayExpr="title"
          valueExpr="value"
          // searchEnabled={true}
          showClearButton={true}
          wrapItemText={true}
          stylingMode={'outlined'}
          width={'200px'}
        // readOnly={!data.draft}
        >
          <Validator>
            <RequiredRule
              message=
                {`Тип ТЗ - ${required}`}
            />
          </Validator>
        </SelectBox>
      </FormField>
      <br />

      <FormField textWidth={'300px'} text={'Город регистрации владельца ТС: '}>
        <SelectBox
          id={'vehicle_city_id'}
          items={vehicleCitysList}
          onValueChanged={handleValueChanged}
          // onKeyUp={(e) => console.log('onKeyUp', e)}
          // onChange={(e) => console.log('onChange', e)}
          // onInput={
          //   (e) => console.log('onInput', e?.component?._changedValue)}
          // onValueChanged={handleValueChanged}
          // onSelectionChanged={handleSelectionChanged}
          // value={data?.vehicle_city_id || null}
          displayExpr="fullname"
          valueExpr="id"
          searchEnabled={true}
          // showClearButton={true}
          wrapItemText={true}
          stylingMode={'outlined'}
          width={'200px'}
        // readOnly={!data.draft}
        >
          <Validator>
            <RequiredRule
              message=
                {`Город регистрации владельца ТС - ${required}`}
            />
          </Validator>
        </SelectBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Autocomplete test: '}>
        <Autocomplete
          id={'vehicle_city_test'}
          // items={vehicleCitysList}
          //======
          dataSource={vehicleCitysList}
          value={data?.vehicle_city_test}
          // displayExpr="fullname" // not in Autocomplete
          valueExpr="fullname"
          onValueChanged={handleValueChanged}
          minSearchLength={2}
          searchTimeout={500}
          placeholder="Type two symbols to search..."
          wrapItemText={true}
          stylingMode={'outlined'}
          width={'400px'}
        >
          <Validator>
            <RequiredRule
              message=
                {`Город регистрации владельца ТС - ${required}`}
            />
          </Validator>
        </Autocomplete>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Рік випуску: '}>
        <TextBox
          id={'vehicle_year'}
          value={data?.vehicle_year}
          onValueChanged={handleValueChanged}
          stylingMode={'outlined'}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Рік випуску - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <ValidationSummary id="summary"/>
      <br />
      <FormField textWidth={'300px'} text={'Пошук пропозицій СК:'}>
        <Button onClick={handleSearch}>Пошук</Button>
      </FormField>
      <br />
    </ValidationGroup>
  </>);
};

Part1.propTypes = {
  setData: PropTypes.func,
  data: PropTypes.object,
};

export default Part1;
