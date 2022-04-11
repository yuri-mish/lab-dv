import Scheduler from 'components/scheduler/scheduler';
import React from 'react';
import './home.scss';

export const HomePage = () => (
  <React.Fragment>
    <div className={'content-block'}>
      <div className={'dx-card responsive-paddings'}>
        <div className={'vSplit'}>
          <div className={'logos-container'} >
            <img
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
              src='/img/photo_main.jpg' alt=''
            />

          </div>
          <Scheduler />
        </div>
        <p>
          Дякуємо, що користуєтесь Кабінетом лабораторії.
          Якщо виникли питання, напишіть нам у чат або телефонуйте в телеграм:
          +38 067 820 39 66
        </p>
      </div>
    </div>
  </React.Fragment>
);


