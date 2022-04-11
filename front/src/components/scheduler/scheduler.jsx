import React, { useEffect, useRef, useState } from 'react';
import { loader } from 'graphql.macro';
import Scheduler, { Resource } from 'devextreme-react/scheduler';

const dsScheduler_gql = loader('./dsScheduler.gql');
import { gqlClient } from 'gql-client';
import AppointEditor from './AppointEditor';
import { Popup } from 'devextreme-react';
import { v4 as uuid_v4 } from 'uuid';
import dayjs from 'dayjs';
import Appointment from './Appointment';
import { writeAppointment } from './scheduler-export';

const views = [ 'day', 'week' ];
export const sources = [
  {
    id: 'lab',
    text: 'Лабораторія',
    color: '#727bd2',
  },
  {
    id: 'wid',
    text: 'Віджет',
    color: '#ad8603',
  },
];
const _Scheduler = () => {
  const startOfDay = dayjs().startOf('date').toDate();
  const [ currentDate, setCurrenDate ] = useState(startOfDay);
  const [ timeline, setTimeLine ] = useState({});
  const [ popupVisible, setPopupVisible ] = useState(false);
  const [ appointmentData, setAppointmentData ] = useState({});
  const [ currentView, setCurrentView ] = useState('day');

  const shedulerRef = useRef();

  const loadSchedulerData = () => {
    gqlClient
      .query({
        query: dsScheduler_gql,
        variables: {
          jfilt: [
            {
              fld: 'date',
              expr: '>=',
              val: currentDate,
            },
            { c: 'and' },
            {
              fld: 'date',
              expr: '<',
              val: dayjs(currentDate).add(1, 'week').toDate(),
            },
          ],
        },
      })
      .then((res) => {
        const tLine = res.data.list.map((el) => ({
          ...el,
          startDate: new Date(el.startDate),
          endDate: new Date(el.endDate),
          partner: (el.partner === null) ?
            { ref: '', id: '' } : el.partner,
          buyers_order: el?.buyers_order,
          color: el?.color,
        }));
        setTimeLine(tLine);
      });
  };
  //dsScheduler
  useEffect(() => {
    loadSchedulerData();
  }, [ currentDate, currentView ]);

  useEffect(() => {
    loadSchedulerData();
  }, []);

  const modifyAppointment = (appointment) => {
    const data = appointment.appointmentData;
    writeAppointment(data).then(() => loadSchedulerData());
  };

  return (
    <>
      <Scheduler
        ref={shedulerRef}
        timeZone='Europe/Kiev'
        dataSource={timeline}
        firstDayOfWeek={1}
        showAllDayPanel={false}
        views={views}
        currentView={currentView}
        height={600}
        cellDuration={30}
        currentDate={currentDate}
        appointmentComponent={Appointment}
        onAppointmentAdded={modifyAppointment}
        onAppointmentUpdated={modifyAppointment}
        onAppointmentDeleted={(delApp) => {
          delApp.appointmentData._deleted = true;
          modifyAppointment(delApp);
        }}
        onOptionChanged={(e) => {
          if (e.name === 'currentDate') {
            setCurrenDate(e.value);
          }
          if (e.name === 'currentView') {
            setCurrentView(e.value);
          }
        }}
        startDayHour={7}
        endDayHour={21}
        onAppointmentFormOpening={(data) => {
          setAppointmentData(data.appointmentData);
          data.popup.option('visible', false);
          setPopupVisible(true);
        }}>
        <Resource
          dataSource={sources}
          fieldExpr='source'
          label='Джерело'
          useColorAsDefault={true}
        />
      </Scheduler>
      <Popup
        style={{ zIndex: 2000 }}
        visible={popupVisible}
        width={500}
        closeOnOutsideClick
        onHiding={() => {
          setPopupVisible(false);
        }}>
        <AppointEditor
          data={appointmentData}
          updateData={(uData) => {
            if (uData?._id) {
              shedulerRef.current.instance.updateAppointment(uData);
            } else {
              uData._id = `shed.appoint|${uuid_v4()}`;
              shedulerRef.current.instance.addAppointment(uData);
            }

            setPopupVisible(false);
          }}
        />
      </Popup>
    </>
  );
};

export default _Scheduler;
