import React from 'react';
import { formatDate } from 'devextreme/localization';
import styles from './appoint-editor.module.scss';


export default function Appointment(model) {
  const { appointmentData } = model.data;
  return (
    <div className='showtime-preview'>
      <div className={styles.hblock}>

        <div>
          {formatDate(appointmentData.startDate, 'shortTime')}
          {' - '}
          {formatDate(appointmentData.endDate, 'shortTime')}
        </div>

        <div style={{ paddingLeft: '16px' }}>
          {/* Контрагент:  */}
          <strong>{appointmentData.partner?.name}</strong>
        </div>
      </div>
      <div> {appointmentData.note}</div>
    </div>
  );
}
