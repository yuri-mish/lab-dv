import
React,
{
  useEffect,
  useRef,
  useState,
  Suspense,
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
import { LoadPanel } from 'devextreme-react/load-panel';
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
import styles from '../ep-main/styles/style.module.scss';
const PrintBTNadapter =
  React.lazy(() => import('../ep-main/components/print/printBTNadapter'));

export const EPPage = () => {
  const history = useHistory();
  const { user, signOut } = useAuth();
  const [ selectedRowData, setSelectedRowData ] = useState({});
  const [ pdfLoading, setPdfLoading ] = useState(false);

  const gridRef = useRef();
  const printRef = useRef();

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
        history.push(`/ep/${e?.row?.key || e?.data?.ref}`);
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
  const handlePdfLoading = (val = false) => {
    setPdfLoading(val);
  };

  return (
    <div>
      <LoadPanel
        height={100}
        width={250}
        message={'load'}
        visible={pdfLoading}
        position={'center'}
      />
      <StickyBar>
        <DocInfoBar name='Електронні протоколи'/>
        <Menu
          className={styles?.padding_0_10}
          onItemClick={(e) => {
            switch (e.itemData.id) {
            case 'new-otk': {
              history.push({ pathname: '/ep/new' });
              break;
            }
            case 'new-taho': {
              history.push({ pathname: '/ep-taho/new' });
              break;
            }
            case 'new-co2': {
              history.push({ pathname: '/ep-co2/new' });
              break;
            }
            case 'new-ekmt': {
              history.push({ pathname: '/ep-ekmt/new' });
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
            case 'print': {
              printRef?.current?.props?.onClick();
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
              items: [
                {
                  id: 'new-otk',
                  text: 'ОТК',
                },
                {
                  id: 'new-taho',
                  text: 'Тахограф',
                  // disabled: true,
                },
                {
                  id: 'new-co2',
                  text: 'CO2',
                  // disabled: true,
                },
                // {
                //   id: 'new-ekmt',
                //   text: 'EKMT',
                // },
              ],
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
            {
              id: 'print',
              icon: 'print',
              text: 'Друк',
              disabled: !selectedRowData?.number_doc ||
                !selectedRowData?.body?.type,
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
      <div hidden={true}>
        <Suspense fallback={<></>}>
          <PrintBTNadapter forwardedRef={printRef}
            data = {{ ...selectedRowData, ...selectedRowData?.body }}
            handlePdfLoading = {handlePdfLoading}
            disabled={!selectedRowData?.number_doc} />
        </Suspense>
      </div>
    </div>
  );
};
