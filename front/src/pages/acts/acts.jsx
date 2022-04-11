import { useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Column, Lookup } from 'devextreme-react/data-grid';
import { Menu } from 'devextreme-react';
import { API_HOST, COLUMN_PRICE_WIDTH } from 'app-constants';
import { dsActs } from './ds-acts';
import { dsOrdersLookup } from 'datasources';
import { openDoc } from 'utils/open-doc';
import { DoclistPageTemplate } from 'components';


export const Acts = () => {
  const [ selectedRowData, setSelectedRowData ] = useState({});
  const dgRef = useRef();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filterRef = params.get('trans_ref');

  const cellOrderRender = useCallback((cellData) => (
    cellData?.data?.trans?.ref ?
      <Link to={`/order/${cellData.data.trans.ref}`}>
        {cellData.data.trans.caption}
      </Link> :
      <> Документ недоступний </>
  ), []);

  return (
    <DoclistPageTemplate
      ref={dgRef}
      pageName='Акти'
      dataSource={dsActs}
      onSelectionChanged={(e) => {
        setSelectedRowData(e.selectedRowsData[0] || {});
      }}
      stateStoringEnabled={!filterRef}
      menuComponent={(
        <Menu
          onItemClick={(e) => {
            if (e.itemData.id === 'print') {
              openDoc(e.itemData.url);
            }
          }}
          dataSource={[
            {
              text: 'Друк',
              icon: 'print',
              disabled: !(selectedRowData.ref && selectedRowData.number_doc),
              items: [
                {
                  id: 'print',
                  text: 'Акт виконаних робіт',
                  url: `${API_HOST}/printact/${selectedRowData.ref}/act`,
                },
              ],
            },
          ]}
        />
      )}
    >
      <Column
        minWidth={370}
        allowSorting={false}
        dataField='trans.ref'
        caption='Замовлення'
        dataType='string'
        alignment='left'
        cellRender={cellOrderRender}
        filterValue={filterRef}
      >
        <Lookup
          dataSource={dsOrdersLookup}
          allowClearing={true}
          valueExpr='ref'
          displayExpr='number_doc'
          minSearchLength={3}
          searchTimeout={500}>
        </Lookup>
      </Column>

      <Column
        width={COLUMN_PRICE_WIDTH}
        allowSorting={true}
        dataField='doc_amount'
        caption='Сума'
        dataType='number'
        alignment='right'
      />
    </DoclistPageTemplate>
  );
};

