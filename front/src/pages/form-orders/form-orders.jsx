import { useRef, useState } from 'react';
import {
  Column,
} from 'devextreme-react/data-grid';
import { Menu } from 'devextreme-react';

import { useHistory } from 'react-router-dom';

import {
  API_HOST, COLUMN_PRICE_WIDTH,
} from 'app-constants';

import { dsBlanksOrders } from './ds-blanks-orders';
import { openDoc } from 'utils/open-doc';
import { DoclistPageTemplate } from 'components';
import { useDocChangeListener } from 'hooks';


export const FormOrders = () => {
  const [ selectedRowData, setSelectedRowData ] = useState({});
  const history = useHistory();
  const gridRef = useRef();
  useDocChangeListener('doc.blankorder', () => {
    gridRef.current.instance.refresh(true);
  });

  return (
    <DoclistPageTemplate
      ref={gridRef}
      pageName='Замовлення бланкiв'
      onEdit={(ref) => history.push(`/form_order/${ref}`)}
      dataSource={dsBlanksOrders}
      onSelectionChanged={(e) => {
        setSelectedRowData(e.selectedRowsData[0] || {});
      }}
      menuComponent={(
        <Menu
          onItemClick={(e) => {
            switch (e.itemData.id) {
            case 'new': {
              history.push('/form_order/new');
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
              disabled: !selectedRowData?.trust_doc,
              items: [
                {
                  id: 'print',
                  text: 'Довiренiсть',
                  url: `${API_HOST}/printform/${selectedRowData.trust_doc}/trs`,
                  disabled: !selectedRowData?.trust_doc,
                },
              ],
            },
          ]}
        />

      )}
    >
      <Column
        dataField='doc_amount'
        caption='Сума'
        dataType='number'
        alignment='right'
        width={COLUMN_PRICE_WIDTH}
      />
    </DoclistPageTemplate>
  );
};
