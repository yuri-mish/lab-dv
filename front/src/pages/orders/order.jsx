import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DocInfoBar,
  DocMenu,
  PartnerSearch,
  StickyBar,
  PartnerInfoPanel,
  PaymentForm,
  CopyButton,
} from 'components';
import {
  SelectBox,
  CheckBox,
  Form,
  LoadPanel,
  TextArea,
  ValidationGroup,
  TextBox,
  Button,
} from 'devextreme-react';
import Validator, {
  RequiredRule,
} from 'devextreme-react/validator';
import {
  ColCountByScreen,
  GroupItem,
  Label,
  SimpleItem,
} from 'devextreme-react/form';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import DataGrid, {
  Column,
  Editing,
  Texts,
  Lookup,
  Summary,
  TotalItem,
} from 'devextreme-react/data-grid';
import { locale } from 'devextreme/localization';
import { v4 as uuid_v4 } from 'uuid';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { nomsDataSource } from 'db/ds/dsNoms';
import { showError } from 'utils/notify';
import { EpSimpleBtn } from 'components/otk/epSimpleBtn';
import {
  API_HOST,
  DEFAULT_PROJ_PNAME,
  FORM_STYLING_MODE,
  DATE_DISPLAY_FORMAT,
} from 'app-constants';
import { AutocompleteOTK } from 'components/otk/AutocompleteOTK';
import { useAuth } from 'contexts/auth';
import {
  useDate,
  useDocCloseStatus,
  useDocState,
  useLab,
  useMessageHandler,
  useMessageVars,
  usePayKinds,
  usePrices,
  useProj,
} from 'hooks';
import {
  docRowValidationMsg,
  docValidationMsg,
  joinBackValidationMsgs,
  messages,
} from 'messages';
import { loader } from 'graphql.macro';
import { gqlClient } from 'gql-client';
import styles from './order.module.scss';
import { dsProjNoms } from 'datasources';
import { custom } from 'devextreme/ui/dialog';
import { normalizeCarNumber } from 'utils/normalize-car-number';
import { useScreenSize } from 'utils/media-query';
import { docStatuses } from './constants';

const getOrder = loader('./gql/getOrder.gql');
const checkContract = loader('./gql/checkContracts.gql');
const updateBuyersOrder = loader('./gql/updateBuyersOrder.graphql');

const _ = require('lodash');
const CLASS_NAME = 'doc.buyers_order';
const DOC_CLOSE_PERIOD = 0;

const F5_KEY = 116;
const DEFAULT_SERVICES = [ { nom: { ref: '', name: '' }, row: 1, price: 0 } ];
const DEFAULT_PAYMENT_TYPE_ID = '000000002';
const ONLINE_PAYMENT_TYPE_ID = '000000004';

