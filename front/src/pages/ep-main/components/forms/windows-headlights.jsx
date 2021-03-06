import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import {
  EpFormFieldSelect,
} from 'components/ep-form-field/ep-form-field-select';
import {
  EpFormFieldInput,
} from 'components/ep-form-field/ep-form-field-input';
import {
  EpFormFieldISimple,
} from 'components/ep-form-field/ep-form-field-simple';
import {
  LightFieldInput,
} from 'components/ep-form-field/light-fields/ep-form-field-input';
import {
  LightFieldTwoInput,
} from 'components/ep-form-field/light-fields/ep-form-field-two-input';
import {
  LightFieldInconsistency,
} from 'components/ep-form-field/light-fields/ep-form-field-inconsistency';

import {
  EpFormFieldMovingFrequency,
} from 'components/ep-form-field/ep-form-field-moving-frequency';
import {
  LightRbFieldsList,
} from 'components/ep-form-field/lists/light-rb-fields-list';

import { Button } from 'devextreme-react/button';
import Box, { Item } from 'devextreme-react/box';
import { TextLine } from '../text-line';
import { ValidationSummary, RadioGroup } from 'devextreme-react';

import {
  checkedParamsFields,
  existStateFunctionalityFields,
  highBeamHeadlightField,
  lightPowerFields,
  lightPowerInconsistency,
  lightSignalsFirstFields,
  frequencyBlinkingField,
  lightSignalsSecondFields,
  lightSignalsInconsistency,
  mirrorsDevicesFields,
  movingFrequencyField,
  windowsFields,
  windshieldWiperFields,
} from 'moks/epFormsData';
import { SetAllValues, setValueForAll } from '../setAllValues';
import { checkCanSend, extractCodes } from 'utils/ep-form';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';

