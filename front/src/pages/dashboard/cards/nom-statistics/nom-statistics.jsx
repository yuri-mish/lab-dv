import { Accordion } from 'devextreme-react/accordion';
import { Card, CardContent, CardHeader } from 'components';
import { List } from 'devextreme-react';
import dayjs from 'dayjs';
import styles from './nom-statistics.module.scss';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useDocChangeListener } from 'hooks';
import { useMemo } from 'react';

const getLabReports = loader('./getLabReports.gql');

const NomList = (props) => {
  const ListItem = (data) => (
    <div className={styles.listItem}>
      <div>{data.index}</div>
      <div>{data.nom}</div>
      <div>{data.count}</div>
    </div>
  );

  return (
    <List
      itemRender={ListItem}
      dataSource={props.datasource}
      height={props.datasource?.length > 4 ? 145 : undefined}
    />
  );
};

NomList.propTypes = {
  ...List.propTypes,
};

const buildDs = (reports) => {
  if (reports?.length > 0) {
    const uniqueNoms = {};
    reports.forEach((report) => {
      const serviceName = report?.service?.name;
      if (serviceName && uniqueNoms[serviceName]) {
        uniqueNoms[serviceName].count++;
      } else {
        uniqueNoms[serviceName] = { nom: serviceName, count: 1 };
      }
    });
    return Object.values(uniqueNoms)
      .sort((a, b) => (a.count < b.count ? 1 : -1))
      .map((nom, index) => ({ ...nom, index: index + 1 }));
  }
  return [];
};

export const NomStatisticsCard = () => {
  const currentMonthStart = dayjs().startOf('month');
  const prevMonthStart = dayjs(currentMonthStart).subtract(1, 'month');

  const { data: prevMonthReports } = useQuery(getLabReports, {
    variables: {
      jfilt: [
        { fld: 'date', expr: '>=', val: prevMonthStart.toISOString() },
        { c: 'and' },
        { fld: 'date', expr: '<', val: currentMonthStart.toISOString() },
      ],
    },
    fetchPolicy: 'cache-first',
  });

  const { data: currentMonthReports, refetch } = useQuery(getLabReports, {
    variables: {
      jfilt: { fld: 'date', expr: '>=', val: currentMonthStart.toISOString() },
    },
  });

  useDocChangeListener('doc.lab_report', () => refetch());

  const currentMonthDs = useMemo(() => (
    buildDs(currentMonthReports?.list)
  ), [ currentMonthReports ]);

  const prevMonthDs = useMemo(() => (
    buildDs(prevMonthReports?.list)
  ), [ prevMonthReports ]);

  const currentMonthSummary = useMemo(() => (
    currentMonthDs.reduce((sum, service) => sum + service.count, 0)
  ), [ currentMonthDs ]);

  const months = [ {
    title: 'Поточний місяць',
    ds: currentMonthDs,
  }, {
    title: 'Минулий місяць',
    ds: prevMonthDs,
  } ];


  return (
    <Card>
      <CardHeader
        title={'Статистика за місяць'}
        subTitle={String(currentMonthSummary)}
      />
      <CardContent>
        <Accordion
          dataSource={months}
          focusStateEnabled={false}
          itemTitleRender={(data) => (
            <div className='otk-accordion-title'>{data.title}</div>
          )}
          itemComponent={(data) => (
            <NomList datasource={data.data.ds} />
          )}
          itemMargin
          collapsible
        />
      </CardContent>
    </Card>
  );
};
