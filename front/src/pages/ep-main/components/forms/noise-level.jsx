import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Button } from 'devextreme-react/button';

import Box, { Item } from 'devextreme-react/box';
import TextBox from 'devextreme-react/text-box';
import { SelectBox } from 'devextreme-react/select-box';
import { RadioGroup } from 'devextreme-react/radio-group';
import Validator, {
  PatternRule, RequiredRule, RangeRule,
} from 'devextreme-react/validator';
import { ValidationSummary } from 'devextreme-react';

import { generalAnswersThreeVariants, required } from '../../constants';
import { onValueChanged } from 'utils/ep-form';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';
import { pNum } from 'moks/patterns';

const vehicleTypes = [
  {
    field: 'carsTrack',
    text: 'Легкові та вантажопасажирські автомобілі',
  },
  {
    field: 'busesWeight3500',
    text:
      'Автобуси з максимальною масою понад 3500 кг ' +
      'та двигуном потужністю, кВт',
  },
  {
    field: 'busesTrack',
    text: 'Автобуси та вантажні автомобілі з максимальною масою, кг',
  },
  {
    field: 'trainTrackWeight3500',
    text:
      'Вантажні автомобілі, автопоїзди з максимальною масою ' +
      'понад 3500 кг та двигуном потужністю, кВт',
  },
];

const requirementsList = {
  busesWeight3500: [ '150 та більше', 'менше ніж 150' ],
  busesTrack: [
    'не більше ніж 2000',
    'понад 2000 але не більше ніж 3500',
  ],
  trainTrackWeight3500: [
    'менше ніж 75',
    '75 та більше але менше ніж 150',
    '150 та більше',
  ],
};

