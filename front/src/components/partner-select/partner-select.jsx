import {
  useCallback,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { DropDownBox } from 'devextreme-react/drop-down-box';
import { showError } from 'utils/notify';
import { DataGrid, Menu, Popup } from 'devextreme-react';
import {
  Column,
  FilterRow,
  Paging,
  Scrolling,
  Selection,
} from 'devextreme-react/data-grid';
import { PartnerPage } from 'pages';
import { uaFilterRowText } from 'app-constants';
import { dsPartners } from 'datasources';

export const PartnerBox = (props) => {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ createNewPartner, setCreateNewPartner ] = useState(false);
  const [ loadDataGrid, setLoadDataGrid ] = useState(false);
  let currentRowData = useRef().current;
  const dgrid = useRef();
  const ddbox = useRef();

  const viewButton = {
    icon: 'search',
    type: 'normal',
    onClick: () => {
      setDialogOpen(true);
    },
  };

  const selectHandler = useCallback(
    (rowData) => {
      if (props.onChange) props.onChange(rowData);
      ddbox.current.instance.close();
    },
    [ props ],
  );

  const clickMenu = (e) => {
    if (e.itemData.id === 'open') setDialogOpen(true);
    if (e.itemData.id === 'select') {
      if (currentRowData) {
        selectHandler(currentRowData);
      } else {
        showError('Не вибрано контрагента...');
      }
    }
    if (e.itemData.id === 'new') {
      setCreateNewPartner(true);
      setDialogOpen(true);
    }
    if (e.itemData.id === 'close') {
      ddbox.current.instance.close();
    }
  };

  const handlePartnerClose = () => {
    if (props.onPartnerClose) props.onPartnerClose();
    setCreateNewPartner(false);
    setDialogOpen(false);
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <DropDownBox
        {...props}
        ref={ddbox}
        width="100%"
        value={props.partner?.name}
        placeholder="контрагент ..."
        deferRendering={true}
        showClearButton={true}
        onFocusIn={() => setLoadDataGrid(true)}
        buttons={[
          'dropDown',
          'clear',
          { name: 'search', location: 'after', options: viewButton },
        ]}>
        <Menu
          onItemClick={clickMenu}
          dataSource={[
            {
              text: 'Вибрати',
              id: 'select',
              visible: props.onChange !== undefined,
            },
            {
              text: 'Відкрити',
              id: 'open',
            },
            {
              text: 'Додати',
              id: 'new',
            },
            {
              text: 'Закрити',
              id: 'close',
            },
          ]}
        />

        <DataGrid
          ref={dgrid}
          remoteOperations={true}
          dataSource={loadDataGrid ? dsPartners : null}
          onFocusedRowChanged={(e) => {
            if (e.row) currentRowData = e.row.data;
            else currentRowData = { name: '', ref: '' };
          }}
          hoverStateEnabled={true}
          focusedRowKey={props.partner?.ref}
          onRowDblClick={(e) => {
            selectHandler(e.data);
          }}
          onSelectionChanged={(e) => {
            if (e.selectedRowsData.length) {
              currentRowData = e.selectedRowsData[0];
            }
          }}
          height="90%">
          <Selection mode="single" />
          <Scrolling mode="virtual" rowRenderingMode="virtual" />
          <Paging enabled={true} pageSize={100} />
          <FilterRow visible={true} {...uaFilterRowText} />
          <Column dataField="ref" visible={false} />
          <Column
            dataField="name"
            caption="Назва"
            filterOperations={[ 'contains', 'startswith', 'endswith' ]}
          />
          <Column
            dataField="edrpou"
            caption="код ЄДРПОУ"
            filterOperations={[ 'startswith' ]}
          />
        </DataGrid>
      </DropDownBox>

      <div style={{ zIndex: '2000' }}> <Popup
        visible={dialogOpen}
        onHiding={handlePartnerClose}
        dragEnabled={true}
        closeOnOutsideClick={true}
        showTitle={true}
        title="-Контрагент-"
        width="75%">
        <PartnerPage
          partnerRef={createNewPartner ? null : props.partner?.ref}
          onPartnerSaveSuccess={(partner) => {
            selectHandler(partner);
            setCreateNewPartner(false);
            setDialogOpen(false);
          }}
          onPartnerClose={handlePartnerClose}
        />
      </Popup>
      </div>
    </div>
  );
};

PartnerBox.propTypes = {
  partner: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func,
  onPartnerClose: PropTypes.func,
};
