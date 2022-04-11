import React, { useMemo, useRef, useEffect } from 'react';
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
import { Menu } from 'devextreme-react';
import { confirm } from 'devextreme/ui/dialog';
import { useLocation, useHistory } from 'react-router-dom';
import {
  COLUMN_DATE_WIDTH,
  COLUMN_DOCNUMBER_WIDTH,
  COLUMN_EDIT_WIDTH,
  COLUMN_PARTNER_MINWIDTH,
  COLUMN_PARTNER_WIDTH,
  uaFilterRowText,
  DX_DATETIME_DISPLAY_FORMAT,
  DOCLIST_PAGE_SIZE,
  DX_DATE_SERIALIZATION_FORMAT,
} from 'app-constants';
import { StickyBar } from 'components/sticky-bar/sticky-bar';
import PropTypes from 'prop-types';
import styles from './doclist-page-template.module.scss';
import { useScreenSize } from 'utils/media-query';
import { messages } from 'messages';
import { showError } from 'utils/notify';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { dsPartners } from 'datasources';

const defaultColumnsDataFields = {
  date: 'date',
  docNumber: 'number_doc',
  partner: 'partner',
  note: 'note',
};

const exportConfirmText = (totalCount) => (
  `Щоб зменшити кількість записів використовуйте фільтри.
  Будуть збережені тільки перші ${DOCLIST_PAGE_SIZE} з ${totalCount} записів`
);

export const DoclistPageTemplate = React.forwardRef(({
  stateStoringEnabled = true,
  deps = [],
  ...props
}, ref) => {
  const { isLarge } = useScreenSize();
  const location = useLocation();
  const history = useHistory();
  const columnsDataFields = props.columnsDataFields || defaultColumnsDataFields;
  const gridRef = useRef(ref);

  useEffect(() => {
    if (ref?.current) {
      ref.current = gridRef.current;
    }
  }, [ ref ]);

  const handleExport = async () => {
    const instance = gridRef.current.instance;
    const totalCount = instance.totalCount();

    (totalCount > DOCLIST_PAGE_SIZE ?
      confirm(exportConfirmText(totalCount), 'Багато записів') :
      Promise.resolve(true)
    ).then(async (confirmExport) => {
      if (confirmExport) {
        const { Workbook } = await import('exceljs');
        const { default: saveAs } = await import('file-saver');
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(props.pageName);
        exportDataGrid({
          component: instance,
          worksheet,
        }).then(() => {
          workbook.xlsx.writeBuffer()
            .then((buffer) => saveAs(
              new Blob([ buffer ], { type: 'application/octet-stream' }),
              `${props.pageName}.xlsx`,
            ));
        });
      }
    });
  };

  const Grid = useMemo(() => (
    <DataGrid
      ref={(grid) => {
        gridRef.current = grid;
        if (ref) {
          ref.current = grid;
        }
      }}
      id={location.pathname}
      className='otk-datagrid-fullpage'
      dataSource={props.dataSource}
      onDataErrorOccurred={() => {
        showError(messages.DATA_LOAD_FAILED);
        setTimeout(() => history.push('/home'), 5000);
      }}
      onRowDblClick={(e) => {
        if (e?.data?.ref) {
          props?.onEdit(e.data.ref);
        }
      }}
      columnResizingMode='nextColumn'
      dateSerializationFormat={DX_DATE_SERIALIZATION_FORMAT}
      highlightChanges
      allowColumnReordering
      allowColumnResizing
      showBorders
      allowSorting
      remoteOperations
      columnAutoWidth
      customizeColumns={(columns) => {
        if (isLarge) {
          columns.forEach((column) => {
            column.hidingPriority = undefined;
          });
        }
      }}
      {...props}
    >
      <StateStoring
        enabled={stateStoringEnabled}
        type='localStorage'
        storageKey={location.pathname}
      />
      <Selection mode='single' />
      <Scrolling mode='virtual' rowRenderingMode='virtual' />
      <Paging pageSize={DOCLIST_PAGE_SIZE} />
      <FilterRow visible={true} {...uaFilterRowText} />

      {!!props?.onEdit &&
        <Column
          type='buttons'
          width={COLUMN_EDIT_WIDTH}
          allowResizing={false}
        >
          <CButton
            name='_edit'
            icon='edit'
            onClick={(e) => {
              if (e?.row?.key) {
                props.onEdit(e.row.key);
              }
            }}
          />
        </Column>
      }

      {'docNumber' in columnsDataFields &&
        <Column
          dataField={columnsDataFields.docNumber}
          caption='Номер'
          dataType='string'
          alignment='center'
          allowHiding={false}
          allowResizing={false}
          width={COLUMN_DOCNUMBER_WIDTH}
        />
      }
      {'date' in columnsDataFields &&
        <Column
          dataField={columnsDataFields.date}
          caption='Дата'
          dataType='date'
          format={DX_DATETIME_DISPLAY_FORMAT}
          alignment='center'
          width={COLUMN_DATE_WIDTH}
        />
      }
      {'partner' in columnsDataFields &&
        <Column
          allowSorting={false}
          dataField={`${columnsDataFields.partner}.ref`}
          caption='Контрагент'
          dataType='string'
          alignment='left'
          allowResizing={false}
          calculateDisplayValue={(data) => data.partner?.name}
          width={COLUMN_PARTNER_WIDTH}
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
      }

      {props.children}

      {'note' in columnsDataFields &&
        <Column
          allowSorting={false}
          dataField={columnsDataFields.note}
          dataType='string'
          caption='Коментар'
          alignment='left'
          hidingPriority={0}
        />
      }
    </DataGrid>
  ), [ isLarge, ...deps ]);

  return (
    <div>
      <StickyBar>
        <div className='otk-info-bar'>
          {props.pageName}
          <div className={styles.headerBarContainer}>
            {props.headerBarComponent}
          </div>
        </div>
        <div className={styles.menu}>
          {props.menuComponent}

          <Menu
            onItemClick={(e) => {
              if (e.itemData.id === 'filter') {
                gridRef.current.instance.clearFilter();
              } else if (e.itemData.id === 'export') {
                handleExport();
              }
            }}
            dataSource={[
              {
                id: 'filter',
                text: 'Зняти всі фільтри',
                icon: 'clearformat',
              },
              {
                id: 'export',
                text: 'Зберегти в Excel',
                icon: 'export',
              },
            ]}
          />

          {props.optionsComponent}
        </div>
      </StickyBar>

      {Grid}
    </div>
  );
});

DoclistPageTemplate.displayName = 'DoclistPageTemplate';
DoclistPageTemplate.propTypes = {
  ...DataGrid.propTypes,
  pageName: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  columnsDataFields: PropTypes.shape({
    date: PropTypes.string,
    docNumber: PropTypes.string,
    partner: PropTypes.string,
    note: PropTypes.string,
  }),
  stateStoringEnabled: PropTypes.bool,
  menuComponent: PropTypes.node,
  headerBarComponent: PropTypes.node,
  optionsComponent: PropTypes.node,
  deps: PropTypes.array,
};
