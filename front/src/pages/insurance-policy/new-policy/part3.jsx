import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDate } from 'hooks';
//components
import { FormField } from 'components/form-field/form-field';
import { TextLine } from 'pages/ep-main/components/text-line';
import {
  TextBox,
  Button,
  DateBox,
  SelectBox,
  ValidationSummary,
  ValidationGroup,
} from 'devextreme-react';
import Validator, {
  RequiredRule,
  // PatternRule,
  // StringLengthRule,
  // RangeRule,
} from 'devextreme-react/validator';

const required = 'обов`язкове поле';
const imgTestUrl =
  'https://test.xsurance.com.ua/storage/app/uploads/public/600/6ef/8e8/6006ef8e80171304313176.png';
const description = `<p>НАСК «ОРАНТА» - &nbsp;надійна та стабільна страхова
  компанія, яка має активні ділові й партнерські зв'язки, орієнтована на
  динамічний розвиток та миттєве вирішення потреб клієнтів. Нам довіряють
  понад 2 млн. клієнтів.</p>`;
export const Part3 = (props) => {
  const { setData = () => {}, data = {} } = props;
  const groupRef = useRef();
  const {
    today,
    // formatDate
  } = useDate();
  const handleSearch = () => {
    const validate = groupRef?.current?.instance?.validate();
    if (validate?.status === 'valid') {
      console.log('valid');
    } else {
      console.log('No valid');
    }
    setData((prev) => ({ ...prev, step: 1 }));
  };
  return (<>
    <h3>Шаг 3. Ввод данных автовладельца</h3>
    <ValidationGroup ref={groupRef}>
      <FormField textWidth={'300px'} text={'Марка + Модель + Гос.Номер: '}>
        <span>{data?.vehicle_mark} {data?.vehicle_model} {
          data?.vehicle_plate_num}</span>
      </FormField>
      <FormField textWidth={'300px'} text={'Тип ТЗ + Vin Code: '}>
        <span>{data?.vehicle_type} {data?.vehicle_vin}</span>
      </FormField>
      <div>
        <img src={imgTestUrl} alt={'logo'} />
      </div>
      <FormField textWidth={'300px'} text={'Наименование СК: '}>
        <span>{`"ОРАНТА"`}</span>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Размер франшизы: '}>
        <span>1500</span>
      </FormField>
      <FormField textWidth={'300px'} text={'Додаткове описання полісу: '}>
        <div style={{ maxWidth: 500 }}
          dangerouslySetInnerHTML={ { __html: description } }></div>
      </FormField>
      <FormField textWidth={'300px'} text={'Сума: '}>
        <span>1436</span>
      </FormField>
      <TextLine text=
        {''}/>
      <br />

      <FormField textWidth={'300px'} text={'Дата початку дії полісу: '}>
        <DateBox
          // value={data?.manufacture_date}
          // id="manufacture_date"
          type="date"
          displayFormat={'dd-MM-yyyy'}
          useMaskBehavior={true}
          stylingMode={'outlined'}
          onValueChanged={(e) => { console.log(e); }}
          hint={'Дата початку дії'}
          min={today}
          width={'200px'}
          // readOnly={!data.draft}
        >
          <Validator>
            <RequiredRule
              message={`Дата початку дії полісу - ${required}`}
            />
          </Validator>
        </DateBox>
      </FormField>
      <TextLine text=
        {'дані власника'}/>
      <br />
      <FormField textWidth={'300px'} text={'Прізвище: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Прізвище - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Ім’я: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Ім’я - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'По Батькові: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`По Батькові - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Дата народження: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Дата народження - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'ІПН: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`ІПН - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'E-Mail: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`E-Mail - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Телефон: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Телефон - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Місто реєстрації: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Місто реєстрації - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Адреса: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Адреса - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Будинок: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Будинок  - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Кв: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Кв - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Документ: '}>
        <SelectBox
        // id={'policy_type'}
          items={[ { title: 'посвідчення водія', value: 'driving_license' } ]}
          // onSelectionChanged={handleSelectionChanged}
          // value={data?.policy_type || null}
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
                {`Документ - ${required}`}
            />
          </Validator>
        </SelectBox>
      </FormField>
      <br />
      {/* =========================== */}
      <FormField textWidth={'300px'} text={'Кем видан: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Кем видан - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Серія-Номер: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Серія-Номер - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      <FormField textWidth={'300px'} text={'Дата видачі: '}>
        <TextBox
        // id={'city'}
        // value={data?.city}
          stylingMode={'outlined'}
          // onValueChanged={handleFieldValueChange}
          width={'200px'}
        // readOnly={!data.draft || true}
        >
          <Validator>
            <RequiredRule
              message=
                {`Дата видачі - ${required}`}
            />
          </Validator>
        </TextBox>
      </FormField>
      <br />
      {/* =========================== */}

      <ValidationSummary id="summary"/>
      <br />
      <FormField textWidth={'300px'} text={'Оплата:'}>
        <Button onClick={handleSearch}>Далі</Button>
      </FormField>
      <br />
    </ValidationGroup>
  </>);
};

Part3.propTypes = {
  setData: PropTypes.func,
  data: PropTypes.object,
};

export default Part3;
