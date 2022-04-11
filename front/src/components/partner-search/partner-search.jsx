import {
  useState,
  forwardRef,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataGrid, Menu } from 'devextreme-react';
import { SearchDropdown, forwardProps } from 'components/search-dropdown';
import {
  Column,
  FilterRow,
  Paging,
  Scrolling,
  Selection,
} from 'devextreme-react/data-grid';
import { DOCLIST_PAGE_SIZE, uaFilterRowText } from 'app-constants';
import { dsPartners } from 'datasources';
import { useSearchDatagridHandler } from 'hooks';
import { Partner } from '../partner/partner';
import styles from './partner-search.module.scss';


const PartnerDatagrid = forwardRef(({
  searchField = 'name',
  ...props
}, ref) => {
  const [ currentRowData, setCurrentRowData ] = useState(null);

  const {
    gridRef,
    focusElementRef,
    dataReady,
    onCurrentRowChange,
  } = useSearchDatagridHandler(ref, searchField, props.onSelectionChanged);

  const handleMenuClick = (e) => {
    if (e.itemData.id === 'open') {
      props.setPartnerFormState({
        visible: true,
        new: false,
        ref: currentRowData.ref,
      });
    } else if (e.itemData.id === 'select') {
      props.onSelectionChanged(currentRowData);
    } else if (e.itemData.id === 'new') {
      props.setPartnerFormState({
        visible: true,
        new: true,
        ref: null,
      });
    }
  };

  const grid = useMemo(() => <DataGrid
    ref={gridRef}
    dataSource={dataReady ? dsPartners : []}
    hoverStateEnabled
    keyExpr='ref'
    onRowDblClick={(e) => {
      props.onSelectionChanged(e.data);
    }}
    onSelectionChanged={(e) => {
      if (e.selectedRowsData.length > 0) {
        setCurrentRowData(e.selectedRowsData[0]);
        onCurrentRowChange(e.selectedRowsData[0]);
      }
    }}
    onContentReady={() => {
      gridRef.current.instance.selectRows(props.value?.ref);
    }}
    remoteOperations
    showBorders
    height='90%'
  >
    <Selection mode='single' />
    <Scrolling mode='virtual' rowRenderingMode='virtual' />
    <Paging enabled={true} pageSize={DOCLIST_PAGE_SIZE} />
    <FilterRow
      visible={true}
      {...uaFilterRowText}
    />
    <Column
      dataField='name'
      dataType='string'
      caption='Назва'
      filterOperations={[ 'contains', 'startswith', 'endswith' ]}
      allowSorting={false}
    />
    <Column
      dataField='edrpou'
      dataType='string'
      alignment='left'
      caption='Код ЄДРПОУ'
      width={130}
      filterOperations={[ 'startswith' ]}
      allowSorting={false}
    />
    <Column
      dataField='phones'
      dataType='string'
      alignment='left'
      caption='Телефон'
      filterOperations={[ 'contains' ]}
      allowSorting={false}
    />
  </DataGrid>
  , [ dataReady, props.value.ref ]);

  return (
    <div ref={focusElementRef} className={styles.container}>
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
            text: 'Відкрити',
            id: 'open',
            icon: 'edit',
            disabled: !currentRowData,
          },
          {
            text: 'Додати контрагента',
            id: 'new',
            icon: 'add',
          },
        ]}
      />

      {grid}
    </div>
  );
});

PartnerDatagrid.displayName = 'PartnerDatagrid';

PartnerDatagrid.propTypes = {
  value: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  searchField: PropTypes.string,
  onSelectionChanged: PropTypes.func,
  setPartnerFormState: PropTypes.func.isRequired,
};


export const PartnerSearch = (props) => {
  const [ partnerFormState, setPartnerFormState ] = useState({
    visible: false,
    new: false,
    ref: null,
  });

  const handlePartnerClose = () => {
    setPartnerFormState((prev) => ({
      ...prev,
      visible: false,
    }));
    props.onPartnerClose?.();
  };


  const handleEdit = (value) => {
    setPartnerFormState({ visible: true, new: false, ref: value.ref });
  };

  const handleSelect = (value) => {
    props.onSelect(value);
    setPartnerFormState((prev) => ({ ...prev, ref: value?.ref }));
  };

  const handleSave = (partner) => {
    if (partnerFormState.new) {
      handleSelect(partner);
    } else {
      setPartnerFormState((prev) => ({ ...prev, visible: false }));
    }
  };

  const popup = useMemo(() => (
    <Partner
      visible={partnerFormState.visible}
      newPartner={partnerFormState.new}
      partnerRef={partnerFormState.ref}
      onSave={handleSave}
      onClose={handlePartnerClose}
    />
  ), [ partnerFormState ]);

  return (
    <>
      <SearchDropdown
        {...props}
        value={props.partner || { ref: '', name: '' }}
        text={props.partner?.name || ''}
        onSelect={handleSelect}
        onEdit={handleEdit}
        minSearchLength={3}
        searchTimeout={500}
        placeholder='контрагент...'
        saveSearchValueOnLeave={true}
        width='100%'
        popupMode='popup'
        dropdownWidth={700}
        dropdownHeight={500}
      >
        <PartnerDatagrid
          searchField='name'
          setPartnerFormState={setPartnerFormState}
        />
      </SearchDropdown>

      {popup}
    </>
  );
};

PartnerSearch.propTypes = {
  ...forwardProps,
  partner: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
  onPartnerClose: PropTypes.func,
};