const calculateStatus = (data) => {
  if (!data?.number_doc) {
    return docStatuses.NEW;
  } else if (data.shipped >= data.doc_amount) {
    return docStatuses.COMPLETED;
  } else if (data.paid >= data.doc_amount) {
    return docStatuses.PAID;
  }

  return docStatuses.ACCEPTED;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const Order = () => {
  const [ showPaymentForm, setShowPaymentForm ] = useState(false);
  const screenSize = useScreenSize();
  const formGroupRef = useRef();
  const partnerInfoPanelRef = useRef();
  const { id } = useParams();
  const { user } = useAuth();
  const { lab } = useLab();

  const { proj } = useProj();

  const { payKinds } = usePayKinds();
  const onlinePayKind = useMemo(() => (payKinds?.find(
    (pk) => pk.id === ONLINE_PAYMENT_TYPE_ID,
  )), [ payKinds ]);

  const { formatDate } = useDate();

  const [ newOrders ] = useMessageVars([ 'newOrdersList' ]);
  const msgHandler = useMessageHandler();

  useEffect(() => {
    const msg = newOrders.find((msg) => msg.ref === id);
    if (msg) {
      msgHandler.removeById([ msg.id ]);
    }
  }, [ id ]);

  const { loadPrices, findPrice, getPrice } = usePrices(null, () => {
    showError(messages.PRICE_LOAD_FAILED);
    history.goBack();
  });

  const reCalc = (services, newPrices) => {
    services.forEach((r) => {
      r.price = findPrice(newPrices, r.nom.ref);
      const calcPrice = Math.round(r.amount / r.quantity, -2);
      r.nats = 0;
      if (calcPrice > r.price) r.nats = calcPrice - r.price;
      if (calcPrice < r.price && r.discount_percent_automatic === 0) {
        r.spec = calcPrice;
      }
    });
  };

  const [ data, setData, { loading, isDocNew, preSave } ] = useDocState({
    className: CLASS_NAME,
    defaultData: {
      date: formatDate(),
      number_doc: '',
      class_name: CLASS_NAME,
      partner: { ref: '', name: '', isCorporate: false },
      services: DEFAULT_SERVICES,
      vat_included: true,
      doc_currency: '',
      useAddPrice: false,
      protected: false,
      pay_kind: null,
    },
    load: (id) => gqlClient
      .query({
        query: getOrder,
        variables: { ref: id },
      })
      .then((response) => {
        const order = response?.data?.order?.[0];
        if (!order.ref) {
          throw new Error();
        }
        order.partner.isCorporate = !!order?.partner?.isCorporate;
        return order;
      }),
    update: (state, data) => {
      if (data?.isSubContract) {
        // eslint-disable-next-line no-use-before-define
        checkSubContract(data?.partner.ref);
        return { ...state, ...data };
      }
      return loadPrices(
        data.date,
        data.useAddPrice,
        data?.price_type,
      )
        .then((newPrices) => {
          reCalc(data?.services || state.services, newPrices);
          return { ...state, ...data };
        });
    },
  });

  const status = calculateStatus(data);

  const isDocClosed = useDocCloseStatus(data.date, DOC_CLOSE_PERIOD);
  const docReadOnly = data.protected || isDocClosed;

  const availablePayMethods = useMemo(() => (
    _.chain(lab?.pay_systems?.filter((ps) => ps.proj === data.proj))
      .map('resource').uniq().value() ?? []
  ), [ lab, data.proj ]);

  const labProjs = lab?.projs?.map((p) => p.direction);
  const availableProjs = isDocNew ?
    proj?.filter((p) => labProjs?.includes(p.ref)) :
    proj;

  const serviceListStr = data.services
    .map((service) => service.nom.name)
    .join(', ');

  const paymentEnabled = data.doc_amount &&
    data.organization?.ref &&
    status === docStatuses.ACCEPTED &&
    availablePayMethods.length > 0;

  const paymentData = (
    data.number_doc ? {
      amount: data?.doc_amount ?? 0,
      description:
        `Oплата за послуги згідно рахунку ${data.number_doc} у т.ч. ПДВ`,
      id: data.number_doc,
      data: {
        _id: data._id,
      },
      proj: data.proj,
      organization: data.organization?.ref,
    } : null
  );

  const servicesDataGridRef = useRef();
  const focusedRowKey = useRef(null);

  const getCloseDate = () => dayjs().startOf('day');

  const copyFocusedRow = () => {
    if (focusedRowKey.current === null) {
      showError(messages.ROW_NOT_SELECTED);
      return;
    }
    setData((prev) => {
      const arr = prev.services.slice();
      const service = arr.filter((s) => s.row === focusedRowKey.current)[0];
      if (service) {
        arr.push({
          ..._.cloneDeep(service),
          row: prev.services.length + 1,
        });
      }
      return {
        ...prev,
        services: arr,
      };
    });
  };

  useEffect(() => {
    nomsDataSource.userOptions.selectServices = true;

    const handleF5 = (e) => {
      if (e.keyCode === F5_KEY) {
        e.preventDefault();
        copyFocusedRow();
      }
    };
    document.addEventListener('keydown', handleF5);

    return () => {
      document.removeEventListener('keydown', handleF5);
    };
  }, []);

  useEffect(() => {
    if (availableProjs) {
      setData((prev) => ({
        ...prev,
        proj: (
          availableProjs?.find(
            (p) => p.predefined_name === DEFAULT_PROJ_PNAME,
          ) ?? availableProjs?.[0]
        )?.ref,
      }));
    }
  }, [ proj, lab ]);

  useEffect(() => {
    if (payKinds) {
      setData((prev) => ({
        ...prev,
        pay_kind: (
          payKinds?.find((pk) => pk.id === DEFAULT_PAYMENT_TYPE_ID) ??
          payKinds?.[0]
        )?.ref ?? null,
      }));
    }
  }, [ payKinds ]);

  locale('ua');

  const calcRow = (row) => {
    const newRow = { ...row };
    if (!newRow.quantity) newRow.quantity = 1;
    const pr = newRow.spec ?
      newRow.spec :
      newRow.price + Number(newRow.nats || 0);
    newRow.amount = pr * newRow.quantity;
    if (isNaN(newRow.amount)) newRow.amount = 0;
    if (newRow.vat_rate === 'НДС20') {
      newRow.vat_amount = Math.round(newRow.amount / 6, -2);
    } else {
      newRow.vat_amount = 0;
    }

    return newRow;
  };

  const updateRow = (row) => {
    const newRow = { ...row };
    setData((prev) => ({
      ...prev,
      services: prev.services.map(
        (r) => (r.row === newRow.row ? calcRow(newRow) : r
        ),
      ),
    }));
  };

  const updatePrices = (date, useAddPrice, price_type) => {
    loadPrices(date,
      useAddPrice,
      price_type ?? data?.price_type,
    )
      .then((newPrices) => {
        data.services.forEach((row) => {
          if (row?.nom?.ref) {
            row.price = findPrice(newPrices, row.nom.ref);
            updateRow(row);
          }
        });
      });
  };

  const updateRowOnNomChange = async (row) => {
    row.price = getPrice(row.nom.ref);
    const res = await nomsDataSource.byKey(row.nom.ref);
    if (res) {
      row.content = res.name_full;
      if (res.vat_rate) row.vat_rate = res.vat_rate;
    }
    row.amount = 0;
    updateRow(row);
  };

  const handleRowUpdating = (e) => {
    if ('quantity' in e.newData) {
      e.newData.quantity = Math.max(1, e.newData.quantity);
    }
    if ('nats' in e.newData) {
      e.newData.nats = Math.max(0, e.newData.nats);
    }
    e.newData = calcRow({ ...e.oldData, ...e.newData });
    return Promise.resolve(false);
  };

  const addButtonOptions = {
    icon: 'plus',
    onClick: () => {
      const st = data.services.slice();
      st.push({
        row: data.services.length + 1,
        nom: { ref: undefined, name: '' },
        nats: 0,
      });
      setData((prevState) => ({ ...prevState, services: st }));
    },
    hint: 'Додати новий рядок',
  };

  const copyButtonOptions = {
    icon: 'copy',
    onClick: copyFocusedRow,
    hint: 'Копіювати виділений рядок',
  };

  const cellTemplate = (r) => (
    <AutocompleteOTK
      value={r.data.text}
      searchField='name'
      keyField='ref'
      dataSource={dsProjNoms(data.proj)}
      dataSourceUserOptions={{ selectServices: true }}
      columns={[
        { dataField: 'name', width: '80', caption: 'Назва' },
        { dataField: 'name_full', caption: 'Повна назва' },
      ]}
      onChange={(e) => {
        if (e && r.data?.data) {
          updateRowOnNomChange({
            ...r.data.data,
            nom: { ref: e?.ref || '', name: e?.name || '' },
          });
        }
      }}
    />
  );

  const checkGosCode = async (gos_code) => {
    let retValue = false;
    const response = await gqlClient.query({
      query: checkContract,
      variables: {
        partner: data.partner.ref,
        date: data.date,
        gos_code,
      },
    });
    retValue = response?.data?.checkContract;
    return retValue;
  };

  const checkSubContract = async (partnerRef) => {
    gqlClient.query({
      query: checkContract,
      variables: {
        partner: partnerRef,
        date: data.date,
      },
    }).then((response) => {
      if (response?.data?.checkContract) {
        const myDialog = custom({
          title: 'Знайдено Генральну угоду.',
          messageHtml: `
              <p style="text-align:center;">
              <b>За умовами Генеральної угоди ви виконуєте роботи <br/>
              по субпідряду для вказаного контрагента.<br/> 
              Внесення номеру автомобіля в замовленні є Обов'язковим.<br/>
              <p style="text-align:center;color:red;"> У звіті лабораторії 
              вказувати суми як у замовленні!!! </p>
              </b>`,
          buttons: [
            {
              text: 'Продовжити',
              onClick: () => 1,
            },
            {
              disabled: true,
              text: 'Без використання субпідряду',
              onClick: () => 2,
            },
          // ...
          ],
        });
        myDialog.show().then((dialogResult) => {
          const isSubContract = dialogResult === 1;
          if (isSubContract) {

            setData((prev) => ({
              ...prev,
              contract:
                response?.data?.checkContract.cont,
              isSubContract,
              price_type:
                response?.data?.checkContract.cont.price_type,
            }));
            updatePrices(
              data.date,
              data.useAddPrice,
              response?.data?.checkContract.contb.price_type);
          }
        });
      }
    });
  };


  const changeReq = (e) => {
    setData((prevState) => ({
      ...prevState,
      [e.element.id]: e.event?.target?.value,
    }));
  };

  const validateForm = () => {
    formGroupRef.current.instance.validate();
    let errorMessage = '';
    if (dayjs(data.date) < getCloseDate()) {
      errorMessage += docValidationMsg('Дата документу недозволена');
    }

    if (!data.partner || !data.partner.ref) {
      errorMessage += docValidationMsg(messages.PARTNER_REQUIRED);
    }
    if (data.services.length === 0) {
      errorMessage += docValidationMsg('Таблична частина порожня');
    }

    data.services.forEach((r) => {
      if (!r.nom || !r.nom.ref) {
        errorMessage += docRowValidationMsg(messages.NOM_IS_EMPTY, r.row);
      }
      if (!r.price) {
        errorMessage += docRowValidationMsg(messages.NOM_NO_PRICE, r.row);
      }
      if (r.quantity < 1) {
        errorMessage += docRowValidationMsg('Невірна кількість', r.row);
      }
      if (r.nats > 0.5 * r.price) {
        errorMessage += docRowValidationMsg('Націнка більше 50% цiни', r.row);
      }
      if (data.isSubContract && !r.gos_code) {
        errorMessage += docRowValidationMsg(
          `Номер автомобіля обов'язковий`,
          r.row,
        );
      }
    });
    return errorMessage;
  };

  const handleDocumentSave = async () => {
    const err = validateForm();
    if (err) {
      return Promise.reject(err);
    }
    const doctosave = _.cloneDeep(data);
    const saveUuid = uuid_v4();
    if (isDocNew) {
      doctosave._id = `${CLASS_NAME}|${saveUuid}`;
      doctosave.class_name = CLASS_NAME;
    }
    if (doctosave.isSubContract) {
      doctosave.partner_subcontract = doctosave.partner.ref;
      doctosave.partner = doctosave.contract.partner;
      doctosave.contract = doctosave.contract.contract;

    } else {
      doctosave.partner_subcontract = undefined;
      doctosave.partner = doctosave.partner.ref;
    }

    if (doctosave.organization) {
      doctosave.organization = doctosave.organization.ref;
    }
    if (doctosave.responsible) delete doctosave.responsible;
    if (doctosave.number_doc) delete doctosave.number_doc;

    doctosave.services.forEach((r) => {
      if (r.spec) delete r.spec;
      if (r.nats) delete r.spec;
      return (r.nom = r.nom.ref);
    });

    doctosave.doc_amount =
      servicesDataGridRef.current.instance.getTotalSummaryValue('amount');

    preSave();

    const response = await gqlClient.mutate({
      mutation: updateBuyersOrder,
      variables: { input: doctosave },
    });

    if (response?.errors) {
      return Promise.reject(joinBackValidationMsgs(response.errors));
    }

    return Promise.resolve(saveUuid);
  };

  const customTemplate = (r) => (
    <EpSimpleBtn _id={id} _key={r?.data?.row?.key - 1}
      type_EP_ref={data?.proj}
    />);


  const servicesDatagrid = (
    <>
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
          options={copyButtonOptions}
        />
        <Item text='Add' locateInMenu='always' visible={false} />
      </Toolbar>
      <DataGrid
        ref={servicesDataGridRef}
        noDataText='Список порожній'
        remoteOperations={false}
        rowAlternationEnabled
        showBorders
        showColumnLines
        allowColumnResizing
        selectTextOnEditStart
        hoverStateEnabled
        sorting={{ mode: false }}
        columnResizingMode='widget'
        columnAutoWidth
        keyExpr={'row'}
        dataSource={data.services}
        focusedRowEnabled={!docReadOnly}
        errorRowEnabled={false}
        onRowUpdating={handleRowUpdating}
        onFocusedRowKeyChange={(rowKey) => {
          focusedRowKey.current = rowKey;
        }}
        onInitNewRow={() => {
          const st = data.services.slice();
          st.push({
            row: data.services.length + 1,
            nom: { ref: undefined, name: '' },
            nats: 0,
          });
          setData((prevState) => ({
            ...prevState,
            services: st,
          }));
        }}
        onRowRemoved={(e) => {
          const st = data.services.filter((row) => row.row !== e.data.row);
          let i = 1;
          st.forEach((r) => {
            r.row = i++;
          });
          setData((prevState) => ({ ...prevState, services: st }));
        }}
      >
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
          calculateDisplayValue={(data) => data.nom?.name}
          editCellComponent={cellTemplate}
          placeholder='...вкажіть послугу..'
          showEditorAlways={!docReadOnly}
          minWidth={160}
        >
          <Lookup
            dataSource={nomsDataSource}
            displayExpr='name'
            valueExpr='ref'>
            <DataGrid dataSource={nomsDataSource} />
          </Lookup>
        </Column>
        <Column
          dataField='price'
          caption='Ціна'
          allowEditing={false}
          headerCellRender={() => (
            <p className='aaa' style={{ textAlign: 'center' }}>
              Ціна <br /> (прайс)
            </p>
          )}
          minWidth={70}
        />
        <Column
          dataField='quantity'
          caption='Кількість'
          width={70}
          allowEditing={!docReadOnly}
        />
        <Column
          dataField='spec'
          caption='Спецціна'
          allowEditing={false}
          width={80}
        />
        <Column
          dataField='discount_percent_automatic'
          caption='%скидки'
          allowEditing={false}
          width={80}
        />
        <Column
          dataField='nats'
          caption='Націнка'
          allowEditing={!docReadOnly}
          width={80}
        />

        <Column
          dataField='amount'
          caption='Сума з ПДВ'
          allowEditing={false}
          //width={100}
        />
        <Column
          dataField='gos_code'
          caption='Держ.номер'
          allowEditing={!docReadOnly}
          width='100%'
          minWidth={90}
          setCellValue={async (newData, value) => {
            value = normalizeCarNumber(value);
            newData.gos_code = value;
            if (data.isSubContract) {
              const response = await checkGosCode(value);

              if (response) {
                newData.gos_code = value;
              } else {
                newData.gos_code = '';
                const myDialog = custom({
                  title: 'Помилка.',
                  messageHtml:
                  `<p style="text-align:center;">
                  Номер автомобія неправильний,
                  або не вказано в Генеральному договорі`,
                  buttons: [
                    {
                      text: 'Продовжити',
                      onClick: () => 1,
                    },
                  ],
                });
                myDialog.show().then(() => {});
              }

            }
            return newData.gos_code;
          }}
        >
          {data.isSubContract && <RequiredRule />}

        </Column>

        <Column
          dataField='vin_code'
          caption='VIN код'
          allowEditing={!docReadOnly}
          width='100%'
          minWidth={120}
        />

        <Column editCellComponent={customTemplate} showEditorAlways
          width={140} caption='+EП' />

        <Summary>
          <TotalItem
            column='amount'
            summaryType='sum'
            displayFormat='Разом з ПДВ: {0}'
          />
        </Summary>
      </DataGrid>
    </>
  );

  return (
    <div>
      <StickyBar>
        <DocInfoBar
          name='Замовлення'
          data={{
            date: data.date,
            number: data.number_doc,
          }}
          loading={loading}
          isNew={isDocNew}>
          {data.protected && (
            <div className={'otk-tag otk-status-warning'}>
              <div className='dx-icon-warning'></div>
              &nbsp;Документ тільки для перегляду
            </div>
          )}
          <div className={`otk-tag otk-status-${status.status}`}>
            {status.text}
          </div>
        </DocInfoBar>

        <DocMenu
          isDocNew={isDocNew}
          allowSaving={!docReadOnly}
          onSave={handleDocumentSave}
          printItems={[
            {
              text: 'Рахунок',
              url: `${API_HOST}/printform/${id}/inv`,
              disabled: !data.number_doc,
            },
            {
              text: 'Договір',
              url: `${API_HOST}/printform/${id}/dog`,
              disabled: !data.number_doc,
            },
            {
              text: 'Договір сертифікації',
              url: `${API_HOST}/printform/${id}/dogs`,
            },
            {
              text: 'Договір для Казначейства',
              url: `${API_HOST}/printform/${id}/dogk`,
              disabled: !data.number_doc,
            },
            {
              text: 'Замовлення-термінал',
              disabled: isDocNew,
              onClick: async () => {
                const { openOrderInfo } = await import('./print-order-info');
                openOrderInfo({
                  ...data,
                  type: proj?.find((p) => p.ref === data.proj)?.name,
                  serviceList: serviceListStr,
                });
              },
            },
          ]}
        />
      </StickyBar>

      <LoadPanel visible={loading} />

      <PaymentForm
        paymentData={paymentData}
        description={`Замовлення послуг: ${serviceListStr}`}
        visible={showPaymentForm}
        availableMethods={availablePayMethods}
        onClose={() => setShowPaymentForm(false)}
      />

      <ValidationGroup ref={formGroupRef}>
        <div className='content-block otk-content-block'>
          <div
            className={
              'otk-doc-container otk-doc-form otk-doc-form-large dx-card'
            }>
            <Form labelLocation='top' formData={data}>
              <GroupItem>
                <ColCountByScreen xs={1} sm={2} md={2} lg={2} />

                <GroupItem colSpan={1}>
                  <ColCountByScreen xs={1} sm={2} md={2} lg={2} />
                  <SimpleItem colSpan={2} isRequired>
                    <Label text='Контрагент' />
                    <div className={styles.partnerContainer}>
                      <PartnerSearch
                        partner={data.partner}
                        onSelect={(e) => {
                          const additionalData =
                            e.individual_legal === 'ФизЛицо' ? {
                              ClientPerson: e?.name ?? '',
                              ClientPersonPhone: e?.phones?.split(',')?.[0] ??
                                '',
                            } : {};

                          checkSubContract(e.ref);
                          setData((prev) => ({
                            ...prev,
                            partner: {
                              ref: e.ref || '',
                              name: e.name || '',
                              isCorporate: !!e?.isCorporate,
                            },
                            isSubContract: false,
                            ...additionalData,
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
                      <Button
                        className={styles.partnerInfoButton}
                        visible={data.partner.isCorporate}
                        icon='file'
                        hint='договори'
                        onClick={() => {
                          partnerInfoPanelRef.current.instance.show();
                        }}
                      />
                      <PartnerInfoPanel
                        ref={partnerInfoPanelRef}
                        partner={
                          data.partner?.isCorporate ? data.partner : null
                        }
                      />
                    </div>
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='Особа' />
                    <TextBox
                      id='ClientPerson'
                      value={data.ClientPerson}
                      hint='контактана особа'
                      onChange={changeReq}
                      stylingMode={FORM_STYLING_MODE}
                      readOnly={docReadOnly}
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={1}>
                    <Label text='Телефон' />
                    <TextBox
                      id='ClientPersonPhone'
                      value={data.ClientPersonPhone}
                      hint='номер телефону'
                      onChange={changeReq}
                      stylingMode={FORM_STYLING_MODE}
                      readOnly={docReadOnly}
                      mask={'+38\\0 00 000-0000'}
                      useMaskedValue={true}
                    />
                  </SimpleItem>
                  <SimpleItem
                    cssClass={styles.addPriceItem}
                    colSpan={1}
                    visible={user.isAlterPrice}
                  >
                    <Label text='Додатковий прайс' location='left' />
                    <CheckBox
                      id='useAddPrice'
                      readOnly={docReadOnly}
                      onValueChanged={(e) => {
                        setData((prevState) => ({
                          ...prevState,
                          useAddPrice: e.value,
                        }));

                        updatePrices(data.date, e.value);
                      }}
                      value={data.useAddPrice}
                    />
                  </SimpleItem>
                </GroupItem>

                <GroupItem
                  visibleIndex={screenSize.isXSmall ? 0 : null}
                  colSpan={1}
                  cssClass={screenSize.isXSmall ? '' : styles.docInfoGroup}
                >
                  <SimpleItem
                    cssClass={styles.orderInfoItem}
                    render={() => (
                      <div className={styles.orderInfo}>
                        <div className={styles.orderNumber}>
                          <div>{`Номер: ${data.number_doc ?? ''}`}</div>
                          <CopyButton
                            value={data.number_doc}
                            hint={'скопіювати номер замовлення'}
                          />
                        </div>
                        <div>{`Дата: ${
                          dayjs(data.date).format(DATE_DISPLAY_FORMAT)
                        }`}</div>
                        <div>{`Стан: ${status.text}`}</div>
                      </div>
                    )}
                  />
                  <SimpleItem colSpan={2} label={{ location: 'left' }}>
                    <Label text='Тип' />
                    <SelectBox
                      readOnly={docReadOnly}
                      items={availableProjs}
                      displayExpr='name'
                      stylingMode={FORM_STYLING_MODE}
                      value={proj?.find((p) => p.ref === data.proj)}
                      onValueChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          proj: e?.ref,
                          services: DEFAULT_SERVICES,
                        }));
                      }}
                      placeholder=''
                      hint='тип замовлення'
                      label='Тип замовлення'
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <SelectBox
                      stylingMode={FORM_STYLING_MODE}
                      items={payKinds}
                      displayExpr='name'
                      placeholder=''
                      labelMode='static'
                      label='Тип платежу'
                      value={payKinds?.find((pk) => pk.ref === data.pay_kind)}
                      onValueChange={(e) => {
                        let price_type = user.price_type;
                        if (e.pay_form === 'Терминал') {
                          price_type = user.price_type_cash ?? 'zero';
                        }
                        setData((prev) => ({
                          ...prev,
                          pay_kind: e?.ref,
                          price_type,
                        }));
                        updatePrices(
                          data.date,
                          data.useAddPrice,
                          price_type,
                        );
                      }}
                      buttons={[
                        {
                          name: 'dropDown',
                          location: 'before',
                        },
                        {
                          location: 'after',
                          name: 'pay',
                          options: {
                            text: 'Оплатити',
                            icon: 'money',
                            stylingMode: 'text',
                            visible: data.pay_kind &&
                              onlinePayKind?.ref === data.pay_kind,
                            disabled: !paymentEnabled,
                            onClick: () => setShowPaymentForm(true),
                          },
                        },
                      ]}
                    />
                  </SimpleItem>
                </GroupItem>
              </GroupItem>
              <SimpleItem>{servicesDatagrid}</SimpleItem>

              <GroupItem>
                <ColCountByScreen xs={1} sm={8} md={8} lg={10} />
                <SimpleItem colSpan={8}>
                  <Label text='Коментар' />
                  <TextArea
                    id='note'
                    readOnly={docReadOnly}
                    value={data.note}
                    stylingMode={FORM_STYLING_MODE}
                    hint='коментар'
                    onChange={changeReq}
                  />
                </SimpleItem>
              </GroupItem>
            </Form>
          </div>
        </div>
      </ValidationGroup>
    </div>
  );
};
