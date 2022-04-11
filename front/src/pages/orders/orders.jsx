import { useCallback, useRef, useState } from 'react';
import { Column, Lookup } from 'devextreme-react/data-grid';
import { Menu } from 'devextreme-react';
import { useHistory, Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { API_HOST, COLUMN_PRICE_WIDTH } from 'app-constants';
import { dsOrders } from './ds-orders';
import { openDoc } from 'utils/open-doc';
import { useDocChangeListener, useProj, useMessageVars } from 'hooks';
import { DoclistPageTemplate } from 'components';
import { dsProj } from 'datasources';
import styles from './order.module.scss';


export const Orders = () => {
  const [ selectedRowData, setSelectedRowData ] = useState({});
  const history = useHistory();
  const gridRef = useRef();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const showNewOrders = !!params.get('show_new');

  const { proj } = useProj();

  const [ newOrders ] = useMessageVars([ 'newOrdersList' ]);

  useDocChangeListener('doc.buyers_order', () => {
    gridRef.current.instance.refresh(true);
  });

  const cellShippedRender = useCallback((cell) => (cell.data.shipped ?
    <Link to={`/acts?trans_ref=${cell.data.ref}`}>{cell.data.shipped}</Link> :
    <>{cell.data.shipped}</>), [],
  );


  return (
    <DoclistPageTemplate
      ref={gridRef}
      deps={[ proj, newOrders ]}
      pageName='Замовлення'
      onEdit={(ref) => history.push(`/order/${ref}`)}
      dataSource={dsOrders}
      onRowPrepared={(e) => {
        if (e.data?.protected && e.rowType === 'data') {
          e.rowElement.classList.add('otk-row-status-warning');
        }
      }}
      onCellPrepared={(e) => {
        if (
          e.column.dataField === 'number_doc' &&
          e.rowType === 'data' &&
          newOrders.some((msg) => msg.ref === e.data?.ref)
        ) {
          e.cellElement.classList.add(styles.cellNewOrder);
        }
      }}
      onSelectionChanged={(e) => {
        setSelectedRowData(e.selectedRowsData[0] || {});
      }}
      stateStoringEnabled={!showNewOrders}
      menuComponent={(
        <Menu
          onItemClick={(e) => {
            switch (e.itemData.id) {
            case 'new': {
              history.push('/order/new');
              break;
            }
            case 'print': {
              openDoc(e.itemData.url);
              break;
            }
            default:
            }
          }}
          dataSource={[
            {
              text: 'Додати',
              icon: 'add',
              id: 'new',
            },
            {
              text: 'Друк',
              icon: 'print',
              disabled: !(selectedRowData.ref && selectedRowData.number_doc),
              items: [
                {
                  id: 'print',
                  text: 'Рахунок',
                  url: `${API_HOST}/printform/${selectedRowData.ref}/inv`,
                },
                {
                  id: 'print',
                  text: 'Договір',
                  url: `${API_HOST}/printform/${selectedRowData.ref}/dog`,
                },
                {
                  id: 'print',
                  text: 'Договір сертифікації',
                  url: `${API_HOST}/printform/${selectedRowData.ref}/dogs`,
                },
                {
                  id: 'print',
                  text: 'Договір для Казначейства',
                  url: `${API_HOST}/printform/${selectedRowData.ref}/dogk`,
                },
              ],
            },
          ]}
        />
      )}
    >
      <Column
        dataField='proj'
        dataType='string'
        caption='Тип'
        alignment='left'
        calculateDisplayValue={
          (row) => proj?.find((p) => p.ref === row.proj)?.name
        }
        width={120}
      >
        <Lookup
          dataSource={dsProj}
          valueExpr='ref'
          displayExpr='name'
          allowClearing={true}
        />
      </Column>

      <Column
        allowSorting={true}
        dataField='doc_amount'
        caption='Сума'
        dataType='number'
        alignment='right'
        width={COLUMN_PRICE_WIDTH}
      />

      <Column
        allowSorting={false}
        dataField='shipped'
        caption='Відвантажено'
        dataType='number'
        alignment='right'
        cellRender={cellShippedRender}
        width={100}
      />

      <Column
        allowSorting={false}
        dataField='paid'
        caption='Сплачено'
        dataType='number'
        alignment='right'
        hidingPriority={1}
        width={100}
      />
    </DoclistPageTemplate>
  );
};

