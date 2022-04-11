/* eslint-disable no-unused-vars */
import { Card, CardHeader, CardContent } from 'components';
import { useQuery } from '@apollo/client';
import { CardOptions } from 'components/card/card';
import { Button, List } from 'devextreme-react';
import { useMessageVars } from 'hooks';
import { useHistory } from 'react-router';
import styles from './new-orders.module.scss';
import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { loader } from 'graphql.macro';
import { MenuItem } from 'devextreme-react/list';
import { DATE_DISPLAY_FORMAT } from 'app-constants';
const getOrders = loader('./getOrders.gql');

const date = dayjs().subtract(3, 'day').toISOString();
const LIMIT = 10;

export const NewOrdersCard = () => {
  const [ newOrdersList, newOrdersCount ] = useMessageVars(
    [ 'newOrdersList', 'newOrdersCount' ],
  );

  const history = useHistory();

  const { data, refetch } = useQuery(getOrders, {
    variables: {
      jfilt: { fld: 'date', expr: '>=', val: date },
      limit: LIMIT,
    },
    fetchPolicy: 'cache-first',
  });

  useEffect(() => refetch(), [ newOrdersList ]);

  const newOrders = useMemo(() => (
    data?.list?.map((order) => ({
      ref: order.ref,
      date: order.date,
      services: order.services.reduce(
        (prev, curr) => `${prev} ${curr?.nom?.name ?? ''}`, '',
      ),
    })) ?? []
  ), [ data ]);

  const ListItem = (data) => (
    <div className={styles.listItem}>
      <div>{dayjs(data.date).format(DATE_DISPLAY_FORMAT)}</div>
      <div>{data.services}</div>
      <Button
        icon='edit'
        onClick={() => history.push(`/order/${data.ref}`)}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader
        title={'Нові Заявки за останні 3 дні'}
        subTitle={newOrders.length === LIMIT ? `>${LIMIT}` : newOrders.length}
      />
      <CardOptions>
        <Button
          icon='bulletlist'
          hint='переглянути'
          onClick={() => history.push('/orders?show_new=true')}
        ></Button>
      </CardOptions>
      {newOrders.length > 0 &&
        <CardContent>
          <List
            dataSource={newOrders}
            itemRender={ListItem}
            focusStateEnabled={false}
            activeStateEnabled={false}
          >
            <MenuItem
              text='Add to Cart'
              icon='search'
              action={() => {}}
            />
          </List>
        </CardContent>
      }
    </Card>
  );
};
