import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Button } from 'devextreme-react/button';
import { TextBox } from 'devextreme-react/text-box';
import { RadioGroup } from 'devextreme-react/radio-group';
import { SelectBox } from 'devextreme-react/select-box';
import { TextArea } from 'devextreme-react/text-area';
import Validator, {
  PatternRule,
  RequiredRule,
} from 'devextreme-react/validator';
import { ValidationSummary } from 'devextreme-react';

import {
  brakingSystemInconsistency, brakingSystemTypeList,
} from 'moks/epFormsData';
import {
  generalAnswersThreeVariants,
  fieldText,
  required,
} from '../../constants';
import { TextLine } from '../text-line';
import { extractCodes, onObjValueChanged, onValueChanged } from 'utils/ep-form';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';
import { pNum_3_2, pNum_5_2 } from 'moks/patterns';
import { unexpectedCodeInconsistencyText } from 'pages/ep-main/constants';

const unevenBrakingForces_subfields = [ 'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh' ];
export const BrakingSystems = ({
  handleChange = () => {},
  handlePopupClose = () => {},
  data = {},
  blocked,
  number_doc,
  first_registration_date,
  category_KTZ,
}) => {
  const [ form, setForm ] = useState(data?.form || {});
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const disabledByBrakingType = form?.brakingType === 'без гальм' || false;
  const isBefore = dayjs(first_registration_date)?.isBefore('01-01-1989');
  const controlEffortsRGSCanSend = !!form?.controlEffortsRGS?.general;
  const controlEffortsSGSCanSend = !!form?.controlEffortsSGS?.general;
  const markingTechStateCanSend = !!form?.markingTechState?.general;
  const otherSystemTechStateCanSend = !!form?.otherSystemTechState?.general;

  const canSend =
  controlEffortsRGSCanSend &&
    controlEffortsSGSCanSend &&
    markingTechStateCanSend &&
    otherSystemTechStateCanSend;

  const validationGroupName = 'controlSystem';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = extractCodes({
        form,
      });
      handleChange({
        form,
        startTime,
        codes,
        status: codes.length > 0 ? 'failed' : 'passed',
      });
      handlePopupClose();
    }
  };
  const setRadioValues = (fields = []) => {
    fields?.forEach((field) => {
      onObjValueChanged({
        e: { value: 'Нз' },
        field,
        subfield: 'general',
        setForm,
      });
    });
  };
  const checkBrakingRGSNorm = () => {
    let norm = '';
    if (isBefore) {
      if ([ 'M1', 'M2', 'M3', 'N1' ].includes(category_KTZ)) {
        norm = 0.45;
      }
      if ([ 'N2', 'N3' ].includes(category_KTZ)) {
        norm = 0.43;
      }
      if ([ 'O1', 'O2', 'O3', 'O4' ].includes(category_KTZ)) {
        norm = 0.40;
      }
    } else {
      if ([ 'M1', 'M2', 'M3', 'N1' ].includes(category_KTZ)) {
        norm = 0.50;
      }
      if ([ 'N2', 'N3' ].includes(category_KTZ)) {
        norm = 0.45;
      }
      if ([ 'O1', 'O2', 'O3', 'O4' ].includes(category_KTZ)) {
        norm = 0.43;
      }
    }
    return norm;
  };
  const checkResponseTimeNorm = () => {
    let norm = '';
    if (isBefore) {
      if (form?.brakingType === 'гідравлічні') {
        norm = 0.6;
      }
      if (form?.brakingType === 'пневматичні') {
        norm = 0.9;
      }
    } else {
      if (form?.brakingType === 'гідравлічні') {
        norm = 0.5;
      }
      if (form?.brakingType === 'пневматичні') {
        norm = 0.8;
      }
    }
    return norm;
  };
  const checkControlEffortsRGSNorms = () => {
    if (category_KTZ === 'M1') {
      return 490;
    }
    return 687;
  };
  const checkСontrolEffortsSGSNorms = () => {
    if (category_KTZ === 'M1') {
      return 392;
    }
    return 588;
  };
  const brakingRGSNorm = checkBrakingRGSNorm();
  const responseTimeNorm = checkResponseTimeNorm();
  const controlEffortsRGSNorms = checkControlEffortsRGSNorms();
  const controlEffortsSGSNorms = checkСontrolEffortsSGSNorms();
  const brakingSystemSGSNorms = 0.16;

  const checkCodeRequired = () => {
    const hasNo = form?.controlEffortsRGS?.general === 'Ні' ||
    form?.controlEffortsSGS?.general === 'Ні' ||
    form?.markingTechState?.general === 'Ні' ||
    form?.otherSystemTechState?.general === 'Ні';
    const badNorms =
      brakingRGSNorm > form?.brakingSystemRGS ||
      form?.responseTime > responseTimeNorm ||
      controlEffortsRGSNorms < form?.controlEffortsRGS?.value ||
      controlEffortsSGSNorms < form?.controlEffortsSGS?.value ||
      brakingSystemSGSNorms > form?.brakingSystemSGS;
    let badUnevenBrakingForces = false;
    unevenBrakingForces_subfields.forEach((item) => {
      if (form?.unevenBrakingForces?.[item] > 30) {
        badUnevenBrakingForces = true;
      }
    });
    return disabledByBrakingType ? false :
      (hasNo || badNorms || badUnevenBrakingForces);
  };
  const codeIsRequired = checkCodeRequired();
  useEffect(() => {
    if (disabledByBrakingType) {
      setRadioValues([ 'controlEffortsRGS',
        'controlEffortsSGS',
        'otherSystemTechState',
        'markingTechState' ]);
    }

  }, [ disabledByBrakingType ]);
  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>
            Початок {dayjs(startTime).format(timeDateFormat)}
        </span>
        <span>{number_doc !== '' && 'ЕП №'}{number_doc}</span>
      </div>

      <h2 className={styles.form_title}>Гальмові системи</h2>
      <div className={styles.row_wrapper}>
        <span>Тип гальмівної системи</span>
        <div style={{ width: '250px' }}>
          <SelectBox
            dataSource={brakingSystemTypeList}
            width={'100%'}
            stylingMode={'outlined'}
            placeholder="Виберіть тип"
            disabled={blocked}
            value={form?.brakingType}
            showClearButton={true}
            onValueChanged={(e) => onValueChanged({
              e,
              field: 'brakingType',
              setForm,
            })
            }
          >
          </SelectBox>
        </div>
      </div>
      <div className={styles.line_wrapper}>
        <TextLine
          text="Гальмівна система РГС"
        />
      </div>
      <div className={styles.row_wrapper}>
        <span>Загальна питома гальмівна сила (РГС){
          brakingRGSNorm && `(не меньше ${brakingRGSNorm})`}</span>
        <TextBox
          className={form?.brakingSystemRGS &&
            form?.brakingSystemRGS < brakingRGSNorm && styles.border_red}
          width={250}
          stylingMode={'outlined'}
          disabled={blocked || disabledByBrakingType}
          value={form?.brakingSystemRGS}
          onValueChanged={(e) => onValueChanged({
            e,
            field: 'brakingSystemRGS',
            setForm,
          })
          }
        >
          <Validator validationGroup={validationGroupName}>
            <RequiredRule
              message=
                {`${fieldText} Загальна питома гальмівна сила ${required}`}
            />
            <PatternRule
              pattern={pNum_3_2}
              message="тільки цифри не більше 2-х знаків після коми"
            />
          </Validator>
        </TextBox>

        <span>
          Коефіцієнт нерівномірності гальмівних сил коліс осі, % (не більше 30)
        </span>
        <div className={styles.input_group}>
          {unevenBrakingForces_subfields?.map((item, index) => <div key={index}
            style={{ textAlign: 'left' }}>
            <div>{`${index + 1} вісь`}</div>
            <TextBox
              key={`${index}_text_box`}
              className={
                form?.unevenBrakingForces?.[item] > 30 &&
                styles.border_red}
              width={75}
              stylingMode={'outlined'}
              disabled={blocked || disabledByBrakingType}
              value={form?.unevenBrakingForces?.[item]}
              placeholder={`${index + 1} вісь`}
              onValueChanged={(e) => onObjValueChanged({
                e,
                field: 'unevenBrakingForces',
                subfield: item,
                setForm,
              })
              }
            >
              <Validator validationGroup={validationGroupName}>
                { index === 0 && <RequiredRule
                  message={`${fieldText} ${index + 1} ось ${required}`}
                />}
                <PatternRule
                  pattern={pNum_3_2}
                  message="тільки цифри не більше 2-х знаків після коми"
                />
              </Validator>
            </TextBox>
          </div>,
          )}
        </div>

        <span>Тривалість спрацювання, с
          {responseTimeNorm && `(не більше ${responseTimeNorm}сек)`}</span>
        <TextBox
          className={form?.responseTime > responseTimeNorm && styles.border_red}
          width={250}
          stylingMode={'outlined'}
          disabled={blocked || disabledByBrakingType ||
            form?.brakingType === 'інерційні'}
          value={form?.responseTime}
          onValueChanged={(e) => onValueChanged({
            e,
            field: 'responseTime',
            setForm,
          })
          }
        >
          <Validator validationGroup={validationGroupName}>
            <PatternRule
              pattern={pNum_3_2}
              message="тільки цифри не більше 2-х знаків після коми"
            />
          </Validator>
        </TextBox>

        <span>Зусилля на органі керування, Н (РГС)
          {`(не більше ${controlEffortsRGSNorms})`}</span>
        <div className={styles.input_rb_groups}>
          <TextBox
            className={form?.controlEffortsRGS?.value &&
              form?.controlEffortsRGS?.value > controlEffortsRGSNorms &&
              styles.border_red}
            width={175}
            stylingMode={'outlined'}
            disabled={blocked || disabledByBrakingType ||
              form?.controlEffortsRGS?.general === 'Нз'}
            value={form?.controlEffortsRGS?.value}
            onValueChanged={(e) => onObjValueChanged({
              e,
              field: 'controlEffortsRGS',
              subfield: 'value',
              setForm,
            })
            }
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`${fieldText} 
                         Зусилля на органі керування, Н (РГС) ${required}`}
              />
              <PatternRule
                pattern={pNum_5_2}
                message="тільки цифри не більше 2-х знаків після коми"
              />
            </Validator>
          </TextBox>
          <RadioGroup
            dataSource={generalAnswersThreeVariants}
            layout="horizontal"
            disabled={blocked}
            value={form?.controlEffortsRGS?.general}
            onValueChanged={(e) => onObjValueChanged({
              e,
              field: 'controlEffortsRGS',
              subfield: 'general',
              setForm,
            })
            }
          />
        </div>
      </div>

      <div className={styles.line_wrapper}>
        <TextLine
          text="Гальмівна система СГС"
        />
      </div>
      <div className={styles.row_wrapper}>
        <span>
          Загальна питома гальмівна сила (СГС) {
            brakingSystemSGSNorms && `(не меньше ${brakingSystemSGSNorms})`}
        </span>
        <TextBox
          className={form?.brakingSystemSGS &&
          form?.brakingSystemSGS < brakingSystemSGSNorms && styles.border_red}
          width={250}
          stylingMode={'outlined'}
          disabled={blocked || disabledByBrakingType}
          value={form?.brakingSystemSGS}
          onValueChanged={(e) => onValueChanged({
            e,
            field: 'brakingSystemSGS',
            setForm,
          })
          }
        >
          <Validator validationGroup={validationGroupName}>
            <RequiredRule
              message=
                {`${fieldText} Загальна питома гальмівна сила ${required}`}
            />
            <PatternRule
              pattern={pNum_3_2}
              message="тільки цифри не більше 2-х знаків після коми"
            />
          </Validator>
        </TextBox>

        <span>Зусилля на органі керування, Н (СГС)
          {`(не більше ${controlEffortsSGSNorms})`}</span>
        <div className={styles.input_rb_groups}>
          <TextBox
            className={form?.controlEffortsSGS?.value &&
              form?.controlEffortsSGS?.value > controlEffortsSGSNorms &&
              styles.border_red}
            width={175}
            stylingMode={'outlined'}
            disabled={blocked || disabledByBrakingType ||
              form?.controlEffortsSGS?.general === 'Нз'}
            value={form?.controlEffortsSGS?.value}
            onValueChanged={(e) => onObjValueChanged({
              e,
              field: 'controlEffortsSGS',
              subfield: 'value',
              setForm,
            })
            }
          >
            <Validator validationGroup={validationGroupName}>
              <RequiredRule
                message={`${fieldText} 
                         Зусилля на органі керування, Н ${required}`}
              />
              <PatternRule
                pattern={pNum_5_2}
                message="тільки цифри не більше 2-х знаків після коми"
              />
            </Validator>
          </TextBox>
          <RadioGroup
            dataSource={generalAnswersThreeVariants}
            layout="horizontal"
            disabled={blocked}
            value={form?.controlEffortsSGS?.general}
            onValueChanged={(e) => onObjValueChanged({
              e,
              field: 'controlEffortsSGS',
              subfield: 'general',
              setForm,
            })
            }
          />
        </div>

        <span>Інші гальмові системи, функціонування, технічний стан</span>
        <RadioGroup
          dataSource={generalAnswersThreeVariants}
          layout="horizontal"
          disabled={blocked}
          value={form?.otherSystemTechState?.general}
          onValueChanged={(e) => onObjValueChanged({
            e,
            field: 'otherSystemTechState',
            subfield: 'general',
            setForm,
          })
          }
        />

        <span>Маркування, технічний стан складання</span>
        <RadioGroup
          dataSource={generalAnswersThreeVariants}
          layout="horizontal"
          disabled={blocked}
          value={form?.markingTechState?.general}
          onValueChanged={(e) => onObjValueChanged({
            e,
            field: 'markingTechState',
            subfield: 'general',
            setForm,
          })
          }
        />

        <span>Код невідповідності</span>
        <div style={{ width: '250px' }}>
          <SelectBox
            dataSource={brakingSystemInconsistency}
            width={'100%'}
            stylingMode={'outlined'}
            placeholder="Виберіть код"
            disabled={blocked}
            value={form?.code}
            showClearButton={true}
            onValueChanged={(e) => onValueChanged({
              e,
              field: 'code',
              setForm,
            })
            }
          >
            <Validator validationGroup={validationGroupName}>
              {codeIsRequired && <RequiredRule
                message={`Код невідповідності ${required}`}
              />}
            </Validator>
          </SelectBox>
          {form?.code === unexpectedCodeInconsistencyText &&
          <TextArea
            style={{ width: '100%' }}
            onValueChange={(e) => onValueChanged({ e: { value: e },
              setForm, field: 'description' })}
            value={form?.description}
            disabled={blocked}
            stylingMode={'outlined'}
            placeholder={'Опис несправності'}
          />
          }
        </div>
      </div>

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

BrakingSystems.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
  first_registration_date: PropTypes.string,
  category_KTZ: PropTypes.string,
};
