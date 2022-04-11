/* eslint-disable max-len */
import React from 'react';
import Scheduler from 'components/scheduler/scheduler';
import { Card, CardContent, CardHeader } from 'components';
import { NewOrdersCard, NomStatisticsCard } from './cards';
import styles from './dashboard.module.scss';

export const Dashboard = () => (
  <div>
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.hot_message}>
          У зв&#39;язку з неможливістю отримувати паперові рахунки з РСЦ для
          оплати бланків - тимчасово замість скану форми рахунку допустимо
          підчіпляти будь-який файл, навіть порожній.<br/>
          Оплата буде здійснена за реквізитами попереднього рахунку.
        </div>
      </div>
    </div>
    <div className={styles.container}>
      <div className={styles.column}>
        <NewOrdersCard />
        <NomStatisticsCard />
      </div>
      <div className={styles.column}>
        <Card>
          <CardHeader title={'розклад'} />
          <CardContent>
            <Scheduler />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
