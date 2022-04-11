import { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Button } from 'devextreme-react/button';
import {
  SelectFieldsList,
} from 'components/ep-form-field/lists/select-fields-list';
import Box, { Item } from 'devextreme-react/box';
import { TextBox } from 'devextreme-react/text-box';

import { checkCanSend, extractCodes } from 'utils/ep-form';

import { additionalTaxiCheckFields } from 'moks/epFormsData';

import { ValidationSummary } from 'devextreme-react';
import { timeDateFormat } from 'utils/date-formats';
import styles from './forms.module.scss';


export const SecondDodatok = ({
  handleChange = () => {},
  handlePopupClose = () => {},
  blocked,
  number_doc,
  data = {},
}) => {
  const [ form, setForm ] = useState(data?.form || {});
  const [ note, setNote ] = useState(data?.note || '');
  const [ startTime ] = useState(data?.startTime || dayjs().format());

  const onValueChanged = (e) => {
    setNote(e.value);
  };

  const canSend = checkCanSend({
    form,
    defaultFields: additionalTaxiCheckFields,
  });

  const validationGroupName = 'dodatok-2';
  const validateEditor = function(e) {
    const res = e.validationGroup.validate();
    if (res?.status === 'valid') {
      const codes = extractCodes(form);

      handleChange({
        form,
        note,
        startTime,
        codes,
        status: codes.length > 0 ? 'failed' : 'passed',
      });
      handlePopupClose();
    }
  };

  return (
    <div className={styles.form_wrapper}>
      <div className={styles.form_header}>
        <span>
            Початок {dayjs(startTime).format(timeDateFormat)}
        </span>
        <span>
             Додаток 2
          <br />
          <span>{number_doc !== '' && 'ЕП №'}{number_doc}</span>
        </span>
      </div>

      <h2 className={styles.form_title}>
          Додаткова перевірка автобусів таксі
      </h2>

      <hr className={styles.form_line}/>


      <SelectFieldsList
        fields={additionalTaxiCheckFields}
        form={form}
        setForm={setForm}
        blocked={blocked}
        validationGroup={validationGroupName}
      />

      <div className={styles.line_wrapper}>
        <span>Примітка</span>
      </div>
      <Box direction="row" width="100%" align="center">
        <Item ratio={0} baseSize={'100%'}>
          <TextBox
            stylingMode={'outlined'}
            onValueChanged={onValueChanged}
            value={note}
            disabled={blocked}
          />
        </Item>
      </Box>

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

SecondDodatok.propTypes = {
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  data: PropTypes.object,
  number_doc: PropTypes.string,
  blocked: PropTypes.bool,
};
