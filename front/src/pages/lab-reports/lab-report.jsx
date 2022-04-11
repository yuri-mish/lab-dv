import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DateBox,
  Form,
  LoadPanel,
  NumberBox,
  TextArea,
  TextBox,
} from 'devextreme-react';
import Validator, {
  RequiredRule,
  CustomRule,
} from 'devextreme-react/validator';
import {
  ColCountByScreen,
  GroupItem,
  Label,
  SimpleItem,
} from 'devextreme-react/form';
import { ValidationGroup } from 'devextreme-react/validation-group';
import {
  diiaStatuses,
  DX_DATE_DISPLAY_FORMAT,
  FORM_STYLING_MODE,
} from 'app-constants';
import {
  DocInfoBar,
  DocMenu,
  NomsSearch,
  OrdersSearch,
  StickyBar,
} from 'components';
import { docValidationMsg, joinBackValidationMsgs, messages } from 'messages';
import {
  mapDiiaStatusesToTypes,
  NOMS_VALIDATION_ERROR_MSG,
  NO_ERRORS_DESCRIPTION_TEXT,
  paymentTypes,
  PRICES_VALIDATION_ERROR_MSG,
} from './constants';
import { gqlClient } from 'gql-client';
import { loader } from 'graphql.macro';
import { usePrices, useDocState } from 'hooks';
import { dsLabReportSearchOrders, dsReports } from './datasources';
import styles from './lab-report.module.scss';
import { ReportsSearch } from './reports-search';

const getLabReport = loader('./getLabReport.graphql');
const updateLabReport = loader('./updateLabReport.graphql');