export const WindowsHeadlights = ({
  handleChange = () => {},
  handlePopupClose = () => {},
  blocked,
  number_doc,
  data = {},
  category_KTZ,
}) => {
  const ktz_start_o = category_KTZ?.startsWith('O') || false;
  const isO1O2O3O4 = [ 'O1', 'O2', 'O3', 'O4' ].includes(category_KTZ);
  const isL1_L7 =
    [ 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7' ].includes(category_KTZ);
  const [ startTime ] = useState(data?.startTime || dayjs().format());
  const [ windows, setWindows ] = useState(data?.windows || {});
  const [ checkedParams, setCheckedParams ] = useState(
    data?.checkedParams || {},
  );
  const [ externalLightingDevices, setExternalLightingDevices ] = useState(
    data?.externalLightingDevices || {},
  );
  const [ lightPower, setLightPower ] = useState(data?.lightPower || {});
  const [ lightPowerType, setLightPowerType ] = useState(
    data?.lightPowerType || '??????????????');
  const [ lightSignals, setLightSignals ] = useState(data?.lightSignals || {});
  const [ mirrorsDevices, setMirrorsDevices ] = useState(
    data?.mirrorsDevices || {},
  );
  const [ windshieldWiper, setWindshieldWiper ] = useState(
    data?.windshieldWiper || {},
  );

  const windowsCanSend = checkCanSend({
    form: windows,
    defaultFields: windowsFields,
  });

  const lightSignalsCanSend = checkCanSend({
    form: lightSignals,
    defaultFields: [ ...lightSignalsFirstFields, ...lightSignalsSecondFields ],
  });

  const mirrorsDevicesCanSend = checkCanSend({
    form: mirrorsDevices,
    defaultFields: mirrorsDevicesFields,
  });

  const windshieldWiperCanSend = checkCanSend({
    form: windshieldWiper,
    defaultFields: [ ...windshieldWiperFields, movingFrequencyField ],
  });

  const constructionStateCanSend = checkCanSend({
    form: externalLightingDevices?.constructionState,
    defaultFields: existStateFunctionalityFields,
  });

  const techStateCanSend = checkCanSend({
    form: externalLightingDevices?.techState,
    defaultFields: existStateFunctionalityFields,
  });

  const directionPropagationRaysCanSend = checkCanSend({
    form: externalLightingDevices?.directionPropagationRays,
    defaultFields: existStateFunctionalityFields,
  });

  const lightDistributionCanSend = checkCanSend({
    form: externalLightingDevices?.lightDistribution,
    defaultFields: existStateFunctionalityFields,
  });

  const externalLightingDevicesCanSend =
    constructionStateCanSend &&
    techStateCanSend &&
    directionPropagationRaysCanSend &&
    lightDistributionCanSend;

  const canSend =
    windowsCanSend &&
    lightSignalsCanSend &&
    mirrorsDevicesCanSend &&
    windshieldWiperCanSend &&
    externalLightingDevicesCanSend;

  const validationGroupName = 'windowsHeadlights';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = extractCodes({
        ...windows,
        lightSignals,
        lightPower,
        ...mirrorsDevices,
        ...windshieldWiper,
      });

      handleChange({
        windows,
        checkedParams,
        externalLightingDevices,
        lightPower,
        lightPowerType,
        lightSignals,
        mirrorsDevices,
        windshieldWiper,
        // photo,
        startTime,
        codes,
        status: codes.length > 0 ? 'failed' : 'passed',
      });
      handlePopupClose();
    }
  };
  const setDefaultExternalLightingDevices = () => {
    //???? ??1, N1
    const forM1N1 = [ 'M1', 'N1' ].includes(category_KTZ);
    //?????????? ??1 ?? ??2
    const notForO1O2 = [ 'O1', 'O2' ].includes(category_KTZ);
    //?????????? ??1, ??1
    const notForM1O1 = [ 'M1', 'O1' ].includes(category_KTZ);
    //???????????????????? ???? ??2 ??3 N2 N3 O2 O3 O4
    const forM2M3N2N3O2O3O4 =
      [ 'M2', 'M3', 'N2', 'N3', 'O2', 'O3', 'O4' ].includes(category_KTZ);
    if (isO1O2O3O4) {
      [ 'constructionState',
        'techState',
        'directionPropagationRays',
        'lightDistribution' ].forEach((item) => {
        setValueForAll({ elements: existStateFunctionalityFields,
          setData: setExternalLightingDevices, stateField: item });
      });
      setValueForAll({ elements: [ { field: 'frontTurnSignals' },
        { field: 'sideTurnSignals' },
        { field: 'frontFogLights' } ],
      setData: setLightSignals });
    }
    if (!isO1O2O3O4) {
      setValueForAll({ elements: [ { field: 'backReflectorsTriangular' } ],
        setData: setLightSignals });
    }
    if (!forM1N1) {
      setValueForAll({ elements: [ { field: 'additionalBrakingSignals' } ],
        setData: setLightSignals });
    }
    if (notForO1O2) {
      setValueForAll({ elements: [ { field: 'frontPositionLights' } ],
        setData: setLightSignals });
    }
    if (!forM2M3N2N3O2O3O4) {
      setValueForAll({ elements: [ { field: 'sidePositionLights' } ],
        setData: setLightSignals });
    }
    if (notForM1O1) {
      setValueForAll({ elements: [ { field: 'sideReflectors' } ],
        setData: setLightSignals });
    }
    if (!forM2M3N2N3O2O3O4) {
      setValueForAll({ elements: [ { field: 'contourLights' } ],
        setData: setLightSignals });
    }
    if (isL1_L7 || isO1O2O3O4) {
      setValueForAll({ elements: [ { field: 'movingFrequency' },
        { field: 'constructionState' },
        { field: 'techState' } ],
      setData: setWindshieldWiper });
    }
  };
  const setAllCheckedParams = () => {
    const values = {};
    checkedParamsFields.forEach((item) => {
      values[item?.field] = { general: '????' };
    });
    setCheckedParams(values);
  };
  const checkNormsLightPower = () => {
    let outNormsValue = false;
    lightPowerFields.forEach((item) => {
      if (lightPower[item.field]?.left > item?.normMax ||
          lightPower[item.field]?.right > item?.normMax ||
          lightPower[item.field]?.left < item?.normMin ||
          lightPower[item.field]?.right < item?.normMin) {
        outNormsValue = true;
      }
    });
    if (lightPower?.[highBeamHeadlightField.field] >
      highBeamHeadlightField?.normMax ||
      lightPower?.[highBeamHeadlightField.field] <
      highBeamHeadlightField?.normMin) {
      outNormsValue = true;
    }
    return outNormsValue;
  };
  const codeLightPowerRequired = checkNormsLightPower();
  const checkNormsExternalLightingDevices = () => {
    let hasNo = false;
    let outNormsValue = false;
    [ 'constructionState',
      'techState',
      'directionPropagationRays',
      'lightDistribution' ].forEach((item) => {
      existStateFunctionalityFields.forEach((element) => {
        if (externalLightingDevices?.[item]
          ?.[element?.field]?.general === '????') {
          hasNo = true;
        }
      });
    });
    lightSignalsFirstFields.concat(lightSignalsSecondFields).forEach((item) => {
      if (lightSignals[item?.field]?.general === '????') {
        hasNo = true;
      }
    });
    if (lightSignals?.[frequencyBlinkingField?.field] >
        frequencyBlinkingField?.normMax ||
      lightSignals?.[frequencyBlinkingField?.field] <
        frequencyBlinkingField?.normMin) {
      outNormsValue = true;
    }
    return hasNo || outNormsValue;
  };
  const codeExternalLightingDevicesRequired =
    checkNormsExternalLightingDevices();
  useEffect(() => {
    if (windows?.designCompliance?.general === '??????' ||
      windows?.designCompliance?.general === '????') setAllCheckedParams();
  }, [ windows?.designCompliance?.general ]);
  useEffect(() => {
    if (ktz_start_o) {
      setWindshieldWiper((prev) => ({ ...prev, [movingFrequencyField.field]:
        { general: '????' } }));
    }
    setDefaultExternalLightingDevices();
  }, [ category_KTZ ]);
  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>
            ?????????????? {dayjs(startTime).format(timeDateFormat)}
        </span>
        <span>{number_doc !== '' && '???? ???'}{number_doc}</span>
      </div>

      <h2 className={styles.form_title}>
          ???????????? / ???????? / ???????????????? / ?????????????????????? ???? ????????????????????
      </h2>

      <h2>????????????</h2>

      {windowsFields.map((item) => {
        const { field } = item;
        const disabled = windows[field]?.general !== '????';

        return (
          <EpFormFieldSelect
            key={field}
            {...item}
            disabled={disabled}
            value={windows[field]}
            setForm={setWindows}
            blocked={blocked}
            validationGroup={validationGroupName}
          />
        );
      })}
      <div className={styles.line_wrapper}>
        <TextLine text="?????????????????? ?????? ????????????, ???? ??????????????????????????" />
      </div>

      {checkedParamsFields.map((item) => {
        const { field } = item;
        const disabled = checkedParams[field]?.general !== '????';

        return (
          <EpFormFieldInput
            key={field}
            {...item}
            disabled={disabled}
            value={checkedParams[field]}
            setForm={setCheckedParams}
            blocked={blocked}
            validationGroup={validationGroupName}
          />
        );
      })}
      <SetAllValues elements={checkedParamsFields} setData={setCheckedParams}/>
      <h2>???????????????? ???????????????? ??????????????</h2>

      <div className={styles.line_wrapper}>
        <TextLine
          text="??????????????????, ???????? ??????????????????????,
                        ?????????????????????????? ????????????????????"
        />
      </div>

      {existStateFunctionalityFields.map((item) => {
        const stateField = 'constructionState';
        const { field } = item;

        return (
          <EpFormFieldISimple
            key={field}
            {...item}
            stateField={stateField}
            value={externalLightingDevices}
            setForm={setExternalLightingDevices}
            blocked={blocked}
          />
        );
      })}
      <SetAllValues elements={existStateFunctionalityFields}
        stateField={'constructionState'}
        setData={setExternalLightingDevices}/>
      <div className={styles.line_wrapper}>
        <TextLine text="?????????????????? ????????" />
      </div>

      {existStateFunctionalityFields.map((item) => {
        const stateField = 'techState';
        const { field } = item;

        return (
          <EpFormFieldISimple
            key={field}
            {...item}
            stateField={stateField}
            value={externalLightingDevices}
            setForm={setExternalLightingDevices}
            blocked={blocked}
          />
        );
      })}
      <SetAllValues elements={existStateFunctionalityFields}
        stateField={'techState'}
        setData={setExternalLightingDevices}/>
      <div className={styles.line_wrapper}>
        <TextLine text={`???????? ????????????, ${lightPowerType}`} />
      </div>
      <Box direction="row" width="100%" align="center">
        <Item ratio={0} baseSize={'60%'}>
          <span style={{ width: 'fit-content' }}>
            ?????????????? ??????????????????????
          </span>
        </Item>
        <Item ratio={0} baseSize={'40%'}>
          <RadioGroup
            dataSource={[ '??????????????', '??????????' ]}
            layout="horizontal"
            // layout="vertical"
            value={lightPowerType}
            onValueChanged={(e) => setLightPowerType(e?.value)}
            disabled={blocked || isO1O2O3O4}
          />
        </Item>
      </Box>
      <LightFieldInput
        title={highBeamHeadlightField.title}
        field={highBeamHeadlightField.field}
        normMin={highBeamHeadlightField.normMin}
        normMax={highBeamHeadlightField.normMax}
        value={lightPower}
        setForm={setLightPower}
        blocked={blocked || isO1O2O3O4}
        validationGroup={validationGroupName}
        luxUnits={lightPowerType === '??????????'}
      />

      {lightPowerFields.map((item) => (
        <LightFieldTwoInput
          luxUnits={lightPowerType === '??????????'}
          key={item.field}
          {...item}
          value={lightPower}
          setForm={setLightPower}
          blocked={blocked || isO1O2O3O4}
          validationGroup={validationGroupName}
        />
      ))}

      <LightFieldInconsistency
        {...lightPowerInconsistency}
        multiSelect={true}
        value={lightPower}
        setForm={setLightPower}
        blocked={blocked || isO1O2O3O4}
        showClearButton={true}
        validationGroup={validationGroupName}
        requiredRule={codeLightPowerRequired}
      />

      <div className={styles.line_wrapper}>
        <TextLine text="???????????????????????????? ???????????????? ?????????????????? ????????????????" />
      </div>

      {existStateFunctionalityFields.map((item) => {
        const stateField = 'directionPropagationRays';
        const { field } = item;

        return (
          <EpFormFieldISimple
            key={field}
            {...item}
            stateField={stateField}
            value={externalLightingDevices}
            setForm={setExternalLightingDevices}
            blocked={blocked}
          />
        );
      })}
      <SetAllValues elements={existStateFunctionalityFields}
        stateField={'directionPropagationRays'}
        setData={setExternalLightingDevices}/>
      <div className={styles.line_wrapper}>
        <TextLine text="??????????????????????????" />
      </div>

      {existStateFunctionalityFields.map((item) => {
        const stateField = 'lightDistribution';
        const { field } = item;

        return (
          <EpFormFieldISimple
            key={field}
            {...item}
            stateField={stateField}
            value={externalLightingDevices}
            setForm={setExternalLightingDevices}
            blocked={blocked}
          />
        );
      })}
      <SetAllValues elements={existStateFunctionalityFields}
        stateField={'lightDistribution'}
        setData={setExternalLightingDevices}/>

      <div className={styles.line_wrapper}>
        <TextLine text="???????????????? ?????????????????? ??????????" />
      </div>
      <div className={styles.color_lines}>
        <LightRbFieldsList
          fields={lightSignalsFirstFields}
          value={lightSignals}
          setForm={setLightSignals}
          blocked={blocked}
          validationGroup={validationGroupName}
        />
      </div>
      <SetAllValues elements={lightSignalsFirstFields}
        setData={setLightSignals}/>
      <LightFieldInput
        {...frequencyBlinkingField}
        value={lightSignals}
        setForm={setLightSignals}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <LightRbFieldsList
        fields={lightSignalsSecondFields}
        value={lightSignals}
        setForm={setLightSignals}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <LightFieldInconsistency
        {...lightSignalsInconsistency}
        multiSelect={true}
        value={lightSignals}
        setForm={setLightSignals}
        blocked={blocked}
        showClearButton={true}
        validationGroup={validationGroupName}
        requiredRule={codeExternalLightingDevicesRequired}
      />

      <h2 className={styles.form_title}>
          ????????????????, ???????? ???????????? ???????????????? ????????
      </h2>

      {mirrorsDevicesFields.map((item) => {
        const { field } = item;
        const disabled = mirrorsDevices[field]?.general !== '????';

        return (
          <EpFormFieldSelect
            key={field}
            {...item}
            disabled={disabled}
            value={mirrorsDevices[field]}
            setForm={setMirrorsDevices}
            blocked={blocked}
            validationGroup={validationGroupName}
          />
        );
      })}

      <h2 className={styles.form_title}>?????????????????????? ???? ????????????????????</h2>

      {windshieldWiperFields.map((item) => {
        const { field } = item;
        const disabled = windshieldWiper[field]?.general !== '????';

        return (
          <EpFormFieldSelect
            key={field}
            {...item}
            disabled={disabled}
            value={windshieldWiper[field]}
            setForm={setWindshieldWiper}
            blocked={blocked || ktz_start_o || isL1_L7}
            validationGroup={validationGroupName}
          />
        );
      })}

      <EpFormFieldMovingFrequency
        {...movingFrequencyField}
        textBoxMin={35}
        value={windshieldWiper[movingFrequencyField.field]}
        setForm={setWindshieldWiper}
        disabled={
          windshieldWiper[movingFrequencyField.field]?.general !== '????'
        }
        blocked={blocked || ktz_start_o || isL1_L7}
        validationGroup={validationGroupName}
      />

      {/* <FormField textWidth="200px" text={'???????? ????????????????????'}>
        <Box>
          <Item>
            <SingleFileUploader
              bucketUrl={BLANKS_BUCKET_URL}
              accept={file_accept}
              allowedFileExtensions={file_img_types}
              maxFileSize={maxFileSize2MB}
              uploadedFileUrl={photo.photo_relogoskop}
              disabled={blocked}
              onFileUploaded={(file) => {
                setPhoto((prev) => ({
                  ...prev,
                  photo_relogoskop: file.url,
                }));
              }}
              onFileDeleted={() => {
                setPhoto((prev) => ({
                  ...prev,
                  photo_relogoskop: '',
                }));
              }}
            >
              <Validator validationGroup={validationGroupName}>
                {!photo?.photo_relogoskop &&
                  (<RequiredRule
                    message={'???????? ???????????????????? - ????????`???????????? ????????'}
                  />)
                }
              </Validator>
            </SingleFileUploader>
          </Item>
        </Box>
      </FormField> */}
      <br />
      <ValidationSummary validationGroup={validationGroupName} />

      {!blocked && (
        <Button
          text="??????????????????"
          className={styles.form_button}
          validationGroup={validationGroupName}
          onClick={validateEditor}
          disabled={!canSend}
        />
      )}
    </div>
  );
};

WindowsHeadlights.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
  category_KTZ: PropTypes.string,
};
