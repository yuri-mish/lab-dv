import {
  Button,
  DateBox,
  NumberBox,
  TextArea,
  TextBox,
} from 'devextreme-react';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './appoint-editor.module.scss';
import { PartnerSearch } from 'components/partner-search/partner-search';
import { FORM_STYLING_MODE } from 'app-constants';
import { OrdersSearch } from './../orders-search/orders-search';
import { dsLabReportSearchOrders } from 'pages/lab-reports/datasources';
import { SelectBox } from 'devextreme-react/select-box';
import { sources } from './scheduler';


const durationCalc = (begin, end) => {
  if (end && begin) {
    return (
      (end.getTime() - begin.getTime()) / 60000
    );
  }
  return 0;
};

const AppointEditor = (props) => {

  const [ data, setData ] = useState(props.data);

  const handleOrderSelect = (e) => {
    setData((prev) => ({
      ...prev,
      buyers_order: {
        ref: e?.ref,
        caption: e?.caption,
        date: e?.date,
        partner: e?.partner,
      },
      partner: e.partner || prev.partner,
    }));
  };

  const handleChange = (e) => {
    const id = e.element.id;
    const newState = { ...data };
    newState[id] = e.value;
    // Fast fix
    if (id === 'duration' && newState.startDate) {
      newState.endDate = new Date(
        newState.startDate.getTime() + (e.value * 60000),
      );
    } else {
      newState.duration = durationCalc(newState.startDate, newState.endDate);
    }
    setData(newState);
  };


  useEffect(() => {
    if (props.data.startDate) {
      props.data.duration = durationCalc(
        props.data.startDate, props.data.endDate,
      );
    }
    props.data.source = props.data?.source ? props.data?.source : 'lab';
    setData(props.data);
  }, [ props.data ]);

  return (
    <div className={styles.vblock} >
      <div className={styles.hblock}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Початок</div>
          <DateBox
            id="startDate" stylingMode="outlined"
            value={data?.startDate}
            max={data?.endDate}
            type="datetime"
            interval={30}
            onValueChanged = {handleChange}
          />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Закінчення
          </div>
          <DateBox
            id="endDate" stylingMode="outlined"
            value={data?.endDate}
            min={data?.startDate}
            onValueChanged = {handleChange}
            type="datetime" />
        </div>
      </div>
      <div className={styles.hblock}>
        <div className={styles.field}>

          <div className={styles.fieldLabel}>
            Джерело
          </div>
          <SelectBox
            id="source"
            dataSource={sources}
            valueExpr="id"
            displayExpr='text'
            value={data?.source}
            readOnly={true}
            onValueChanged = {handleChange} />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Тривалість
          </div>
          <NumberBox
            id="duration" stylingMode="outlined"
            value={data?.duration}
            min={0}
            showSpinButtons={true}
            width={65}
            step={5}
            onValueChanged = {handleChange} />
        </div>

      </div>
      <div className={styles.hblock}>
        <div className={styles.field} style={{ width: '100%' } }>
          <div className={styles.fieldLabel}>
            Коментар
          </div>
          <TextArea
            className={styles.fieldArea} stylingMode="outlined"
            id="note"
            value={data?.note}
            onValueChanged = {handleChange} />
        </div>

      </div>
      <div className={styles.field}>
        <div className={styles.fieldLabel}>
            Контрагент</div>
        <PartnerSearch
          partner={data?.partner}
          onSelect={(e) => {
            const newState = {
              ...data,
              partner: {
                ref: e.ref || '',
                name: e.name || '',
              },
            };
            if (data?.buyers_order?.partner?.ref !== e.ref) {
              newState.buyers_order = undefined;
            }
            setData({ ...newState });
          }}
          stylingMode={FORM_STYLING_MODE}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Телефон</div>
        <TextBox
          value={data?.partner?.phones}
          readOnly
          width='100%'
          stylingMode={FORM_STYLING_MODE}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>
        Замовлення</div>
        <OrdersSearch
          dataSource={dsLabReportSearchOrders}
          order={data?.buyers_order}
          onSelect={handleOrderSelect}
          readOnly={false}
          stylingMode={FORM_STYLING_MODE}
        />

      </div>
      <Button text="Зберегти" onClick={() => {
        props.updateData(data);
      }}
      />
    </div>

  );
};

AppointEditor.propTypes = {
  data: PropTypes.object,
  updateData: PropTypes.func,
};
export default AppointEditor;
