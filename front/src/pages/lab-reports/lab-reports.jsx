import { useRef } from 'react';
import { Column, Lookup } from 'devextreme-react/data-grid';
import { useHistory, useLocation } from 'react-router-dom';
import { COLUMN_PRICE_WIDTH, diiaStatuses } from 'app-constants';
import { mapDiiaStatusesToTypes } from './constants';
import {
  useDocChangeListener,
  useFirstLoginedView,
  useMessageVars,
} from 'hooks';
import { DoclistPageTemplate, statusCellRender } from 'components';
import { dsLabReports } from './datasources';

export const LabReports = () => {
  const history = useHistory();
  const gridRef = useRef();
  const location = useLocation();

  useDocChangeListener('doc.lab_report', () => {
    gridRef.current.instance.refresh(true);
  });

  const [ numErrors ] = useMessageVars([ 'reportsWithErrorCount' ]);
  const isFirstView = useFirstLoginedView(location.pathname);
  const showErrors = isFirstView && numErrors;

  return (
    <DoclistPageTemplate
      ref={gridRef}
      pageName='Звіти лабораторії'
      onEdit={(ref) => history.push(`/lab_report/${ref}`)}
      dataSource={dsLabReports}
      stateStoring={!showErrors}
      onRowPrepared={(e) => {
        if (e.data?.has_error && e.rowType === 'data') {
          e.rowElement.classList.add('otk-row-status-error');
        }
      }}
      headerBarComponent={numErrors ?
        <div className={'otk-tag otk-status-error'}>
          <div className='dx-icon-warning'/>
          &nbsp;Звіти з помилками: {numErrors}
        </div> : null
      }
    >
      <Column
        cssClass='otk-cell-no-padding'
        allowSorting={true}
        dataField='has_error'
        caption='Є помилки'
        dataType='boolean'
        cellComponent={(e) => (e.data.value ?
          <div className='dx-icon-warning otk-error otk-font-20' /> :
          null
        )}
        filterValue={showErrors ? true : null}
        alignment='center'
        width={90}
      />

      <Column
        allowSorting={true}
        dataField='service.name'
        caption='Послуга'
        dataType='string'
        alignment='center'
        hidingPriority={3}
        width={100}
      />

      <Column
        visible={false}
        cssClass='otk-cell-no-padding'
        dataField='status'
        dataType='string'
        caption='Статус Дія'
        alignment='center'
        width={130}
        cellRender={(data) => statusCellRender(data, mapDiiaStatusesToTypes)}
      >
        <Lookup
          dataSource={Object.values(diiaStatuses)}
          valueExpr='status'
          displayExpr='statusText'
          allowClearing={true}
        />
      </Column>

      <Column
        allowSorting={true}
        dataField='amount'
        caption='Сума'
        dataType='number'
        alignment='right'
        width={COLUMN_PRICE_WIDTH}
        hidingPriority={1}
      />
    </DoclistPageTemplate>
  );
};

