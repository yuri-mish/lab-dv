import {
  forwardRef,
  useMemo,
  useState,
} from 'react';
import { DataGrid, Menu } from 'devextreme-react';
import {
  Column,
  FilterRow,
  MasterDetail,
  Paging,
  Scrolling,
  Selection,
} from 'devextreme-react/data-grid';
import {
  uaFilterRowText,
} from 'app-constants';
import { SearchDropdown, forwardProps } from 'components/search-dropdown';
import { dsServicesNoms } from 'datasources';
import PropTypes from 'prop-types';
import styles from './noms-search.module.scss';
import { useSearchDatagridHandler } from 'hooks';


const NomsDatagrid = forwardRef(({
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

  const clickMenu = (e) => {
    if (e.itemData.id === 'select') {
      props.onSelectionChanged(currentRowData);
    }
  };

  const grid = useMemo(() => <DataGrid
    ref={gridRef}
    remoteOperations={true}
    showBorders
    dataSource={dataReady ? props.dataSource : []}
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
    height='90%'
    width='100%'
  >
    <Selection mode='single'/>
    <Scrolling mode='virtual' rowRenderingMode='virtual' />
    <Paging enabled={true} pageSize={100} />
    <FilterRow
      {...uaFilterRowText}
    />

    <Column
      dataField='name'
      caption='Назва'
      dataType='string'
      allowSorting={false}
      alignment='left'
      width={120}
    />

    <MasterDetail
      enabled={true}
      component={(detailProps) => <p className={styles.rowDetail}>
        {detailProps?.data?.data?.name_full}
      </p>
      }
    />

  </DataGrid>
  , [ dataReady, props.dataSource ]);

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
        ]}
      />

      {grid}
    </div>
  );
});

NomsDatagrid.displayName = 'NomsDatagrid';

NomsDatagrid.propTypes = {
  value: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  searchField: PropTypes.string,
  onSelectionChanged: PropTypes.func,
  onPartnerClose: PropTypes.func,
  dataSource: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export const NomsSearch = (props) => <SearchDropdown
  {...props}
  value={props.nom || { ref: '', name: '' }}
  text={props.nom?.name || ''}
  onSelect={props.onSelect}
  minSearchLength={1}
  searchTimeout={500}
  placeholder='Номенклатуры...'
  saveSearchValueOnLeave={true}
  calcSearchValue={() => ''}
  width={'100%'}
  dropdownWidth={300}
  dropdownHeight={400}
>
  <NomsDatagrid
    dataSource={props.dataSource || dsServicesNoms}
  />
</SearchDropdown>;

NomsSearch.propTypes = {
  ...forwardProps,
  nom: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
};