export const LabReport = () => {
  const [ nomsDataSource, setNomsDataSource ] = useState(null);
  const [ data, setData, { loading, preSave } ] = useDocState({
    defaultData: {
      spot_cashless: false,
    },
    load: (id) => gqlClient.query({
      query: getLabReport,
      variables: { ref: id },
    })
      .then(async (response) => {
        const report = response?.data?.lab_report?.[0];
        if (!report.ref) {
          throw new Error();
        }
        report.lab = response.data?.branch.jsb.suffix;
        return report;
      }),
    update: (state, data) => ({ ...state, ...data }),
  });

  const { loadPrices, getPrice, findPrice } = usePrices(null, () => {});

  const validationGroupRef = useRef();

  const hasOrder = data.spot_cashless;

  const dsSourceReports = useMemo(() => (
    dsReports(data.invoice?.ref, data?.ref)
  ), [ data.invoice?.ref ]);

  const handleFieldChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.element.id]: e.value,
    }));
  };

  // create a new datasource which contains noms from chosen order
  const updatePossibleServices = () => {
    setNomsDataSource(hasOrder ?
      (data?.invoice?.services || [])
        // filter unique servises
        .filter((service, i, arr) => (
          arr.indexOf(arr.find((s) => s.nom.ref === service.nom.ref)) === i
        ))
        .map((service) => ({
          ...service.nom,
        })) :
      null,
    );
  };

  // set datasource on services change
  useEffect(() => {
    updatePossibleServices();
  }, [ data?.invoice?.services ]);

  const handleOrderSelect = (e) => {
    setData((prev) => ({
      ...prev,
      invoice: {
        ref: e.ref || '',
        caption: e.caption || '',
        date: e.date || '',
        services: e.services || [],
      },
      partner: e.partner || prev.partner,
      source_report: null,
    }));

    // load prices on order change then update amount by price of chosen service
    loadPrices(data?.invoice?.date).then((newPrices) => {
      setData((prev) => (
        { ...prev, amount: findPrice(newPrices, prev?.service?.ref) }
      ));
    });
  };

  const handleNomSelect = (e) => {
    setData((prev) => ({
      ...prev,
      service: {
        ref: e.ref || '',
        name: e.name || '',
      },
      // change amount only if there is a price for chosen nom
      amount: getPrice(e.ref) || prev.amount,
    }));
  };

  const handleSourceReportSelect = (e) => {
    setData((prev) => ({
      ...prev,
      source_report: {
        ref: e.ref || '',
        caption: e.caption || '',
      },
    }));
  };

  const validatePrices = () => data.amount >= data.rv + data.rp;
  const validateService = () => (
    nomsDataSource?.find((nom) => nom.ref === data?.service.ref)
  );
  const validateForm = () => {
    let errorMessage = '';
    const result = validationGroupRef.current.instance.validate();

    if (!validatePrices()) {
      errorMessage += docValidationMsg(
        'Сума повинна бути більше або дорівнює ніж РП + РВ',
      );
    }

    if (hasOrder && !validateService()) {
      errorMessage += docValidationMsg(NOMS_VALIDATION_ERROR_MSG);
    }

    return errorMessage ||
      (!result.isValid && docValidationMsg(messages.HAS_INVALID_FIELDS));
  };

  const handleFormSave = async () => {
    const err = validateForm();
    if (err) {
      return Promise.reject(err);
    }

    const doctosave = {
      _id: data._id,
      ref: data.ref,

      partner: data.partner.ref,
      invoice: data.invoice.ref,
      service: data.service.ref,
      next_date: data.next_date,
      amount: data.amount,
      source_report: data.source_report?.ref,
      rv: data.rv,
      rp: data.rp,
      note: data.note,
    };

    preSave();

    const response = await gqlClient.mutate({
      mutation: updateLabReport,
      variables: { input: doctosave },
    });

    if (response?.errors) {
      return Promise.reject(joinBackValidationMsgs(response.errors));
    }

    return Promise.resolve(data.ref);
  };

  return (
    <div>
      <StickyBar>
        <DocInfoBar
          name='Звіт лабораторії'
          data={{
            date: data.date,
            number: data.number_doc,
          }}
          loading={loading}
        >
          {data.has_error &&
            <div className={'otk-tag otk-status-error'}>
              <div className='dx-icon-warning'></div>
              &nbsp;Документ з помилками
            </div>
          }

          {data.vehicle_map ?
            <div className={'otk-tag otk-status-success'}>
              <div className='dx-icon-check'></div>
              &nbsp;Відповідність ТО
            </div> :
            <div className={'otk-tag otk-status-error'}>
              <div className='dx-icon-clear'></div>
              &nbsp;Невідповідність ТО
            </div>
          }

          {data.dangerous &&
            <div className={'otk-tag otk-status-default'}>
              Небезпечний
            </div>
          }

          {data.has_error &&
            <div className={'otk-tag otk-status-default'}>
              Міжнародний ТО
            </div>
          }

          <div className={styles.diiaStatus}>
            &nbsp;&nbsp;Статус Дія:&nbsp;
            <div className={
              `otk-tag otk-status-${
                mapDiiaStatusesToTypes[data.status] || 'default'
              }`
            }>
              {Object.values(diiaStatuses).find(
                (value) => value.status === data.status)?.statusText
              }
            </div>
          </div>
        </DocInfoBar>
        <DocMenu
          isDocNew={false}
          onSave={handleFormSave}
        />

      </StickyBar>
      <LoadPanel
        visible={loading}
      />

      <div className='content-block otk-content-block'>
        <div className={
          `otk-doc-container 
          ${styles.docContainer} 
          ${data.has_error ? '' : styles.docContainerNoErrors} 
          dx-card`}
        >
          <div className={styles.form}>
            <ValidationGroup
              ref={validationGroupRef}
            >
              <Form
                labelLocation='top'
                formData={data}
              >
                <GroupItem>
                  <ColCountByScreen xs={1} sm={6} md={8} lg={8} />
                  <SimpleItem colSpan={2}>
                    <Label text='Номер звіту' />
                    <TextBox
                      readOnly
                      value={data.number_doc}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='Дата звіту' />
                    <DateBox
                      readOnly
                      displayFormat={DX_DATE_DISPLAY_FORMAT}
                      value={data.date}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='Тип оплати' />
                    <TextBox
                      readOnly
                      value={data.spot_cashless ?
                        paymentTypes.CASHLESS :
                        paymentTypes.CASH
                      }
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                </GroupItem>

                <GroupItem>
                  <ColCountByScreen xs={1} sm={2} md={4} lg={4} />
                  <SimpleItem visible={hasOrder} colSpan={2}>
                    <Label text='Замовлення' />
                    <OrdersSearch
                      dataSource={dsLabReportSearchOrders}
                      order={data?.invoice}
                      onSelect={handleOrderSelect}
                      readOnly={false}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='Контрагент' />
                    <TextBox
                      readOnly
                      value={data?.partner?.name}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                </GroupItem>

                <GroupItem>
                  <ColCountByScreen xs={1} sm={4} md={8} lg={8} />
                  <SimpleItem colSpan={2}>
                    <Label text='Послуга' />
                    <NomsSearch
                      dataSource={nomsDataSource}
                      nom={data?.service}
                      onSelect={handleNomSelect}
                      readOnly={false}
                      stylingMode={FORM_STYLING_MODE}
                      validator={
                        <Validator>
                          {hasOrder && nomsDataSource &&
                            < CustomRule
                              validationCallback={validateService}
                              message={NOMS_VALIDATION_ERROR_MSG}
                            />
                          }
                        </Validator>
                      }
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='Лабораторія' />
                    <TextBox
                      readOnly
                      value={data.lab}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='Дата наступного ОТК' />
                    <DateBox
                      value={data.next_date}
                      displayFormat={DX_DATE_DISPLAY_FORMAT}
                      stylingMode={FORM_STYLING_MODE}
                      onValueChanged={(e) => {
                        setData((prev) => ({
                          ...prev,
                          next_date: e.value,
                        }));
                      }}
                    />
                  </SimpleItem>
                </GroupItem >

                <GroupItem>
                  <ColCountByScreen xs={1} sm={6} md={8} lg={8} />
                  <SimpleItem colSpan={1}>
                    <Label text='Серія бланка' />
                    <TextBox
                      readOnly
                      value={data.blank_series}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='Номер бланка' />
                    <NumberBox
                      readOnly
                      value={data.blank_number}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                </GroupItem>

                <GroupItem>
                  <ColCountByScreen xs={1} sm={6} md={8} lg={8} />
                  <SimpleItem colSpan={2}>
                    <Label text='Модель ТС' />
                    <TextBox
                      readOnly
                      value={data.vehicle_model?.name}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='Гос. Номер' />
                    <TextBox
                      readOnly
                      value={data.gnumber}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='VIN' />
                    <NumberBox
                      readOnly
                      value={data.vin}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                </GroupItem>

                <GroupItem>
                  <ColCountByScreen xs={1} sm={6} md={8} lg={8} />
                  <SimpleItem colSpan={2}>
                    <Label text='Сума' />
                    <NumberBox
                      id='amount'
                      value={data.amount}
                      stylingMode={FORM_STYLING_MODE}
                      onValueChanged={handleFieldChange}
                      min={0}
                    >
                      <Validator>
                        <RequiredRule />
                        <CustomRule
                          validationCallback={validatePrices}
                          message={PRICES_VALIDATION_ERROR_MSG}
                        />
                      </Validator>
                    </NumberBox>
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='РП' />
                    <NumberBox
                      id='rp'
                      value={data.rp}
                      stylingMode={FORM_STYLING_MODE}
                      onValueChanged={handleFieldChange}
                      min={0}
                    >
                      <Validator>
                        <CustomRule
                          validationCallback={validatePrices}
                          message={PRICES_VALIDATION_ERROR_MSG}
                        />
                      </Validator>
                    </NumberBox>
                  </SimpleItem>
                  <SimpleItem colSpan={2}>
                    <Label text='РВ' />
                    <NumberBox
                      id='rv'
                      value={data.rv}
                      stylingMode={FORM_STYLING_MODE}
                      onValueChanged={handleFieldChange}
                      min={0}
                    >
                      <Validator>
                        <CustomRule
                          validationCallback={validatePrices}
                          message={PRICES_VALIDATION_ERROR_MSG}
                        />
                      </Validator>
                    </NumberBox>
                  </SimpleItem>
                </GroupItem>

                <GroupItem>
                  <ColCountByScreen xs={1} sm={4} md={8} lg={8} />
                  <SimpleItem colSpan={4}>
                    <Label text='Виправлення документа' />
                    <ReportsSearch
                      report={data.source_report}
                      onSelect={handleSourceReportSelect}
                      dataSource={dsSourceReports}
                      stylingMode={FORM_STYLING_MODE}
                    />
                  </SimpleItem>
                </GroupItem>

                <SimpleItem>
                  <Label text='Коментар' />
                  <TextArea
                    id='note'
                    value={data.note}
                    stylingMode={FORM_STYLING_MODE}
                    onValueChanged={handleFieldChange}
                  />
                </SimpleItem>
              </Form>
            </ValidationGroup>
          </div>

          {data.has_error &&
            <div className={styles.errorsWrapper}>
              <div className={
                `dx-theme-border-color ${styles.errorsContainer}`
              }>
                <div className={`dx-icon-warning ${styles.errorsIcon}`} />
                <p className={
                  `${styles.errorMsgs} 
                  ${data.error ? styles.errorMsgsNoDesc : ''}`
                }>
                  {data.error || NO_ERRORS_DESCRIPTION_TEXT}
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};
