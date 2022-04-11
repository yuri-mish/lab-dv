import { useRef } from 'react';
import {
  TextBox,
  DateBox,
  TextArea,
  Form,
  ValidationGroup,
} from 'devextreme-react';
import { LoadPanel } from 'devextreme-react/load-panel';
import SelectBox from 'devextreme-react/select-box';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import DataGrid, {
  Column,
  Editing,
  Texts,
  Scrolling,
  Summary,
  TotalItem,
} from 'devextreme-react/data-grid';
import Validator, {
  RequiredRule,
} from 'devextreme-react/validator';
import {
  ColCountByScreen,
  EmptyItem,
  GroupItem,
  Label,
  SimpleItem,
} from 'devextreme-react/form';
import { useHistory } from 'react-router-dom';
import { locale } from 'devextreme/localization';
import dayjs from 'dayjs';
import { v4 as uuid_v4 } from 'uuid';
import { useApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import {
  DocMenu,
  StickyBar,
  DocInfoBar,
  PartnerSearch,
} from 'components';
import { nomsDataSource } from 'db/ds/dsNoms';
import { AutocompleteOTK } from 'components/otk/AutocompleteOTK';
import { showError } from 'utils/notify';
import { useDate, useDocCloseStatus, useDocState, usePrices } from 'hooks';
import {
  docStatuses,
  DX_DATETIME_DISPLAY_FORMAT,
  DX_DATE_DISPLAY_FORMAT,
  COLUMN_NOM_MINWIDTH,
  FORM_STYLING_MODE,
} from 'app-constants';
import {
  DOC_CLOSE_PERIOD,
  CLASS_NAME,
  MIN_PERIOD,
  priceOrderTypes,
  priceOrderTypeNameByType,
  mapDocStatusesToTypes,
} from './constants';
import { useScreenSize } from 'utils/media-query';
import {
  messages,
  docRowValidationMsg,
  docValidationMsg,
  joinBackValidationMsgs,
} from 'messages';


const getPriceOrder = loader('./getPriceOrder.graphql');
const updatePriceOrder = loader('./updatePriceOrder.graphql');

nomsDataSource.userOptions = { selectServices: true };

export const PriceOrder = () => {
  const history = useHistory();
  const gqlClient = useApolloClient();
  const { isLarge, isMedium } = useScreenSize();
  const formGroupRef = useRef();

  const { today, formatDate } = useDate();
  const { loadPrices, getPrice, findPrice } = usePrices(null, () => {
    showError(messages.PRICE_LOAD_FAILED);
    history.goBack();
  });

  const fillPrices = (data, newPrices) => ({
    ...data,
    goods: data.goods.map((row) => ({
      ...row,
      price: findPrice(newPrices, row?.nom?.ref),
    })),
  });

  const [ data, setData, { loading, isDocNew, preSave } ] = useDocState({
    className: CLASS_NAME,
    defaultData: {
      date: formatDate(),
      number_doc: null,
      partner: null,
      start_date: formatDate(today),
      expiration_date: formatDate(today.add(MIN_PERIOD, 'day')),
      status: 0,
      transactions_kind: priceOrderTypes[0],
      goods: [],
      note: '',
    },
    load: (id) => gqlClient.query({
      query: getPriceOrder,
      variables: { ref: id },
    })
      .then(async (response) => {
        const order = response?.data?.priceorder?.[0];
        if (!order.ref) {
          throw new Error();
        }
        return order;
      }),
    update: (state, data) => loadPrices(data.date)
      .then((newPrices) => fillPrices({ ...state, ...data }, newPrices)),
  });

  const isDocClosed = useDocCloseStatus(data.date, DOC_CLOSE_PERIOD);

  const [ discountReadOnly, newPriceReadOnly ] = priceOrderTypes.map(
    (type) => type !== data.transactions_kind,
  );

  const docReadOnly = isDocClosed || [
    docStatuses.AGREED.status,
    docStatuses.APPROVED.status,
  ].includes(data.status);

  const dataGridRef = useRef();

  locale('ua');

  const handleDateChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.element.id]: formatDate(e.value),
    }));
  };

  const handleDocTypeChange = (type) => {
    setData((prev) => ({
      ...prev,
      transactions_kind: type,
      goods: [],
    }));
  };

  const handleNomChange = (e, row) => {
    if (e?.ref) {
      if (data.goods.find((r) => r?.nom?.ref === e.ref)) {
        showError(messages.NOM_ALREADY_CHOOSEN);
      // eslint-disable-next-line no-negated-condition
      } else if (!getPrice(e.ref)) {
        showError(messages.NOM_NO_PRICE);
      } else {
        row.data.setValue(e.ref || '', e.name || '');
      }
    }
  };

  const calcRow = (row) => {
    const newRow = { ...row };
    const price = newRow?.price;

    if (price) {
      if (discountReadOnly && typeof row.newprice === 'number') {
        newRow.discount_percent =
          (((price - row.newprice) * 100) / price).toFixed(2);
      } else if (
        newPriceReadOnly &&
        typeof row.discount_percent === 'number'
      ) {
        newRow.newprice =
          ((1 - (row.discount_percent / 100)) * price).toFixed(2);
      }
    }

    return newRow;
  };

  const handleRowUpdating = (e) => {
    if ('newprice' in e.newData) {
      e.newData.newprice = Math.max(e.newData.newprice, 0);
    }
    if ('discount_percent' in e.newData) {
      e.newData.discount_percent = Math.min(
        Math.max(e.newData.discount_percent, 0),
        100,
      );
    }
    if ('quantity' in e.newData) {
      e.newData.quantity = Math.max(e.newData.quantity, 0);
    }
    if ('nom' in e.newData) {
      e.newData.price = getPrice(e.newData.nom.ref);
    }
    e.newData = calcRow({ ...e.oldData, ...e.newData });
    return Promise.resolve(false);
  };

  const validateForm = () => {
    formGroupRef.current.instance.validate();
    let errorMessage = '';
    if (
      dayjs(data.expiration_date) <
      dayjs(data.start_date).add(MIN_PERIOD, 'day')
    ) {
      errorMessage += docValidationMsg(messages.WRONG_DOC_DATE);
    }
    if (!data?.partner?.ref) {
      errorMessage += docValidationMsg(messages.PARTNER_REQUIRED);
    }

    const rows = data.goods;
    if (rows.length === 0) {
      errorMessage += docValidationMsg('Не вибрано жодної послуги');
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const idx = row.row;
      if (!row.nom.ref) {
        errorMessage += docRowValidationMsg('не заповнена послуга', idx);
      }
      if (!newPriceReadOnly && !row.newprice) {
        errorMessage += docRowValidationMsg('спецціна не заповнена', idx);
      }
      if (!discountReadOnly && !row.discount_percent) {
        errorMessage += docRowValidationMsg('скидка не заповнена', idx);
      }
    }

    return errorMessage;
  };

  const handleFormSave = async () => {
    const err = validateForm();
    if (err) {
      return Promise.reject(err);
    }

    const doctosave = {};
    const saveUuid = data.ref || uuid_v4();
    if (isDocNew) {
      doctosave._id = `${CLASS_NAME}|${saveUuid}`;
      doctosave.class_name = CLASS_NAME;
    } else {
      doctosave._id = data._id;
      doctosave.ref = data.ref;
    }

    doctosave.date = data.date;
    doctosave.partner = data.partner.ref;
    doctosave.transactions_kind = data.transactions_kind;
    doctosave.start_date = data.start_date;
    doctosave.expiration_date = data.expiration_date;
    doctosave.note = data.note;
    doctosave.quantity =
      dataGridRef.current.instance.getTotalSummaryValue('quantity');

    doctosave.goods = data.goods.map((row) => ({
      ...row,
      nom: row.nom.ref,
    }));

    preSave();

    const response = await gqlClient.mutate({
      mutation: updatePriceOrder,
      variables: { input: doctosave },
    });

    if (response?.errors) {
      return Promise.reject(joinBackValidationMsgs(response.errors));
    }

    return Promise.resolve(saveUuid);
  };

  const fillGoods = () => {
    const ignoredRefs = data.goods.map((row) => row?.nom?.ref);
    nomsDataSource.load()
      .then((data) => {
        const noms = data?.data
          .filter((nom) => !ignoredRefs.includes(nom.ref) &&
            getPrice(nom.ref),
          );

        setData((prev) => ({
          ...prev,
          goods: [
            ...prev.goods,
            ...noms.map((nom, index) => calcRow({
              row: prev.goods.length + index + 1,
              nom,
              price: getPrice(nom.ref),
            })),
          ],
        }));
      });
  };

  const addButtonOptions = {
    icon: 'plus',
    onClick: () => {
      setData((prev) => ({
        ...prev,
        goods: [
          ...prev.goods,
          {
            row: (prev?.goods.length || 0) + 1,
            nom: { ref: undefined, name: '' },
          },
        ],
      }));
    },
    hint: 'Додати новий рядок',
  };

  const fillButtonOptions = {
    icon: 'alignleft',
    onClick: fillGoods,
    hint: 'Додати всі номенклатури',
  };

  const nomEditCellComponent = (row) => <AutocompleteOTK
    value={row.data.text}
    searchField='name'
    keyField='ref'
    dataSource={nomsDataSource}
    dataSourceUserOptions={{ selectServices: true }}
    columns={[
      { dataField: 'name', width: '80', caption: 'Назва' },
      { dataField: 'name_full', caption: 'Повна назва' },
    ]}
    onChange={(e) => handleNomChange(e, row)}
  />;
  const Goods =
    <div>
      <Toolbar className='otk-dg-toolbar-border dx-theme-border-color'>
        <Item
          location='before'
          locateInMenu='auto'
          widget='dxButton'
          disabled={docReadOnly}
          options={addButtonOptions}
        />
        <Item
          location='before'
          locateInMenu='auto'
          widget='dxButton'
          disabled={docReadOnly}
          options={fillButtonOptions}
        />
        <Item text='Add' locateInMenu='always' visible={false} />
      </Toolbar>

      <DataGrid
        ref={dataGridRef}
        style={{ maxHeight: 400 }}
        noDataText='Список порожній'
        columnHidingEnabled
        columnAutoWidth
        remoteOperations={false}
        rowAlternationEnabled={true}
        showBorders={true}
        showColumnLines={true}
        allowColumnResizing={true}
        autoNavigateToFocusedRow
        keyExpr={'row'}
        dataSource={data.goods}
        hoverStateEnabled={true}
        errorRowEnabled={false}
        selectTextOnEditStart={true}
        onRowUpdating={handleRowUpdating}
        onRowRemoved={() => {
          setData((prev) => ({
            ...prev,
            goods: prev.goods.map((row, index) => ({
              ...row,
              row: index + 1,
            })),
          }));
        }}
        width='100%'
      >
        <Scrolling
          mode='infinite'
        />

        <Editing
          mode='cell'
          allowUpdating={!docReadOnly}
          allowDeleting={!docReadOnly}
          useIcons={true}
          confirmDelete={false}>
          <Texts confirmDeleteMessage='Вилучити?' deleteRow='вилучити' />
        </Editing>

        <Column
          dataField='nom.ref'
          caption='Номенклатура'
          showEditorAlways={!docReadOnly}
          allowHiding={false}
          calculateDisplayValue={(data) => data.nom?.name}
          editCellComponent={nomEditCellComponent}
          placeholder='...вкажіть послугу..'
          minWidth={COLUMN_NOM_MINWIDTH}
        />

        <Column
          dataField='price'
          caption='Ціна'
          allowEditing={false}
          hidingPriority={1}
          alignment='right'
          headerCellRender={() => <p style={{ textAlign: 'center' }}>
              Ціна <br /> (прайс)
          </p>
          }
        />

        <Column
          dataField='quantity'
          dataType='number'
          caption='Кількість'
          hidingPriority={3}
          allowEditing={true}
          alignment='right'
        />

        <Column
          dataField='newprice'
          dataType='number'
          caption='Спецціна'
          hidingPriority={newPriceReadOnly ? 0 : 2}
          allowEditing={!newPriceReadOnly}
          alignment='right'
        />

        <Column
          dataField='discount_percent'
          dataType='number'
          caption='%скидки'
          hidingPriority={discountReadOnly ? 0 : 2}
          allowEditing={!discountReadOnly}
          alignment='right'
        />

        <Summary>
          <TotalItem
            column='quantity'
            summaryType='sum'
            displayFormat='Всього: {0}'
          />
        </Summary>
      </DataGrid>
    </div>;
  return (
    <div>
      <StickyBar>
        <DocInfoBar
          name={'Замовленне знижки'}
          data={{
            date: data.date,
            number: data.number_doc,
          }}
          loading={loading}
          isNew={isDocNew}
        >
          {!isDocNew &&
            <div className={
              `otk-tag otk-status-${
                mapDocStatusesToTypes[data.status] || 'default'
              }`
            }>
              {Object.values(docStatuses).find(
                (value) => value.status === data.status)?.statusText
              }
            </div>
          }
        </DocInfoBar>
        <DocMenu
          isDocNew={isDocNew}
          allowSaving={!docReadOnly}
          onSave={handleFormSave}
        />

      </StickyBar>

      <LoadPanel
        visible={loading}
      />

      <ValidationGroup ref={formGroupRef}>
        <div className='content-block otk-content-block'>
          <div
            className='otk-doc-container otk-doc-form dx-card'
          >
            <Form
              labelLocation='top'
              formData={data}
            >
              <GroupItem>
                <ColCountByScreen xs={1} sm={6} md={8} lg={8} />
                <SimpleItem colSpan={2}>
                  <Label text='Номер' />
                  <TextBox
                    readOnly
                    value={data.number_doc}
                    placeholder='...номер документа...'
                    stylingMode={FORM_STYLING_MODE}
                    hint='номер документу присвоєний головним офісом'
                  />
                </SimpleItem>
                <SimpleItem colSpan={2}>
                  <Label text='Дата' />
                  <DateBox
                    readOnly
                    value={data.date}
                    id='date'
                    type='datetime'
                    stylingMode={FORM_STYLING_MODE}
                    displayFormat={DX_DATETIME_DISPLAY_FORMAT}
                    useMaskBehavior={true}
                    onValueChanged={(e) => {
                      handleDateChange(e);
                    }}
                    onValueChange={(newDate) => {
                      loadPrices(newDate)
                        .then(() => setData((prev) => fillPrices(prev)));
                    }}
                    hint='дата документу'
                  />
                </SimpleItem>
                <EmptyItem visible={isMedium || isLarge} />
                <EmptyItem visible={isMedium || isLarge} />
                <SimpleItem colSpan={2}>
                  <Label text='Тип' />
                  <SelectBox
                    readOnly={!isDocNew}
                    items={priceOrderTypes}
                    value={data.transactions_kind}
                    displayExpr={(value) => priceOrderTypeNameByType[value]}
                    onValueChange={handleDocTypeChange}
                    stylingMode={FORM_STYLING_MODE}
                    hint='тип документу'
                  />
                </SimpleItem>
              </GroupItem>

              <GroupItem>
                <ColCountByScreen xs={1} sm={4} md={8} lg={8} />
                <SimpleItem colSpan={4} isRequired>
                  <Label text='Контрагент' />
                  <PartnerSearch
                    partner={data.partner}
                    onSelect={(e) => {
                      setData((prev) => ({
                        ...prev,
                        partner: {
                          ref: e.ref || '',
                          name: e.name || '',
                        },
                      }));
                    }}
                    readOnly={docReadOnly}
                    stylingMode={FORM_STYLING_MODE}
                    validator={
                      <Validator>
                        <RequiredRule />
                      </Validator>
                    }
                  />
                </SimpleItem>
              </GroupItem>

              <GroupItem>
                <ColCountByScreen xs={1} sm={4} md={8} lg={8} />
                <SimpleItem colSpan={2}>
                  <Label text='Період с' />
                  <DateBox
                    value={data.start_date}
                    id='start_date'
                    type='date'
                    readOnly={docReadOnly}
                    displayFormat={DX_DATE_DISPLAY_FORMAT}
                    useMaskBehavior={true}
                    onValueChanged={handleDateChange}
                    stylingMode={FORM_STYLING_MODE}
                    hint='дата початку'
                    min={docReadOnly ? null : data.date}
                  />
                </SimpleItem>
                <SimpleItem colSpan={2}>
                  <Label text='Період по' />
                  <DateBox
                    value={data.expiration_date}
                    id='expiration_date'
                    type='date'
                    readOnly={docReadOnly}
                    displayFormat={DX_DATE_DISPLAY_FORMAT}
                    useMaskBehavior={true}
                    onValueChanged={handleDateChange}
                    stylingMode={FORM_STYLING_MODE}
                    hint='дата закінчення'
                    min={docReadOnly ?
                      null :
                      dayjs(data.start_date).add(MIN_PERIOD, 'day')
                    }
                  />
                </SimpleItem>
              </GroupItem>

              <SimpleItem>
                {Goods}
              </SimpleItem>

              <SimpleItem>
                <Label text='Коментар' />
                <TextArea
                  value={data.note}
                  readOnly={docReadOnly}
                  id='note'
                  height='60px'
                  stylingMode={FORM_STYLING_MODE}
                  onValueChange={
                    (value) => setData((prev) => ({ ...prev, note: value }))
                  }
                />
              </SimpleItem>
            </Form>
          </div>
        </div>
      </ValidationGroup>
    </div>
  );
};
