import {
  DX_DATETIME_DISPLAY_FORMAT,
  uaFilterRowText,
} from 'app-constants';
import { SearchDropdown, forwardProps } from 'components/search-dropdown';
import { DataGrid, Menu } from 'devextreme-react';
import {
  Column,
  FilterRow,
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

const ReportsDatagrid = forwardRef(({
  searchField = 'name',
  ...props
}, ref) => {
  const {
    gridRef,
    focusElementRef,
    dataReady,
    onCurrentRowChange,
  } = useSearchDatagridHandler(ref, searchField, props.onSelectionChanged);

  const [ currentRowData, setCurrentRowData ] = useState(null);

  const handleMenuClick = (e) => {
    if (e.itemData.id === 'select') {
      props.onSelectionChanged(currentRowData);
    } else if (e.itemData.id === 'clear') {
      props.onSelectionChanged({});
    }
  };

  const grid = useMemo(() => <DataGrid
    ref={gridRef}
    showBorders
    remoteOperations
    dataSource={props.dataSource}
    hoverStateEnabled={true}
    onRowDblClick={(e) => {
      props.onSelectionChanged(e.data);
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
  </DataGrid>
  , [ dataReady, props.dataSource ]);

  return (
    <div
      ref={focusElementRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    >

      <Menu
        onItemClick={handleMenuClick}
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
            text: 'Очистити',
            id: 'clear',
            icon: 'close',
            disabled: !props?.value.ref,
          },
        ]}
      />

      {grid}
    </div>
  );
});

ReportsDatagrid.displayName = 'ReportsDataGrid';

ReportsDatagrid.propTypes = {
  value: PropTypes.shape({
    ref: PropTypes.string.isRequired,
  }),
  searchField: PropTypes.string,
  onSelectionChanged: PropTypes.func,
  onPartnerClose: PropTypes.func,
  dataSource: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export const ReportsSearch = (props) => <SearchDropdown
  {...props}
  value={props.report || { ref: '' }}
  text={props.report?.caption || ''}
  onSelect={props.onSelect}
  minSearchLength={1}
  searchTimeout={500}
  placeholder=''
  saveSearchValueOnLeave={true}
  calcSearchValue={() => ''}
  width='100%'
  dropdownWidth='fit-content'
  dropdownHeight={400}
  top
>
  <ReportsDatagrid
    dataSource={props.dataSource}
  />
</SearchDropdown>;

ReportsSearch.propTypes = {
  ...forwardProps,
  report: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
};
