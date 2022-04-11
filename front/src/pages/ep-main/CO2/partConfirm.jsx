import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import {
  TextBox,
  Button,
  RadioGroup,
  ValidationSummary,
} from 'devextreme-react';
import Validator, { RequiredRule } from 'devextreme-react/validator';
import { mockText, inspectors_list, conclusion_list } from 'moks/moksData';
import { required } from 'pages/ep-main/constants';
//components
import { TextLine } from '../components/text-line';
import { ColumnField } from '../components/column-field';
import { FormField } from 'components/form-field/form-field';

import styles from '../styles/ep-main.module.scss';

const PrintPDFbtn = React.lazy(() => import('../components/print/printCO2'));

export const Confirm = ({
  data = {},
  printRef,
  saveRef,
  codes_mismatch,
  blockBtn,
  handleFieldValueChange = () => {},
  handlePdfLoading = () => {},
  handleFormSave = () => {},
  handleSubmit = () => {},
}) => (
  <>
    <TextLine />
    <ColumnField text={mockText?.inspection}>
      <div style={{ maxWidth: 900 }}
        className={`${styles?.df} ${styles?.df_wrap}`}>
        {inspectors_list?.map((item, index) => (
          <div className={styles?.field_wrap} key={index}>
            <TextBox
              id={`${item?.field}_name`}
              value={data[`${item?.field}_name`]}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={'200px'}
              readOnly={!data.draft}
              placeholder={`[${index + 1}] Ініціали, прізвище`}
            >
              <Validator>
                <RequiredRule
                  message=
                    {`[${index + 1}] Ініціали, прізвище - ${required}`}
                />
              </Validator>
            </TextBox>
            <TextBox
              id={`${item?.field}_position`}
              value={data[`${item?.field}_position`]}
              stylingMode={'outlined'}
              onValueChanged={handleFieldValueChange}
              width={'200px'}
              readOnly={!data.draft}
              placeholder={item?.pos_placeholder || 'Посада'}
            >
              <Validator>
                <RequiredRule
                  message={`${item?.pos_placeholder}
                  - ${required}`}
                />
              </Validator>
            </TextBox>
          </div>
        ))}
      </div>
    </ColumnField>
    <ColumnField text={mockText?.codes_mismatch}>
      <TextBox
        id={'codes_mismatch'}
        value={codes_mismatch}
        stylingMode={'outlined'}
        width={'100%'}
        readOnly={true}
      />
    </ColumnField>
    <br />
    <FormField textWidth="200px" text={mockText?.conclusion}>
      <RadioGroup
        id={'conclusion'}
        dataSource={conclusion_list}
        displayExpr={'text'}
        valueExpr={'value'}
        value={data?.conclusion}
        layout="horizontal"
        onValueChanged={handleFieldValueChange}
        readOnly={!!codes_mismatch || !data.draft}
      />
    </FormField>
    <br />
    <ValidationSummary id="summary"/>
    <div className={`${styles?.df_space_around} ${styles?.df_wrap} 
      ${styles?.mr_wrap}`}>
      <Button
        icon="edit"
        onClick={() => {
          handleFormSave({ draft: true });
        }}
        text={mockText?.draft_btn}
        disabled={!data.draft || blockBtn}
      />
      <Button
        ref={saveRef}
        icon="save"
        onClick={handleSubmit}
        text={mockText?.save_btn}
        disabled={!data.draft || blockBtn}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PrintPDFbtn forwardedRef={printRef}
          data={{ ...data, codes_mismatch }}
          handlePdfLoading = {handlePdfLoading} />
      </Suspense>
    </div>
  </>
);

Confirm.propTypes = {
  data: PropTypes.object,
  handleFieldValueChange: PropTypes.func,
  handlePdfLoading: PropTypes.func,
  handleFormSave: PropTypes.func,
  handleSubmit: PropTypes.func,
  printRef: PropTypes.any,
  saveRef: PropTypes.any,
  codes_mismatch: PropTypes.string,
  blockBtn: PropTypes.bool,
};
export default Confirm;
