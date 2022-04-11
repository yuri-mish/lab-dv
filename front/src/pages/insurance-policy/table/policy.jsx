import
React,
{
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from 'contexts/auth';
import DataGrid, {
  Selection,
  Paging,
  FilterRow,
  Scrolling,
  Column,
  Lookup,
  Button as CButton,
  StateStoring,
} from 'devextreme-react/data-grid';
import { Menu } from 'devextreme-react/menu';
// import { LoadPanel } from 'devextreme-react/load-panel';
import { useHistory } from 'react-router-dom';

import {
  COLUMN_DATE_WIDTH,
  COLUMN_DOCNUMBER_WIDTH,
  COLUMN_EDIT_WIDTH,
  COLUMN_PARTNER_MINWIDTH,
  COLUMN_EP_TYPE,
  COLUMN_EP_VIN,
  COLUMN_EP_CAR_NUMBER,
  uaFilterRowText,
} from 'app-constants';
import { partnerDataSource } from 'db/ds/dsPartners';

import { useSubscription, gql } from '@apollo/client';
import { dsEPOTK } from './dsEPOTK';
import { DocInfoBar, StickyBar } from 'components';
import styles from '../styles/style.module.scss';


export const PolicyPage = () => {
  const history = useHistory();
  const { user, signOut } = useAuth();
  const [ selectedRowData, setSelectedRowData ] = useState({});
  // const [ pdfLoading, setPdfLoading ] = useState(false);
  console.log('selectedRowData', selectedRowData);
  const gridRef = useRef();

  const sq = gql(
    `subscription {
      docChange(
        input: { username:"${user?.email ?? ''}" },
        class_name:"doc.ep"
      )
    }`,
  );

  const { data: docChange, loading: loadingDocChange } = useSubscription(sq);

  useEffect(() => {
    if (!loadingDocChange) {
      gridRef.current.instance.refresh(true);
    }
  }, [ docChange, loadingDocChange ]);

  useEffect(() => {
    dsEPOTK.on('loaded', (result) => {
      if (result?.errors) {
        signOut();
      }
    });
  }, []);

  const handleEditIconClick = (e) => {
    if (e?.row || e?.data) {
      switch (e?.row?.values[4] || e?.data?.body?.type) {
      case 'ОТК':
        history.push(`/policy/${e?.row?.key || e?.data?.ref}`);
        break;
      case 'Taho':
        history.push(`/ep-taho/${e?.row?.key || e?.data?.ref}`);
        break;
      case 'CO2':
        history.push(`/ep-co2/${e?.row?.key || e?.data?.ref}`);
        break;
      default:
        history.push(`/ep/${e?.row?.key || e?.data?.ref}`);
        break;
      }
    }
  };

  return (
    <div>
      {/* <LoadPanel
        height={100}
        width={250}
        message={'load'}
        visible={pdfLoading}
        position={'center'}
      /> */}
      <StickyBar>
        <DocInfoBar name='Продаж Страхового Полісу'/>
        <Menu
          className={styles?.padding_0_10}
          onItemClick={(e) => {
            switch (e.itemData.id) {
            case 'new': {
              history.push({ pathname: '/policy-new' });
              break;
            }
            case 'close': {
              history.push({ pathname: '/home' });
              break;
            }
            case 'clear': {
              gridRef.current.instance.clearFilter();
              break;
            }
            default:
              break;
            }
          }}
          dataSource={[
            {
              icon: 'add',
              text: 'Додати',
              id: 'new',
            },
            {
              id: 'close',
              icon: 'close',
              text: 'Закрити',
            },
            {
              id: 'clear',
              icon: 'clearformat',
              text: 'Зняти всі фільтри',
            },
          ]}
        />
      </StickyBar>
      <DataGrid
        ref={gridRef}
        id="gridContainer"
        className={styles?.ep_data_grid}
        highlightChanges={true}
        dataSource={dsEPOTK}
        allowColumnReordering={true}
        allowColumnResizing={true}
        showBorders={true}
        allowSorting={true}
        remoteOperations={true}
        onRowDblClick={handleEditIconClick}
        onSelectionChanged={(e) => {
          setSelectedRowData(e.selectedRowsData[0] || {});
        }}
      >
        <StateStoring enabled type="localStorage" storageKey="ep" />
        <Selection mode="single" />
        <Scrolling mode="virtual" rowRenderingMode="virtual" />
        <Paging pageSize={100} />
        <FilterRow visible={true} {...uaFilterRowText} />

        <Column type="buttons" width={COLUMN_EDIT_WIDTH}>
          <CButton name="_edit" icon="edit" onClick={handleEditIconClick} />
        </Column>

        <Column
          dataField="number_doc"
          caption="Номер"
          dataType="string"
          alignment="center"
          width={COLUMN_DOCNUMBER_WIDTH}
        />
        <Column
          dataField="date"
          caption="Дата"
          dataType="date"
          format="dd.MM.yyyy HH:mm:ss"
          alignment="center"
          width={COLUMN_DATE_WIDTH}
        />
        <Column
          allowSorting={false}
          dataField="partner.ref"
          caption="Контрагент"
          dataType="string"
          alignment="left"
          calculateDisplayValue={(data) => data.partner?.name}
          minWidth={COLUMN_PARTNER_MINWIDTH}
        >
          <Lookup
            dataSource={partnerDataSource}
            allowClearing={true}
            valueExpr="ref"
            displayExpr="name"
            minSearchLength={3}
            searchTimeout={500}
          />
        </Column>
        <Column
          dataField="body.type"
          caption="Тип"
          dataType="string"
          alignment="left"
          width={COLUMN_EP_TYPE}
        />
        <Column
          dataField="body.order.number_doc"
          caption="№ Замовлення"
          dataType="string"
          alignment="left"
          width={COLUMN_DOCNUMBER_WIDTH}
        />
        <Column
          dataField="body.vin"
          caption="VIN Кузова"
          dataType="string"
          alignment="left"
          minWidth={COLUMN_EP_VIN}
        />
        <Column
          dataField="body.car_number"
          caption="Держ. номер"
          dataType="string"
          alignment="left"
          minWidth={COLUMN_EP_CAR_NUMBER}
        />
      </DataGrid>
    </div>
  );
};
