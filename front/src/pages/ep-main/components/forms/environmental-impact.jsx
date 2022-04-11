import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Button } from 'devextreme-react/button';
import Box, { Item } from 'devextreme-react/box';
import { SelectBox } from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';
import { RadioGroup } from 'devextreme-react/radio-group';
import { TextLine } from '../text-line';
import Validator, {
  PatternRule,
  RequiredRule,
} from 'devextreme-react/validator';
import { ValidationSummary } from 'devextreme-react';

import { generalAnswersThreeVariants } from '../../constants';

import {
  fuelTypes,
  gasTypes,
  existNeutralization,
  concentrationCO2ValuesInconsistency,
  carbonsBurnsValuesInconsistency,
  contentCONorms,
  contentCHNormsLess4,
  contentCHNormsMore4,
} from 'moks/epFormsData';
import { checkDate, fuel_type_list } from 'moks/moksData';
import { pNum_3_1, pNum_3_3, pNum_5_1, pNum_5_2 } from 'moks/patterns';
import {
  calculateKM1Average,
  calculateKM1Difference,
  extractCodes,
  onValueChanged,
  onObjValueChanged,
} from 'utils/ep-form';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';
import {
  SelectCodeDescription,
} from 'components/ep-form-field/select-code-description';

export const EnvironmentalImpact = (props) => {
  const {
    handleChange = () => {},
    handlePopupClose = () => {},
    blocked,
    number_doc,
    data = {},
    fuel_type = '',
    cylinders = '',
    first_registration_date = '',
    ecological = '',
  } = props;
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const [ contentCarbonsBurns, setContentCarbonsBurns ] = useState(
    data?.contentCarbonsBurns || {},
  );
  const [ concentrationCO2, setConcentrationCO2 ] = useState(
    data?.concentrationCO2 || {},
  );
  const [ concentrationCO2Values, setConcentrationCO2Values ] = useState(
    data?.concentrationCO2Values || {},
  );
  const [ photo, setPhoto ] = useState(data?.photo || '');
  // 'Бензин',      //0
  // 'Дизель',      //1
  // 'Газ',         //2
  // 'Газ-Бензин',  //3
  // 'Газ-Дизель',  //4
  const isDieselGas = fuel_type === fuel_type_list[4] ||
    fuel_type === fuel_type_list[1];
  const isPetrolGas = fuel_type === fuel_type_list[2] ||
    fuel_type === fuel_type_list[3] || fuel_type === fuel_type_list[0];
  const isPetrolExistNeutralization =
    concentrationCO2?.fuel?.neutralization === existNeutralization[0] ||
      fuel_type === fuel_type_list[2];

  const isBefore = dayjs(first_registration_date)?.isBefore(checkDate);
  const engineKTZValueCanSend = !!contentCarbonsBurns?.engineKTZValue?.general;
  const resultNMinCanSend = !!concentrationCO2?.noteInconsistency?.resultNMin;
  const resultNPidvCanSend = !!concentrationCO2?.noteInconsistency?.resultNPidv;
  const canSend =
    ((isDieselGas ? engineKTZValueCanSend : true) &&
    (isPetrolExistNeutralization ? resultNMinCanSend : true) &&
    (isPetrolExistNeutralization ? resultNPidvCanSend : true)) ||
    (isPetrolGas && !isBefore);
  let coNormsNmin = contentCONorms?.nMin;
  let coNormsNpidv = contentCONorms?.nPidv;
  let chNormsNmin = cylinders > 4 ? contentCHNormsMore4?.nMin :
    contentCHNormsLess4?.nMin;
  let chNormsNpidv = cylinders > 4 ? contentCHNormsMore4?.nPidv :
    contentCHNormsLess4?.nPidv;
  if (fuel_type === fuel_type_list[2] &&
      concentrationCO2?.fuel?.gas_type === 'СПГ') {
    coNormsNmin = 1.5;
    coNormsNpidv = 1;
    chNormsNmin = cylinders > 4 ? 1800 : 600;
    chNormsNpidv = cylinders > 4 ? 600 : 300;
  }
  if (fuel_type === fuel_type_list[2] &&
      concentrationCO2?.fuel?.gas_type === 'ЗНГ') {
    coNormsNmin = 3.5;
    coNormsNpidv = 1.5;
    chNormsNmin = cylinders > 4 ? 2500 : 1200;
    chNormsNpidv = cylinders > 4 ? 1000 : 600;
  }
  const isCONormsNMin = (concentrationCO2?.contentCO?.resultNMin &&
    concentrationCO2?.contentCO?.resultNMin > coNormsNmin);
  const isCONormsNPidv = (concentrationCO2?.contentCO?.resultNPidv &&
    concentrationCO2?.contentCO?.resultNPidv > coNormsNpidv);
  const isCHNormsNMin = (concentrationCO2?.contentCH?.resultNMin &&
    concentrationCO2?.contentCH?.resultNMin > chNormsNmin);
  const isCHNormsNPidv = (concentrationCO2?.contentCH?.resultNPidv &&
    concentrationCO2?.contentCH?.resultNPidv > chNormsNpidv);

  const codeNormRequired =
    isCONormsNMin || isCONormsNPidv || isCHNormsNMin || isCHNormsNPidv ||
    concentrationCO2?.noteInconsistency?.resultNMin === 'Ні' ||
    concentrationCO2?.noteInconsistency?.resultNPidv === 'Ні';
  const airOverdimensionNormRequired =
    concentrationCO2Values?.airOverdimension > 1.03 ||
    concentrationCO2Values?.airOverdimension < 0.97;
  const volumeCONMinNorm = ecological === 'Євро-2' ? 0.5 : 0.3;
  const volumeCONNPidvNorm = ecological === 'Євро-2' ? 0.3 : 0.2;
  const volumeCONMinNormRequired =
    concentrationCO2Values?.volumeCO?.resultNMin > volumeCONMinNorm;
  const volumeCONNPidvNormRequired =
    concentrationCO2Values?.volumeCO?.resultNPidv > volumeCONNPidvNorm;
  const differenceKM1 = calculateKM1Difference(contentCarbonsBurns?.km1);
  const averageKM1 = calculateKM1Average(contentCarbonsBurns?.km1);
  const validationGroupName = 'environmentalImpact';

  const validateEditor = function(e) {
    const res = e?.validationGroup?.validate();
    if (res?.status === 'valid' || res === undefined) {
      const codes = extractCodes({
        ...concentrationCO2,
        concentrationCO2Values,
        ...contentCarbonsBurns,
      });

      handleChange({
        contentCarbonsBurns: {
          ...contentCarbonsBurns,
          averageKM1,
          differenceKM1,
        },
        concentrationCO2,
        concentrationCO2Values,
        startTime,
        photo,
        codes,
        status: codes.length > 0 ? 'failed' : 'passed',
      });
      handlePopupClose();
    }
  };

  useEffect(() => {
    setContentCarbonsBurns(data?.contentCarbonsBurns || {});
    setConcentrationCO2(data?.concentrationCO2 || {});
    setConcentrationCO2Values(data?.concentrationCO2Values || {});
    setPhoto(data?.photo || '');
  }, [ data ]);
  useEffect(() => {
    onObjValueChanged({
      e: { value: fuel_type },
      field: 'fuel',
      subfield: 'type',
      setForm: setConcentrationCO2,
    });

    if (fuel_type === 'Газ') {
      onObjValueChanged({
        e: { value: 'Не обладнаний' },
        field: 'fuel',
        subfield: 'neutralization',
        setForm: setConcentrationCO2,
      });
    }
  }, [ fuel_type ]);
  useEffect(() => {

    if (differenceKM1 > 0.25 ||
      contentCarbonsBurns?.engineKTZValue?.value < averageKM1) {
      onObjValueChanged({
        e: { value: 'Ні' },
        field: 'engineKTZValue',
        subfield: 'general',
        setForm: setContentCarbonsBurns,
      });
    } else {
      onObjValueChanged({
        e: { value: 'Так' },
        field: 'engineKTZValue',
        subfield: 'general',
        setForm: setContentCarbonsBurns,
      });
    }
  }, [ contentCarbonsBurns?.km1, contentCarbonsBurns?.engineKTZValue?.value ]);
  const sWidth = 'calc(100% - 5px)';
  const tResNmin = 'Результат n мін';
  const rResNpidv = 'Результат n підв';

  return (
    <div className={styles.form_wrapper}>
      <div className={styles.line_wrapper}>
        <div className={styles.form_header}>
          <span>Початок {dayjs(startTime).format(timeDateFormat)}</span>
          <span>
            {number_doc !== '' && 'ЕП №'}
            {number_doc}
          </span>
        </div>

        <h2 className={styles.form_title}>
          Характеристики негативного впливу на навколишнє природне середовище
        </h2>
      </div>

      {isDieselGas && (
        <>
          <div className={styles.line_wrapper}>
            <TextLine
              text="Вміст у спалинах оксиду вуглецю,
          вуглеводнів та димність спалин"
            />
          </div>
          <Box direction="row" width="100%" crossAlign="center">
            <Item baseSize="35%">
              <span style={{ paddingRight: '10px' }}>
                Скориговане значення для двигуна КТЗ
              </span>
            </Item>
            <Item baseSize="20%">
              <TextBox
                width={'100%'}
                stylingMode={'outlined'}
                disabled={blocked}
                value={contentCarbonsBurns?.engineKTZValue?.value}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'engineKTZValue',
                  subfield: 'value',
                  setForm: setContentCarbonsBurns,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <PatternRule
                    pattern={pNum_3_1}
                    message="лише цифри, не бліше одного знака після коми"
                  />
                </Validator>
              </TextBox>
            </Item>
          </Box>
          <Box
            direction="row"
            width="100%"
            crossAlign="center"
            align="space-between"
          >
            <Item baseSize="11%">
              <span style={{ paddingRight: '5px' }}>K, m-1</span>
            </Item>

            <Item baseSize="12.25%">
              <TextBox
                width={sWidth}
                stylingMode={'outlined'}
                disabled={blocked}
                value={contentCarbonsBurns?.km1?.first}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'km1',
                  subfield: 'first',
                  setForm: setContentCarbonsBurns,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message={'Заповніть поле 1 осі'} />
                  <PatternRule
                    pattern={pNum_3_3}
                    message="лише цифри [0,001]"
                  />
                </Validator>
              </TextBox>
            </Item>
            <Item baseSize="12.25%">
              <TextBox
                width={sWidth}
                stylingMode={'outlined'}
                disabled={blocked}
                value={contentCarbonsBurns?.km1?.second}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'km1',
                  subfield: 'second',
                  setForm: setContentCarbonsBurns,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message={'Заповніть поле 2 осі'} />
                  <PatternRule
                    pattern={pNum_3_3}
                    message="лише цифри [0,001]"
                  />
                </Validator>
              </TextBox>
            </Item>
            <Item baseSize="12.25%">
              <TextBox
                width={sWidth}
                stylingMode={'outlined'}
                disabled={blocked}
                value={contentCarbonsBurns?.km1?.third}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'km1',
                  subfield: 'third',
                  setForm: setContentCarbonsBurns,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message={'Заповніть поле 3 осі'} />
                  <PatternRule
                    pattern={pNum_3_3}
                    message="лише цифри [0,001]"
                  />
                </Validator>
              </TextBox>
            </Item>
            <Item baseSize="12.25%">
              <TextBox
                width={sWidth}
                stylingMode={'outlined'}
                disabled={blocked}
                value={contentCarbonsBurns?.km1?.fourth}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'km1',
                  subfield: 'fourth',
                  setForm: setContentCarbonsBurns,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message={'Заповніть поле 4 осі'} />
                  <PatternRule
                    pattern={pNum_3_3}
                    message="лише цифри [0,001]"
                  />
                </Validator>
              </TextBox>
            </Item>
            <Item baseSize="15%">
              <span style={{ paddingRight: '5px' }}>
                Різниця: &nbsp;
                <span className={
                  differenceKM1 >
                    0.25 ? styles.red_text : ''}>
                  {differenceKM1}
                </span>
              </span>
            </Item>
            <Item baseSize="20%">
              <span style={{ paddingRight: '5px' }}>
                Середнє значення:
              </span>
            </Item>
            <Item baseSize="10%">
              <TextBox
                className={
                  contentCarbonsBurns?.engineKTZValue?.value < averageKM1 &&
                styles?.border_red}
                width={'100%'}
                stylingMode={'outlined'}
                disabled={true}
                value={calculateKM1Average(contentCarbonsBurns?.km1)}
              />
            </Item>
          </Box>
          <Box direction="row" height={100} width="100%" crossAlign="center">
            <Item baseSize="38%">
              <RadioGroup
                style={{ padding: '10px 20px' }}
                width={'100%'}
                dataSource={generalAnswersThreeVariants}
                layout="horizontal"
                disabled={blocked ||
                  differenceKM1 > 0.25 ||
                  contentCarbonsBurns?.engineKTZValue?.value < averageKM1}
                value={contentCarbonsBurns?.engineKTZValue?.general}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'engineKTZValue',
                  subfield: 'general',
                  setForm: setContentCarbonsBurns,
                })
                }
              />
            </Item>
            <Item baseSize={'32%'}>
              <span style={{ paddingRight: '20px' }}>
                Код невідповідності:
              </span>
            </Item>
            <Item baseSize={'30%'}>
              <SelectCodeDescription
                showClearButton={true}
                style={{ width: '100%' }}
                dataSource={carbonsBurnsValuesInconsistency}
                field={'engineKTZValue'}
                setForm={setContentCarbonsBurns}
                disabled={blocked}
                selectValue={contentCarbonsBurns?.engineKTZValue?.code}
                textAreaValue={contentCarbonsBurns?.engineKTZValue?.description}
                validationGroup={validationGroupName}
                required={
                  contentCarbonsBurns?.engineKTZValue?.general === 'Ні'}
              />
            </Item>
          </Box>
        </>
      )}

      {(isPetrolGas && isBefore) && (
        <>
          <div className={styles.line_wrapper}>
            <TextLine
              text="Концентрація оксиду вуглицю,
          вуглеводнів у спалинах ТЗ з двигунами,
          що жвиляться бензином або газовим паливом до 01.04.2009"
            />
          </div>

          <Box
            direction="row"
            height={100}
            width="100%"
            crossAlign="center"
            align="space-between"
          >
            <Item baseSize="20%">
              <span style={{ padding: '0 10px' }}>Паливо</span>
            </Item>
            <Item baseSize="25%">
              <SelectBox
                disabled={true}
                dataSource={fuelTypes}
                width={'100%'}
                stylingMode={'outlined'}
                placeholder="Виберіть тип"
                value={concentrationCO2?.fuel?.type}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'fuel',
                  subfield: 'type',
                  setForm: setConcentrationCO2,
                })
                }
              />
            </Item>
            <Item baseSize="30%">
              <span style={{ padding: '0 10px' }}>
                Наявність нейтралізатора
              </span>
            </Item>
            <Item baseSize="25%">
              <SelectBox
                dataSource={existNeutralization}
                width={'100%'}
                stylingMode={'outlined'}
                placeholder="Виберіть наявність"
                value={concentrationCO2?.fuel?.neutralization}
                disabled={blocked || fuel_type === 'Газ'}
                showClearButton={true}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'fuel',
                  subfield: 'neutralization',
                  setForm: setConcentrationCO2,
                })}
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule
                    message={'Виберіть поле наявність нейтралізатора'}
                  />
                </Validator>
              </SelectBox>
            </Item>
          </Box>
          {fuel_type === 'Газ' &&
          <Box
            direction="row"
            height={100}
            width="100%"
            crossAlign="center"
          >
            <Item baseSize="20%">
              Тип газу
            </Item>
            <Item baseSize="25%">
              <SelectBox
                dataSource={gasTypes}
                width={'100%'}
                stylingMode={'outlined'}
                placeholder="Виберіть тип"
                value={concentrationCO2?.fuel?.gas_type}
                disabled={blocked}
                showClearButton={true}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'fuel',
                  subfield: 'gas_type',
                  setForm: setConcentrationCO2,
                })}
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule
                    message={'Виберіть поле наявність нейтралізатора'}
                  />
                </Validator>
              </SelectBox>
            </Item>
          </Box>}
          <div className={styles.line_wrapper}>
            <TextLine text="Вміст CO,%" />
          </div>
          {fuel_type === 'Газ' &&
            (<div style={{ width: '100%' }}>
              <div>Норматив, не більше: </div>
              <br />
              <div>n мін 1,5(спг) 3,5(знг) </div>
              <div>n підв  1,0(спг) 1,5(знг)</div>
            </div>)
          }
          <Box
            direction="row"
            height={100}
            width="100%"
            crossAlign="center"
            align="space-between"
          >
            <Item baseSize="20%">
              <span style={{ padding: '0 10px' }}>
                {tResNmin} <br/> {coNormsNmin}
              </span>
            </Item>
            <Item baseSize="25%">
              <TextBox
                className={isCONormsNMin && styles.border_orange}
                width={'100%'}
                stylingMode={'outlined'}
                disabled={blocked || !isPetrolExistNeutralization}
                value={concentrationCO2?.contentCO?.resultNMin}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'contentCO',
                  subfield: 'resultNMin',
                  setForm: setConcentrationCO2,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message={`Заповніть ${tResNmin}`} />
                  <PatternRule
                    pattern={pNum_3_1}
                    message="лише цифри [0,1]"
                  />
                </Validator>
              </TextBox>
            </Item>
            <Item baseSize="20%">
              <span style={{ padding: '0 10px' }}>
                {rResNpidv} <br/> {coNormsNpidv}
              </span>
            </Item>
            <Item baseSize="25%">
              <TextBox
                className={isCONormsNPidv && styles.border_orange}
                width={'100%'}
                stylingMode={'outlined'}
                disabled={blocked || !isPetrolExistNeutralization}
                value={concentrationCO2?.contentCO?.resultNPidv}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'contentCO',
                  subfield: 'resultNPidv',
                  setForm: setConcentrationCO2,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message={`Заповніть ${rResNpidv}`} />
                  <PatternRule
                    pattern={pNum_3_1}
                    message="лише цифри [0,1]"
                  />
                </Validator>
              </TextBox>
            </Item>
          </Box>

          <div className={styles.line_wrapper}>
            <TextLine text="Вміст CH, млн-1" />
          </div>
          {fuel_type === 'Газ' &&
            (<div style={{ width: '100%' }}>
              <div>Норматив, не більше: </div>
              <br />
              <div>Число цил. (≤4) </div>
              <div>n мін 600(спг) 1200(знг) </div>
              <div>n підв 300(спг) 600(знг) </div>
              <br />
              <div>{'Число цил. (>4)'}</div>
              <div>n мін 1800(спг) 2500(знг) </div>
              <div>n підв 600(спг) 1000(знг)</div>
            </div>)
          }
          <Box
            direction="row"
            height={100}
            width="100%"
            crossAlign="center"
            align="space-between"
          >
            <Item baseSize="20%">
              <span style={{ padding: '0 10px' }}>
                {tResNmin} <br /> {chNormsNmin}
              </span>
            </Item>
            <Item baseSize="25%">
              <TextBox
                className={isCHNormsNMin && styles.border_orange}
                width={'100%'}
                stylingMode={'outlined'}
                disabled={blocked || !isPetrolExistNeutralization}
                value={concentrationCO2?.contentCH?.resultNMin}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'contentCH',
                  subfield: 'resultNMin',
                  setForm: setConcentrationCO2,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message=
                    {`Заповніть ${tResNmin} ${chNormsNmin}`} />
                  <PatternRule
                    pattern={pNum_5_1}
                    message="лише цифри [0,1]"
                  />
                </Validator>
              </TextBox>
            </Item>
            <Item baseSize="20%">
              <span style={{ padding: '0 10px' }}>
                {rResNpidv} <br /> {chNormsNpidv}
              </span>
            </Item>
            <Item baseSize="25%">
              <TextBox
                className={isCHNormsNPidv && styles.border_orange}
                width={'100%'}
                stylingMode={'outlined'}
                disabled={blocked || !isPetrolExistNeutralization}
                value={concentrationCO2?.contentCH?.resultNPidv}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'contentCH',
                  subfield: 'resultNPidv',
                  setForm: setConcentrationCO2,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message=
                    {`Заповніть ${rResNpidv} ${chNormsNpidv}`} />
                  <PatternRule
                    pattern={pNum_5_1}
                    message="лише цифри [0,1]"
                  />
                </Validator>
              </TextBox>
            </Item>
          </Box>

          <div className={styles.line_wrapper}>
            <TextLine text="Відмітка про невідповідність" />
          </div>

          <Box
            direction="row"
            height={100}
            width="100%"
            crossAlign="center"
            align="space-around"
          >
            <Item baseSize={'50%'} >
              <div className={styles.df_col_center}>
                <span style={{ marginBottom: '20px' }}>
                  {tResNmin}
                </span>
                <RadioGroup
                  dataSource={generalAnswersThreeVariants}
                  layout="horizontal"
                  disabled={blocked}
                  value={concentrationCO2?.noteInconsistency?.resultNMin}
                  onValueChanged={(e) => onObjValueChanged({
                    e,
                    field: 'noteInconsistency',
                    subfield: 'resultNMin',
                    setForm: setConcentrationCO2,
                  })
                  }
                >
                  <Validator validationGroup={validationGroupName}>
                    <RequiredRule message={`Заповніть ${tResNmin}`} />
                  </Validator>
                </RadioGroup>

              </div>
            </Item>
            <Item baseSize={'50%'} className={styles.df_col_center}>
              <div className={styles.df_col_center}>
                <span style={{ marginBottom: '20px', textAlign: 'center' }}>
                  {rResNpidv}
                </span>
                <RadioGroup
                  dataSource={generalAnswersThreeVariants}
                  layout="horizontal"
                  disabled={blocked}
                  value={concentrationCO2?.noteInconsistency?.resultNPidv}
                  onValueChanged={(e) => onObjValueChanged({
                    e,
                    field: 'noteInconsistency',
                    subfield: 'resultNPidv',
                    setForm: setConcentrationCO2,
                  })
                  }
                >
                  <Validator validationGroup={validationGroupName}>
                    <RequiredRule message={`Заповніть ${rResNpidv}`} />
                  </Validator>
                </RadioGroup>
              </div>
            </Item>
          </Box>

          <Box direction="row" height={100} width="100%" crossAlign="center">
            <Item baseSize={'40%'}>
              <span style={{ paddingRight: '20px' }}>
                Код невідповідності
              </span>
            </Item>
            <Item baseSize={'40%'}>
              <SelectCodeDescription
                showClearButton={true}
                style={{ width: '300px' }}
                dataSource={concentrationCO2ValuesInconsistency}
                field={'noteInconsistency'}
                setForm={setConcentrationCO2}
                disabled={blocked}
                selectValue={concentrationCO2?.noteInconsistency?.code}
                textAreaValue={concentrationCO2?.noteInconsistency?.description}
                validationGroup={validationGroupName}
                required={codeNormRequired}
              />
            </Item>
          </Box>
        </>
      )}

      {(isPetrolGas && !isBefore) && (
        <>
          <div className={styles.line_wrapper}>
            <TextLine
              text="Концентрація оксиду вуглицю,
        вугливоднів у спалинах ТЗ з двигунами,
        що живляться бензином або газовим паливам після 01.04.2009"
            />
          </div>

          <Box direction="row" height={100} width="100%" crossAlign="center">
            <Item baseSize={'40%'}>
              <span style={{ paddingRight: '20px' }}>
                λ(Коефіцієнт надміру повітря) - 1 ± 0,03
              </span>
            </Item>
            <Item baseSize={'30%'}>
              <TextBox
                className={airOverdimensionNormRequired && styles.border_orange}
                width={200}
                stylingMode={'outlined'}
                disabled={blocked}
                value={concentrationCO2Values?.airOverdimension}
                onValueChanged={(e) => onValueChanged({
                  e,
                  field: 'airOverdimension',
                  setForm: setConcentrationCO2Values,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule
                    message={
                      'Заповніть поле λ(Коефіцієнт надміру повітря) - 1 ± 0,03'
                    }
                  />
                  <PatternRule
                    pattern={pNum_5_2}
                    message="лише цифри [0,01]"
                  />
                </Validator>
              </TextBox>
            </Item>
          </Box>
          <Box direction="row" height={100} width="100%" crossAlign="center">
            <Item baseSize={'40%'}>
              <span style={{ paddingRight: '30px' }}>
                СО, об`ємна частка, %
              </span>
            </Item>
            <Item baseSize={'10%'}>
              <span style={{ paddingRight: '10px' }}>
                {`n мін (${volumeCONMinNorm})`}
              </span>
            </Item>
            <Item baseSize={'13%'}>
              <TextBox
                className={volumeCONMinNormRequired && styles.border_orange}
                width={'100%'}
                stylingMode={'outlined'}
                disabled={blocked}
                value={concentrationCO2Values?.volumeCO?.resultNMin}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'volumeCO',
                  subfield: 'resultNMin',
                  setForm: setConcentrationCO2Values,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message={'СО, об`ємна частка, %'} />
                  <PatternRule
                    pattern={pNum_5_1}
                    message="лише цифри [0,1]"
                  />
                </Validator>
              </TextBox>
            </Item>
            <Item baseSize={'13%'}>
              <span style={{ padding: '0 10px 0 20px' }}>
                {`n підв (${volumeCONNPidvNorm})`}
              </span>
            </Item>
            <Item baseSize={'13%'}>
              <TextBox
                className={volumeCONNPidvNormRequired && styles.border_orange}
                width={'100%'}
                stylingMode={'outlined'}
                disabled={blocked}
                value={concentrationCO2Values?.volumeCO?.resultNPidv}
                onValueChanged={(e) => onObjValueChanged({
                  e,
                  field: 'volumeCO',
                  subfield: 'resultNPidv',
                  setForm: setConcentrationCO2Values,
                })
                }
              >
                <Validator validationGroup={validationGroupName}>
                  <RequiredRule message={'n підв'} />
                  <PatternRule
                    pattern={pNum_5_1}
                    message="лише цифри [0,1]"
                  />
                </Validator>
              </TextBox>
            </Item>
          </Box>
          <Box direction="row" height={100} width="100%" crossAlign="center">
            <Item baseSize={'40%'}>
              <span style={{ paddingRight: '20px' }}>
                Код невідповідності
              </span>
            </Item>
            <Item baseSize={'40%'}>
              <SelectCodeDescription
                showClearButton={true}
                style={{ width: '300px' }}
                dataSource={concentrationCO2ValuesInconsistency}
                setForm={setConcentrationCO2Values}
                disabled={blocked}
                selectValue={concentrationCO2Values?.code}
                textAreaValue={concentrationCO2Values?.description}
                noSubfield={true}
                validationGroup={validationGroupName}
                required={airOverdimensionNormRequired ||
                  volumeCONMinNormRequired || volumeCONNPidvNormRequired
                }
              />
            </Item>
          </Box>
        </>
      )}
      <br />
      <ValidationSummary validationGroup={validationGroupName}/>
      {!blocked && (
        <Button
          text="Завершено"
          className={styles.form_button}
          validationGroup={validationGroupName}
          onClick={validateEditor}
          disabled={!canSend}
        />
      )}
    </div>
  );
};

EnvironmentalImpact.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
  fuel_type: PropTypes.string,
  cylinders: PropTypes.string,
  first_registration_date: PropTypes.string,
  ecological: PropTypes.string,
};
