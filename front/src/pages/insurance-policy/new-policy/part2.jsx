import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
//components
import { FormField } from 'components/form-field/form-field';
// import { TextLine } from 'pages/ep-main/components/text-line';
import {
  // TextBox,
  // DateBox,
  Button,
  SelectBox,
  ValidationSummary,
  ValidationGroup,
} from 'devextreme-react';
// import Validator, {
//   RequiredRule,
//   // PatternRule,
//   // StringLengthRule,
//   // RangeRule,
// } from 'devextreme-react/validator';

// const required = 'обов`язкове поле';
import { privileges } from './api/mockData';
import { CompaniesOffers } from './companies_offers/companies_offers';

export const Part2 = (props) => {
  const { setData = () => {}, data = {} } = props;
  const groupRef = useRef();
  const [ franchise, setFranchise ] = useState(0);
  const [ privilege, setPrivilege ] = useState('without');
  const handleSearch = () => {
    const validate = groupRef?.current?.instance?.validate();
    if (validate?.status === 'valid') {
      console.log('valid');
    } else {
      console.log('No valid');
    }
    setData((prev) => ({ ...prev, step: 3 }));
  };
  return (<>
    <h3>Шаг 2. Выбор предложений от СК</h3>
    <ValidationGroup ref={groupRef}>
      <FormField textWidth={'300px'} text={'Марка + Модель + Гос.Номер: '}>
        <span>{data?.vehicle_mark} {data?.vehicle_model} {
          data?.vehicle_plate_num}</span>
      </FormField>
      <FormField textWidth={'300px'} text={'Тип ТЗ + Vin Code: '}>
        <span>{data?.vehicle_type} {data?.vehicle_vin}</span>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Пільги: '}>
        <SelectBox
          // id={'policy_type'}
          items={privileges}
          onSelectionChanged={(e) => {
            console.log(e);
            setPrivilege(e?.selectedItem?.code);
          }}
          value={privilege || null}
          displayExpr="name"
          valueExpr="code"
          // searchEnabled={true}
          // showClearButton={true}
          wrapItemText={true}
          stylingMode={'outlined'}
          width={'200px'}
        // readOnly={!data.draft}
        >
        </SelectBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Франшіза: '}>
        <SelectBox
          // id={'policy_type'}
          items={[ { title: '0', value: 0 },
            { title: '1500', value: 1 },
            { title: '2500', value: 2 } ]}
          onSelectionChanged={(e) => {
            setFranchise(e?.selectedItem?.value);
          }}
          value={franchise || 0}
          displayExpr="title"
          valueExpr="value"
          // searchEnabled={true}
          // showClearButton={true}
          wrapItemText={true}
          stylingMode={'outlined'}
          width={'200px'}
        // readOnly={!data.draft}
        >
        </SelectBox>
      </FormField>
      <CompaniesOffers tariffs_index={franchise} privilege={privilege}/>
      <ValidationSummary id="summary"/>
      <br />
      <FormField textWidth={'300px'} text={''}>
        <Button onClick={handleSearch}>Далі</Button>
      </FormField>
      <br />
    </ValidationGroup>
  </>);
};
Part2.propTypes = {
  setData: PropTypes.func,
  data: PropTypes.object,
};

export default Part2;
