import {
  COLUMN_PARTNER_MINWIDTH,
  DX_DATETIME_DISPLAY_FORMAT,
  uaFilterRowText,
} from 'app-constants';
import { SearchDropdown, forwardProps } from 'components/search-dropdown';
import { dsPartners } from 'datasources';
import { DataGrid, Menu } from 'devextreme-react';
import {
  Column,
  FilterRow,
  Lookup,
  Paging,
  Scrolling,
  Selection,
} from 'devextreme-react/data-grid';
import { useSearchDatagridHandler } from 'hooks';
import PropTypes from 'prop-types';
import {
  forwardRef,
  useMemo,
  useState,
} from 'react';
import { useHistory } from 'react-router';

const OrdersDatagrid = forwardRef(({
  searchField = 'number_doc',
  ...props
}, ref) => {
  const history = useHistory();
  const onSelectionChanged = (row) => {
    props.dataSource.byKey(row.ref).then((data) => {
      props.onSelectionChanged(data);
    });
  };

  const {
    gridRef,
    focusElementRef,
    dataReady,
    onCurrentRowChange,
  } = useSearchDatagridHandler(ref, searchField, onSelectionChanged);

  const [ currentRowData, setCurrentRowData ] = useState(null);

  const clickMenu = (e) => {
    if (e.itemData.id === 'select') {
      onSelectionChanged(currentRowData);
    } else if (e.itemData.id === 'open') {
      history.push(`/order/${props?.value.ref}`);
    }
  };

  const grid = useMemo(() => <DataGrid
    ref={gridRef}
    showBorders
    remoteOperations
    dataSource={dataReady ? props.dataSource : []}
    hoverStateEnabled={true}
    onRowDblClick={(e) => {
      onSelectionChanged(e.data);
    }}
    onSelectionChanged={(e) => {
      if (e.selectedRowsData.length > 0) {
        setCurrentRowData(e.selectedRowsData[0]);
        onCurrentRowChange(e.selectedRowsData[0]);
      }
    }}
    height='90%'>
    <Selection mode='single'/>
    <Scrolling mode='virtual' rowRenderingMode='virtual' />
    <Paging enabled={true} pageSize={100} />
    <FilterRow
      visible={true}
      {...uaFilterRowText}
    />


    <Column
      dataField='number_doc'
      caption='Номер'
      dataType='string'
      alignment='center'
      allowHiding={false}
      allowResizing={false}
      width={150}
    />

    <Column
      dataField='date'
      caption='Дата'
      dataType='date'
      format={DX_DATETIME_DISPLAY_FORMAT}
      alignment='center'
      width={190}
    />

    <Column
      allowSorting={false}
      dataField='partner.ref'
      caption='Контрагент'
      dataType='string'
      alignment='left'
      allowResizing={false}
      calculateDisplayValue={(data) => data.partner?.name}
      minWidth={COLUMN_PARTNER_MINWIDTH}
    >
      <Lookup
        dataSource={dsPartners}
        allowClearing={true}
        valueExpr='ref'
        displayExpr='name'
        minSearchLength={3}
        searchTimeout={500}
      />
    </Column>
  </DataGrid>
  , [ dataReady ]);

  return (
    <div
      ref={focusElementRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    >

      <Menu
        onItemClick={clickMenu}
        activeStateEnabled={false}
        dataSource={[
          {
            text: 'Вибрати',
            id: 'select',
            icon: 'check',
            visible: !!props.onSelectionChanged,
            disabled: !currentRowData,
          },
          {
            text: 'Відкрити',
            id: 'open',
            icon: 'find',
            disabled: !props?.value.ref,
          },
        ]}
      />

      {grid}
    </div>
  );
});

OrdersDatagrid.displayName = 'OrdersDataGrid';

OrdersDatagrid.propTypes = {
  value: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
  }),
  searchField: PropTypes.string,
  onSelectionChanged: PropTypes.func,
  onPartnerClose: PropTypes.func,
  dataSource: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export const OrdersSearch = (props) => <SearchDropdown
  {...props}
  value={props.order || { ref: '', caption: '' }}
  text={props.order?.caption || ''}
  onSelect={props.onSelect}
  minSearchLength={3}
  searchTimeout={500}
  placeholder='Замовлення...'
  saveSearchValueOnLeave={true}
  calcSearchValue={() => ''}
  width={'100%'}
  popupMode='popup'
  dropdownWidth={700}
  dropdownHeight={500}
>
  <OrdersDatagrid
    dataSource={props.dataSource}
  />
</SearchDropdown>;

OrdersSearch.propTypes = {
  ...forwardProps,
  order: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
};
