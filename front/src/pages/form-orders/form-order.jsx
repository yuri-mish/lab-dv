import { useRef, useCallback, useState, useEffect } from 'react';
import {
  TextArea,
  ValidationGroup,
  LoadPanel,
  Popup,
  Button,
} from 'devextreme-react';
import Form, {
  ButtonItem,
  ColCountByScreen,
  GroupItem,
  Label,
  RangeRule,
  SimpleItem,
} from 'devextreme-react/form';
import Validator, {
  RequiredRule,
} from 'devextreme-react/validator';
import DataGrid, {
  Column,
  Editing,
  Summary,
  TotalItem,
  Button as DgButton,
  Texts,
} from 'devextreme-react/data-grid';
import { locale } from 'devextreme/localization';
import { v4 as uuid_v4 } from 'uuid';
import { useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { showError } from 'utils/notify';
import { openDoc } from 'utils/open-doc';
import {
  useDate,
  useDocCloseStatus,
  useDocState,
  usePrices,
  useLab,
} from 'hooks';
import {
  API_HOST,
  BLANKS_BUCKET_URL,
  COLUMN_EDIT_WIDTH,
  DATE_DISPLAY_FORMAT,
  FORM_STYLING_MODE,
  NULL_UUID,
} from 'app-constants';
import {
  BLANKS_ORDER_PRICE_TYPE,
  nomTypes,
} from './constants';
import {
  docRowValidationMsg,
  docValidationMsg,
  joinBackValidationMsgs,
  messages,
} from 'messages';
import { loader } from 'graphql.macro';
import {
  PartnerSearch,
  SingleFileUploader,
  DocInfoBar,
  StickyBar,
  DocMenu,
  DocInfoBlock,
} from 'components';
import PropTypes from 'prop-types';
import styles from './form-orders.module.scss';
import dayjs from 'dayjs';
import { dsPartners } from 'datasources';

const getBlanksOrder = loader('./getBlanksOrder.graphql');
const updateBlanksOrder = loader('./updateBlanksOrder.graphql');

const CLASS_NAME = 'doc.blankorder';
const DOC_CLOSE_PERIOD = 1;

const EditForm = (props) => {
  const [ data, setData ] = useState(props.blank);
  const { formatDate } = useDate();
  const edit = !!props.blank;
  const availableTypes = props.blank ?
    [ props.blank.nomType ] :
    props.availableTypes;

  const defaultBlank = {
    nomType: availableTypes?.[0],
    in_doc_date: formatDate(),
    in_doc_number: null,
    quantity: 1,
    file_lab: null,
  };
  const formData = useRef({
    ...defaultBlank,
    ...props.blank,
  });
  const ref = useRef();

  useEffect(() => {
    if (!props.availableTypes.length && !edit) {
      props.onClose();
      return;
    }
    formData.current = { ...defaultBlank, ...props.blank };
    ref?.current?.instance.updateData(formData.current);
    setData({
      file_lab: formData.current.file_lab,
      nomType: formData.current.nomType,
    });
  }, [ props.blank, props.availableTypes ]);

  const price = props.prices.getPrice(nomTypes?.[data?.nomType]?.ref);

  const handleFormSave = (e) => {
    const validationResult = e.validationGroup.validate();
    if (!validationResult.isValid) {
      return;
    }
    const formData = ref.current.instance.option('formData');
    const newBlank = { ...formData, price, ...data };
    if (edit) {
      props.onEdit(newBlank);
      props.onClose();
    } else {
      props.onAdding(newBlank);
    }
  };

  return (
    <Popup
      className={styles.popup}
      visible={props.visible}
      onHiding={props.onClose}
      dragEnabled
      closeOnOutsideClick
      showTitle
      title={edit ? 'Змінити' : 'Додати тип бланків'}
      showCloseButton
      width='300px'
      maxWidth='700px'
      height='auto'
      maxHeight='100%'
    >
      <Form
        ref={ref}
        formData={formData.current}
        onFieldDataChanged={() => {
          ref?.current?.instance.validate();
        }}
        focusStateEnabled
        stylingMode={FORM_STYLING_MODE}
        validationGroup='form'
      >
        <GroupItem colCount={1}>
          <SimpleItem
            dataField='nomType'
            editorType='dxSelectBox'
            label={{
              text: 'Тип бланків',
            }}
            editorOptions={{
              readOnly: edit,
              items: availableTypes,
              displayExpr: (item) => nomTypes[item]?.name,
              onValueChanged: (e) => setData((prev) => (
                { ...prev, nomType: e.value }
              )),
            }}
          />
          <GroupItem colCount={2}>
            <SimpleItem
              dataField='quantity'
              editorType='dxNumberBox'
              editorOptions={{
                format: '#',
              }}
              label={{
                text: 'Кількість',
              }}
              isRequired={false}
            >
              <RangeRule min={1} message={'Мінімум 1'}/>
              <RequiredRule />
            </SimpleItem>
            <SimpleItem
              cssClass={styles.priceItem}
              render={() => (
                <div className={styles.price}>{`Ціна: ${price}`}</div>)
              }
            />
          </GroupItem>
          <SimpleItem
            dataField='in_doc_number'
            editorType='dxTextBox'
            label={{
              text: 'Номер вх. док-та',
            }}
          >
            <RequiredRule />
          </SimpleItem>
          <SimpleItem
            dataField='in_doc_date'
            editorType='dxDateBox'
            label={{
              text: 'Дата вх. док-та',
            }}
          />
          <SimpleItem
            render={() => (
              <div className={styles.fileUploader}>
                <SingleFileUploader
                  width={200}
                  bucketUrl={BLANKS_BUCKET_URL}
                  uploadedFileUrl={data.file_lab}
                  onFileUploaded={(file) => setData((prev) => ({
                    ...prev,
                    file_lab: file.url,
                  }))}

                  onFileDeleted={() => setData((prev) => ({
                    ...prev,
                    file_lab: null,
                  }))}
                />
              </div>

            )}
          >
            <RequiredRule />
          </SimpleItem>
        </GroupItem>

      </Form>
      <div className={styles.editFormButton}>
        <Button
          validationGroup='form'
          text={edit ? 'зберегти' : 'додати'}
          onClick={handleFormSave}
        />
      </div>
    </Popup>
  );
};

EditForm.propTypes = {
  prices: PropTypes.object.isRequired,
  onAdding: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  blank: PropTypes.object,
  availableTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export const FormOrder = () => {
  const [ showEditForm, setShowEditForm ] = useState(false);
  const [ editBlank, setEditBlank ] = useState();
  const history = useHistory();
  const gqlClient = useApolloClient();

  const { formatDate } = useDate();

  const { lab } = useLab();

  const prices = usePrices(BLANKS_ORDER_PRICE_TYPE, () => {
    showError(messages.PRICE_LOAD_FAILED);
    history.goBack();
  });

  const fillPrices = (data, newPrices) => ({
    ...data,
    pos_blank: data.pos_blank?.map((row) => ({
      ...row,
      price: prices.findPrice(newPrices, nomTypes?.[row.nomType].ref),
    })),
  });

  const [ data, setData, { loading, isDocNew, preSave } ] = useDocState({
    className: CLASS_NAME,
    defaultData: {
      date: formatDate(),
      number_doc: null,
      partner: null,
      note: '',
      pos_blank: [],
    },
    load: (id) => gqlClient.query({
      query: getBlanksOrder,
      variables: { ref: id },
    })
      .then(async (response) => {
        const order = response?.data?.blanks?.[0];
        if (!order?.ref) {
          throw new Error();
        }
        return order;
      }),
    update: (state, data) => prices.loadPrices(data.date)
      .then((newPrices) => fillPrices({
        ...state,
        ...data,
      }, newPrices)),
  });

  useEffect(() => {
    const rsc = lab?.['РСЦ'];
    if (rsc && rsc !== NULL_UUID && isDocNew) {
      dsPartners.byKey(rsc).then((partner) => {
        setData((prev) => ({ ...prev, partner }));
      });
    }
  }, [ lab ]);

  const filledTypes = data.pos_blank.map?.(
    (row) => row.nomType?.toString(),
  ) ?? [];
  const availableTypes = Object.keys(nomTypes).filter(
    (type) => !filledTypes.includes(type),
  );

  const docReadOnly = useDocCloseStatus(data.date, DOC_CLOSE_PERIOD);

  const formGroupRef = useRef();
  const dataGridRef = useRef();

  locale('ua');

  const handleFieldValueChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.element.id]: e.event?.target?.value,
    }));
  };

  const handleBlankAdding = (blank) => {
    setData((prev) => ({
      ...prev,
      pos_blank: [
        ...(prev?.pos_blank ?? {}),
        blank,
      ],
    }));
  };

  const handleBlankEdit = (blank) => {
    setData((prev) => ({
      ...prev,
      pos_blank: prev.pos_blank?.map((row) => (
        row.nomType === blank.nomType ? blank : row
      )),
    }));
  };

  const onEditStart = (data) => {
    setEditBlank(data);
    setShowEditForm(true);
  };

  const validateForm = () => {
    let errorMessage = '';
    const validationResult = formGroupRef.current.instance.validate();
    if (!validationResult.isValid) {
      errorMessage += docValidationMsg(messages.HAS_INVALID_FIELDS);
    }
    if (!data?.partner?.ref) {
      errorMessage += docValidationMsg(messages.PARTNER_REQUIRED);
    }

    const rows = data.pos_blank;

    if (rows.every((row) => !row.quantity)) {
      errorMessage += docValidationMsg('Потрібно заповніть хоча б один рядок');
    } else {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.quantity) {
          if (!row.quantity || row.quantity < 1) {
            errorMessage += docRowValidationMsg('Невірна кількість', i + 1);
          }
          if (!row.in_doc_number) {
            errorMessage += docRowValidationMsg('Неправильний номер', i + 1);
          }
          if (!row.in_doc_date) {
            errorMessage += docRowValidationMsg('Невірна дата', i + 1);
          }
          if (!row.file_lab) {
            errorMessage += docRowValidationMsg(
              messages.FILE_NOT_UPLOADED, i + 1,
            );
          }
        }
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
      doctosave._id = `doc.blankorder|${saveUuid}`;
      doctosave.class_name = 'doc.blankorder';
    } else {
      doctosave._id = data._id;
      doctosave.ref = data.ref;
    }

    doctosave.date = data.date;
    doctosave.partner = data.partner.ref;
    doctosave.note = data.note;
    doctosave.doc_amount = dataGridRef.current.instance
      .getTotalSummaryValue('amount');

    doctosave.pos_blank = data.pos_blank.map((row, index) => ({
      ...row,
      amount: Number(dataGridRef.current.instance.cellValue(index, 'amount')),
    }));

    preSave();

    const response = await gqlClient.mutate({
      mutation: updateBlanksOrder,
      variables: { input: doctosave },
    });

    if (response?.errors) {
      return Promise.reject(joinBackValidationMsgs(response.errors));
    }

    return Promise.resolve(saveUuid);
  };

  const fileLinkRender = useCallback((cellData) => {
    const link = cellData?.data?.file_1c || '';
    const slashIndex = link.lastIndexOf('/');
    const renderLink = slashIndex >= 0 ?
      link.substring(slashIndex + 1) :
      link;

    return link ?
      <a
        className={`dx-icon-file ${styles.fileLink}`}
        href={link}
        title={renderLink}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => {
          openDoc(link);
        }}

      /> :
      <></>;
  }, []);

  const dg = <DataGrid
    ref={dataGridRef}
    keyExpr='nomType'
    noDataText='Список порожній'
    remoteOperations={false}
    showBorders
    showColumnLines
    allowColumnResizing
    hoverStateEnabled
    selectTextOnEditStart
    columnAutoWidth
    allowEditing
    columnResizingMode='widget'
    dataSource={data.pos_blank}
    errorRowEnabled={false}
    validationGroup={formGroupRef}
    sorting={{ mode: 'none' }}
    onRowDblClick={(e) => onEditStart(e.data)}
    onRowRemoved={(e) => setData((prev) => ({
      ...prev,
      pos_blank: prev.pos_blank.filter((row) => row.nomType !== e.key),
    }))}
  >
    <Editing
      mode='row'
      allowUpdating={true}
      allowDeleting={true}
      useIcons
      confirmDelete={false}
    >
      <Texts confirmDeleteMessage='Вилучити?' deleteRow='вилучити' />
    </Editing>

    <Column
      name='edit'
      type='buttons'
      width={COLUMN_EDIT_WIDTH}
      allowResizing={false}
    >
      <DgButton
        name='_edit'
        icon='edit'
        onClick={(e) => onEditStart(e.row.data)}
      />
    </Column>

    <Column
      caption='Номенклатура'
      dataField='nomType'
      alignment='left'
      allowEditing={false}
      calculateDisplayValue={(row) => nomTypes[row.nomType]?.name}
    />

    <Column
      dataField='quantity'
      dataType='number'
      allowEditing={false}
      alignment='right'
      caption='Кількість'
      width={95}
    />

    <Column
      dataField='price'
      dataType='number'
      allowEditing={false}
      alignment='right'
      caption='Цiна'
      width={60}
    />

    <Column
      dataField='amount'
      dataType='number'
      allowEditing={false}
      calculateCellValue={(rowData) => (
        rowData?.quantity && rowData?.price ?
          (rowData.price * rowData.quantity).toFixed?.(2) :
          null
      )}
      alignment='right'
      caption='Сума'
    />

    <Column
      dataField='in_doc_number'
      dataType='string'
      allowEditing={false}
      alignment='center'
      caption='Номер (вх.док)'
      minWidth={120}
      width='30%'
    />

    <Column
      dataField='in_doc_date'
      dataType='date'
      allowEditing={false}
      alignment='center'
      caption='Дата (вх.док)'
      showEditorAlways={false}
      width={120}
    />

    <Column
      dataField='file_lab'
      caption='Файл'
      cellRender={(e) => (
        <div className={`dx-icon-${e.data.file_lab ? 'check' : 'close'}`}/>
      )}
      alignment='center'
      allowEditing={false}
      width={60}
    />

    <Column
      dataField='file_1c'
      allowEditing={false}
      cellRender={fileLinkRender}
      alignment='center'
      caption='Платiжки'
      width={100}
    />

    <Column
      type='buttons'
      width={COLUMN_EDIT_WIDTH}
      allowResizing={false}
    >
      <DgButton name='delete'/>
    </Column>

    <Summary>
      <TotalItem
        column='amount'
        summaryType='sum'
        displayFormat='Разом: {0}'
      />
    </Summary>
  </DataGrid>;

  return (
    <div>
      <StickyBar>
        <DocInfoBar
          name={'Замовленне бланкiв'}
          data={{
            date: data.date,
            number: data.number_doc,
          }}
          loading={false}
          isNew={isDocNew}
        />
        <DocMenu
          isDocNew={isDocNew}
          allowSaving={!docReadOnly}
          onSave={handleFormSave}
          printItems={[
            {
              id: 'print',
              text: 'Довiренiсть',
              url: `${API_HOST}/printform/${data.trust_doc}/trs`,
              disabled: !data.trust_doc,
            },
          ]}
        />
      </StickyBar>

      <LoadPanel
        visible={loading}
      />

      <EditForm
        blank={editBlank}
        prices={prices}
        availableTypes={availableTypes}
        visible={showEditForm}
        onAdding={handleBlankAdding}
        onEdit={handleBlankEdit}
        onClose={() => {
          setShowEditForm(false);
          setEditBlank(null);
        }}
      />

      <ValidationGroup
        ref={formGroupRef}
      >
        <div className='content-block otk-content-block'>
          <div className={
            'otk-doc-container otk-doc-form otk-doc-form-large dx-card'
          }>
            <DocInfoBlock
              lines={[
                `Номер: ${data.number_doc ?? ''}`,
                `Дата: ${dayjs(data.date).format(DATE_DISPLAY_FORMAT) ?? ''}`,
              ]}
            />

            <Form
              labelLocation='top'
              formData={data}
            >
              <GroupItem>
                <ColCountByScreen xs={1} sm={3} md={5} lg={6} />
                <SimpleItem colSpan={2} isRequired>
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
                        <RequiredRule/>
                      </Validator>
                    }
                  />
                </SimpleItem>
              </GroupItem>

              <ButtonItem
                horizontalAlignment='left'
                buttonOptions={{
                  text: 'Додати тип бланків',
                  disabled: !availableTypes.length,
                  icon: 'edit',
                  onClick: () => setShowEditForm(true),
                }}
              />

              <SimpleItem cssClass={styles.dataGridItem}>
                {dg}
              </SimpleItem>

              <GroupItem>
                <ColCountByScreen xs={1} sm={8} md={8} lg={10} />
                <SimpleItem colSpan={8}>
                  <Label text='Коментар' />
                  <TextArea
                    value={data.note}
                    id='note'
                    hint='коментар'
                    stylingMode={FORM_STYLING_MODE}
                    readOnly={docReadOnly}
                    onChange={handleFieldValueChange}
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