export const NoiseLevel = ({
  handleChange = () => {},
  handlePopupClose = () => {},
  data = {},
  blocked,
  number_doc,
}) => {
  const [ form, setForm ] = React.useState(data?.form ||
    { result: null, resultMin: null });
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const blockField = blocked || form?.responsiveness === 'Нз';
  const dataSourceRequirements =
  requirementsList?.[form?.tz] || [];
  const results = [ 'result_1', 'result_2', 'result_3' ];
  let norms = '';
  if (form?.tz === 'carsTrack') {
    norms = 87;
  }
  if (form?.tz === 'busesWeight3500') {
    if (form?.requirement === requirementsList
      ?.busesWeight3500[0]) {
      norms = 90;
    }
    if (form?.requirement === requirementsList
      ?.busesWeight3500[1]) {
      norms = 93;
    }
  }
  if (form?.tz === 'busesTrack') {
    if (form?.requirement === requirementsList?.busesTrack[0]) {
      norms = 88;
    }
    if (form?.requirement === requirementsList?.busesTrack[1]) {
      norms = 89;
    }
  }
  if (form?.tz === 'trainTrackWeight3500') {
    if (form?.requirement === requirementsList
      ?.trainTrackWeight3500[0]) {
      norms = 91;
    }
    if (form?.requirement === requirementsList
      ?.trainTrackWeight3500[1]) {
      norms = 93;
    }
    if (form?.requirement === requirementsList
      ?.trainTrackWeight3500[2]) {
      norms = 94;
    }
  }
  const aboveNorms = norms && form?.result && (form?.result > norms);
  const aboveNoise =
    form?.backgroundNoise && form?.result &&
    (form?.backgroundNoise - form?.result) > 10;
  const validationGroupName = 'controlSystem';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      handleChange({
        form,
        startTime,
        status: form?.responsiveness === 'Ні' ? 'failed' : 'passed',
      });
      handlePopupClose();
    }
  };
  const checkMinMax = () => {
    let max = null;
    let min = null;
    results.forEach((element) => {
      if (max === null || +form?.[element] > +max) {
        max = form?.[element] || null;
      }
      if (min === null || +form?.[element] < +min) {
        min = form?.[element] || null;
      }
    });
    if (max !== form?.result || min !== form?.resultMin) {
      setForm(((prev) => (
        { ...prev, result: max, resultMin: min })));
    }
  };
  useEffect(() => {
    checkMinMax();
  }, [ results.map((item) => form?.[item]) ]);

  useEffect(() => {
    if (form?.result !== null && form?.resultMin !== null) {
      setForm((prev) => ({
        ...prev,
        resultDifference: (form?.result - form?.resultMin),
      }));
    }
  }, [ form?.result, form?.resultMin ]);
  useEffect(() => {
    if (form?.resultDifference > 2 || aboveNorms || aboveNoise) {
      setForm((prev) => ({
        ...prev,
        responsiveness: 'Ні',
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        responsiveness: 'Так',
      }));
    }
  }, [ form?.result, norms, form?.backgroundNoise, form?.resultDifference ]);

  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>Початок {dayjs(startTime).format(timeDateFormat)}</span>
        <span>
          {number_doc !== '' && 'ЕП №'}
          {number_doc}
        </span>
      </div>

      <h2 className={styles.form_title}>Перевірка рівня зовнішнього шуму</h2>

      <hr className={styles.form_line} />

      <Box direction="row" height={70} width="99%" crossAlign="center">
        <Item ratio={1} width="10%">
          <span>ТЗ</span>
        </Item>
        <Item ratio={8} width="100%">
          <SelectBox
            width={500}
            dataSource={vehicleTypes}
            wrapItemText={true}
            disabled={blockField}
            value={form?.tz}
            valueExpr="field"
            displayExpr="text"
            onValueChanged={
              (e) => {
                onValueChanged({ e, setForm, field: 'tz' });
              }
            }
            stylingMode={'outlined'}
            placeholder="Виберіть критерій"
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`ТЗ - ${required}`}
              />
            </Validator>
          </SelectBox>
        </Item>
      </Box>

      <Box direction="row" height={70} width="99%" crossAlign="center">
        <Item ratio={1} width="10%">
          <span>Вимога</span>
        </Item>
        <Item ratio={8} width="100%">
          <SelectBox
            dataSource={dataSourceRequirements}
            width={300}
            disabled={blockField || form?.tz === 'carsTrack'}
            value={form?.requirement}
            onValueChanged={
              (e) => {
                onValueChanged({ e, setForm, field: 'requirement' });
              }
            }
            stylingMode={'outlined'}
            placeholder="Виберіть критерій"
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`Вимога - ${required}`}
              />
            </Validator>
          </SelectBox>
        </Item>
      </Box>

      <Box direction="row" height={50} width="99%">
        <Item ratio={1} width="100%">
          <span>{`Норматив не більшe, дБа: ${norms}`}</span>
        </Item>
      </Box>

      <Box direction="row" height={100} width="99%" align="space-between">
        <Item baseSize="22%" >
          <span style={{ marginBottom: '5px', height: '35px' }}>
            Швидкість вітру, м/с
          </span>
          <TextBox
            disabled={blockField}
            value={form?.windSpeed}
            onValueChanged={
              (e) => onValueChanged({ e, setForm, field: 'windSpeed' })
            }
            width={'100%'}
            stylingMode={'outlined'}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`Швидкість вітру, м/с - ${required}`}
              />
              <PatternRule pattern={pNum} message="лише цифри" />
              <RangeRule
                max={5}
                message="значення має бути не більше 5"
              />
            </Validator>
          </TextBox>
        </Item>
        <Item baseSize="20%">
          <span style={{ marginBottom: '5px', height: '35px' }}>
            Фоновий шум, дБа
          </span>
          <TextBox
            className={aboveNoise && styles?.border_red}
            disabled={blockField}
            value={form?.backgroundNoise}
            onValueChanged={
              (e) => onValueChanged({ e, setForm, field: 'backgroundNoise' })
            }
            width={'100%'}
            stylingMode={'outlined'}
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`Фоновий шум, дБа - ${required}`}
              />
              <PatternRule pattern={pNum} message="лише цифри" />
            </Validator>
          </TextBox>
        </Item>
        <Item baseSize="50%">
          <span style={{ marginBottom: '5px', height: '35px' }}>
            Результати випробування, дБа
          </span>
          <div className={styles.flex_sb}>
            {results.map((item, index) => <TextBox key={index}
              className={form?.[item] > norms && styles?.border_red}
              disabled={blockField}
              value={form?.[item]}
              onValueChanged={
                (e) => onValueChanged({ e, setForm, field: item })
              }
              width={'30%'}
              stylingMode={'outlined'}
            >
              <Validator validationGroup={validationGroupName}>
                <RequiredRule
                  message={`Результат випробування, дБа - ${required}`}
                />
                <PatternRule pattern={pNum} message="лише цифри" />
              </Validator>
            </TextBox>,
            )}
          </div>
        </Item>
      </Box>
      <Box direction="row" height={100} width="99%" align="space-between">
        <Item baseSize="42%" >
          <span style={{ marginBottom: '5px', height: '35px' }}>
            {'Результат дБа: '}
            <span className={aboveNoise && styles?.red_text}>
              {`${form?.result ? form?.result : ''}`}
            </span>
          </span>
        </Item>
        <Item baseSize="50%" >
          <span style={{ marginBottom: '5px', height: '35px' }}>
            {'Різниця випробувань, < 2 дБа:'}
            <span className=
              {form?.resultDifference > 2 ? styles?.red_text : ''}>
              {` ${form?.resultDifference ?
                form?.resultDifference : ''}`}
            </span>
          </span>
        </Item>
      </Box>

      <Box direction="row" height={70} width="99%" crossAlign="center">
        <Item baseSize="20%">
          <span style={{ paddingRight: '20px' }}>Відповідность</span>
        </Item>
        <Item baseSize="70%">
          <RadioGroup
            dataSource={generalAnswersThreeVariants}
            disabled={blocked || form?.resultDifference > 2 ||
              aboveNorms || aboveNoise}
            value={form?.responsiveness}
            onValueChanged={
              (e) => onValueChanged({ e, setForm, field: 'responsiveness' })
            }
            layout="horizontal"
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`Відповідность - ${required}`}
              />
            </Validator>
          </RadioGroup>
        </Item>
      </Box>

      <ValidationSummary validationGroup={validationGroupName} />

      {!blocked && (
        <Button
          text="Завершено"
          className={styles.form_button}
          validationGroup={validationGroupName}
          onClick={validateEditor}
        />
      )}
    </div>
  );
};

NoiseLevel.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
