import { useRef } from 'react';
import {
  Column,
  Lookup,
} from 'devextreme-react/data-grid';
import { Menu } from 'devextreme-react';
import { useHistory } from 'react-router-dom';

import { statusCellRender, DoclistPageTemplate } from 'components';
import {
  docStatuses,
} from 'app-constants';
import {
  mapDocStatusesToTypes,
  priceOrderTypeNameByType,
  priceOrderTypes,
} from './constants';
import { dsPriceOrders } from './ds-price-orders';
import { useDocChangeListener } from 'hooks';


export const PriceOrders = () => {
  const history = useHistory();
  const gridRef = useRef();
  useDocChangeListener('doc.priceorder', () => {
    gridRef.current.instance.refresh(true);
  });

  return (
    <DoclistPageTemplate
      ref={gridRef}
      pageName='Замовлення знижки'
      onEdit={(ref) => history.push(`/price_order/${ref}`)}
      dataSource={dsPriceOrders}
      menuComponent={(
        <Menu
          onItemClick={(e) => {
            if (e.itemData.id === 'new') {
              history.push('/price_order/new');
            }
          }}
          dataSource={[
            {
              text: 'Додати',
              id: 'new',
              icon: 'add',
            },
          ]}
        />
      )}
    >
      <Column
        dataField='transactions_kind'
        dataType='string'
        caption='Вид операции'
        alignment='left'
        calculateDisplayValue={
          (row) => priceOrderTypeNameByType[row.transactions_kind]
        }
        width={100}
      >
        <Lookup
          dataSource={priceOrderTypes}
          displayExpr={(value) => priceOrderTypeNameByType[value]}
          allowClearing={true}
        />
      </Column>

      <Column
        cssClass='otk-cell-no-padding'
        dataField='status'
        dataType='string'
        caption='Статус'
        alignment='center'
        width={130}
        cellRender={(data) => statusCellRender(data, mapDocStatusesToTypes)}
      >
        <Lookup
          dataSource={Object.values(docStatuses)}
          valueExpr='status'
          displayExpr='statusText'
          allowClearing={true}
        />
      </Column>

      <Column
        dataField='quantity'
        dataType='number'
        caption='Загальна кількість'
        alignment='center'
        hidingPriority={1}
        width={140}
      />
    </DoclistPageTemplate>
  );
};

