import { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Popup, RadioGroup, ScrollView } from 'devextreme-react';
import { dsPartners } from 'datasources';
import {
  GroupItem,
  ButtonItem,
  SimpleItem,
  ColCountByScreen,
  CustomRule,
  RequiredRule,
} from 'devextreme-react/form';
import { confirm } from 'devextreme/ui/dialog';
import { v4 as uuid_v4 } from 'uuid';
import { FORM_STYLING_MODE, partnerTypes } from 'app-constants';
import { LoadPanel } from 'devextreme-react/load-panel';
import { showError, showSuccess } from 'utils/notify';
import { loader } from 'graphql.macro';
import styles from './partner.module.scss';
import { useApolloClient } from '@apollo/client';
import { docBackValidationMsg, messages } from 'messages';
import { buildClass } from 'utils/build-classname';
import { normalizePhoneNumber, validatePhoneNumber } from 'utils/phone-number';
import { useDeviceType } from 'hooks';

const updatePartner = loader('./updatePartner.gql');
const getPartner = loader('./getPartner.gql');
const getODBPartner = loader('./getODBPartner.gql');

const _ = require('lodash');

const formTypes = {
  EDRPOU: 'edrpou',
  PHONE: 'phone',
};

const findVal = (obj, key) => {
  const seen = new Set();
  let active = [ obj ];
  while (active.length) {
    const new_active = [];
    const found = [];
    for (let i = 0; i < active.length; i++) {
      // eslint-disable-next-line no-loop-func
      Object.keys(active[i]).forEach((k) => {
        const x = active[i][k];
        if (k === key) {
          found.push(x);
        } else if (x && typeof x === 'object' && !seen.has(x)) {
          seen.add(x);
          new_active.push(x);
        }
      });
    }
    if (found.length) return found;
    active = new_active;
  }
  return null;
};

const NewPartnerForm = (props) => {
  const gqlClient = useApolloClient();
  const [ loading, setLoading ] = useState(false);
  const [ formType, setFormType ] = useState(formTypes.EDRPOU);

  const formData = useRef({ phone: '', edrpou: '' });
  const buttonClass = buildClass(
    'otk-normal-button',
    styles.createFormActionButton,
  );

  const validateEdrpou = (value) => (
    [ 8, 10 ].includes(String(value)?.length) && /^[0-9]+$/.test(String(value))
  );

  const handleByEdrpouClick = async () => {
    const edrpou = String(formData.current.edrpou);
    if (!validateEdrpou(edrpou)) {
      showError(messages.WRONG_EDRPOU);
      return;
    }
    props.onProcessingStart?.();
    setLoading(true);
    const partner = await dsPartners.byEdrpou(edrpou);
    if (partner) {
      showError(messages.PARTNER_ALREADY_EXIST);
    } else {
      await gqlClient.query({
        query: getODBPartner,
        variables: { edrpou },
      })
        .then((res) => {
          if (res.data?.opendatabot?.full_name) {
            const botPartner = res.data.opendatabot;
            const inn = findVal(botPartner, 'pdv')?.[0]?.number ||
              botPartner?.pdv_code ||
              '';
            const odb_response = JSON.stringify(botPartner);

            props.onPartnerReady({
              name: botPartner.short_name || botPartner.full_name,
              name_full: botPartner.full_name,
              is_buyer: true,
              individual_legal: edrpou.length === 10 ?
                'ФизЛицо' : 'ЮрЛицо',
              inn,
              edrpou,
              note: odb_response,
              ext_json: {
                odb_response,
              },
            });
          } else {
            showError(messages.PARTNER_DOES_NOT_EXIST);
          }
        });
    }

    setLoading(false);
  };

  const handleByPhoneClick = async () => {
    const phone = normalizePhoneNumber(formData.current.phone);
    if (validatePhoneNumber(phone)) {
      props.onProcessingStart?.();
      setLoading(true);
      const partner = await dsPartners.byPhone(phone.substring(3));
      setLoading(false);
      (partner ?
        confirm(
          'Контрагент із таким телефоном вже існує. Створити нове?',
          'Контрагент вже існує',
        ) :
        Promise.resolve(true)
      ).then(async (confirmCreate) => {
        if (confirmCreate) {
          props.onPartnerReady({
            phones: phone,
            is_buyer: true,
            individual_legal: partnerTypes.INDIVIDUAL,
          });
        }
      });
    } else {
      showError('Неправильно введено номер телефону');
    }
  };

  const ByEdrpouForm = () => (
    <Form
      formData={formData.current}
      stylingMode={FORM_STYLING_MODE}
    >
      <GroupItem>
        <ColCountByScreen sm={7} md={8} lg={8} />
        <SimpleItem
          colSpan={4}
          dataField='edrpou'
          label={{ text: 'Код ЄДРПОУ/ІПН Фізособи', visible: false }}
          editorType='dxTextBox'
          editorOptions={{
            maxLength: 10,
          }}
        >
          <CustomRule
            validationCallback={(e) => validateEdrpou(e?.value)}
            message={messages.WRONG_EDRPOU}
          />
        </SimpleItem>
        <ButtonItem
          colSpan={3}
          cssClass={buttonClass}
          buttonOptions={{
            text: 'Знайти',
            icon: 'search',
            onClick: handleByEdrpouClick,
          }}
          verticalAlignment='center'
          horizontalAlignment='center'
        />
      </GroupItem>
    </Form>
  );

  const ByPhoneForm = () => (
    <Form
      formData={formData.current}
      stylingMode={FORM_STYLING_MODE}
    >
      <GroupItem>
        <ColCountByScreen sm={7} md={8} lg={8} />
        <SimpleItem
          colSpan={4}
          dataField='phone'
          label={{ text: 'Номер телефону', visible: false }}
          editorType='dxTextBox'
          editorOptions={{
            mask: '+38\\0 00 000-0000',
            useMaskedValue: true,
          }}
        />
        <ButtonItem
          colSpan={3}
          cssClass={buttonClass}
          buttonOptions={{
            text: 'Знайти',
            icon: 'search',
            onClick: handleByPhoneClick,
          }}
          verticalAlignment='center'
          horizontalAlignment='center'
        />
      </GroupItem>
    </Form>
  );

  const items = [
    {
      type: formTypes.EDRPOU,
      text: 'ЄДРПОУ/ІПН',
    },
    {
      type: formTypes.PHONE,
      text: 'Телефон',
    },
  ];

  const forms = {
    [formTypes.EDRPOU]: <ByEdrpouForm />,
    [formTypes.PHONE]: <ByPhoneForm />,
  };

  return (
    <>
      <div id='mainForm' className={styles.mainForm}>
        <RadioGroup
          className={styles.radio}
          layout='horizontal'
          value={formType}
          displayExpr='text'
          valueExpr='type'
          onValueChanged={(e) => setFormType(e.value)}
          items={items}
        />
        <div className={styles.formContainer}>
          {forms[formType]}
        </div>
      </div>
      <LoadPanel visible={loading} showPane position={{ of: '#mainForm' }} />
    </>
  );
};

NewPartnerForm.propTypes = {
  onPartnerReady: PropTypes.func,
  onProcessingStart: PropTypes.func,
};


const defaultPartnerData = {
  id: '',
  phones: '',
  edrpou: '',
  name: '',
  name_full: '',
  inn: '',
  is_buyer: true,
  is_supplier: true,
  individual_legal: null,
  note: '',
};

const PartnerForm = forwardRef(({ disabled = false, ...props }, ref) => {
  const formData = useRef({
    ...defaultPartnerData,
    ...props.partner,
  });

  useEffect(() => {
    formData.current = { ...defaultPartnerData, ...props.partner };
    ref?.current?.instance.updateData(formData.current);
  }, [ props.partner ]);

  const allowEditing = !props.partner?.id;

  const partnerType = props.partner?.individual_legal;
  const partnerId = props.partner?.id;

  return (
    <div>
      <div className={styles.readOnlyFieldsContainer}>
        {partnerType &&
          <div className={styles.readOnlyField}>
            {`Форма: ${partnerType}`}
          </div>
        }
        {partnerId &&
          <div className={styles.readOnlyField}>
            {`Код: ${partnerId}`}
          </div>
        }
      </div>
      <Form
        ref={ref}
        className={disabled && styles.shadePanel}
        formData={formData.current}
        onFieldDataChanged={() => {
          ref?.current?.instance.validate();
        }}
        labelLocation={'left'}
        disabled={disabled}
        focusStateEnabled
        stylingMode={FORM_STYLING_MODE}
      >
        <GroupItem colCount={3}>
          <SimpleItem
            dataField='edrpou'
            label={{ text: 'Код ЄДРПОУ/ІПН Фізособи', location: 'top' }}
            activeStateEnabled
            editorOptions={{ readOnly: true, focusStateEnabled: false }}
          >
          </SimpleItem>
          <SimpleItem
            dataField='inn'
            colSpan={1}
            label={{ text: 'ИНН', location: 'top' }}
            editorOptions={{ readOnly: true, focusStateEnabled: false }}
          />
          <SimpleItem
            dataField='phones'
            colSpan={1}
            label={{ text: 'Телефон', location: 'top' }}
          />
        </GroupItem>

        <GroupItem>
          <SimpleItem
            dataField='name'
            label={{ text: 'Найменування' }}
            editorOptions={allowEditing ?
              null :
              { readOnly: true, focusStateEnabled: false }
            }
          >
            <RequiredRule />
          </SimpleItem>
          <SimpleItem
            dataField='name_full'
            label={{ text: 'Найменування повне' }}
            editorOptions={allowEditing ?
              null :
              { readOnly: true, focusStateEnabled: false }
            }
          />
        </GroupItem>

        <SimpleItem
          dataField='note'
          label={{ text: 'Коментар', location: 'top' }}
          editorType='dxTextArea'
          editorOptions={{
            spellcheck: false,
          }}
        />
      </Form>
    </div>
  );
});

PartnerForm.displayName = 'PartnerForm';

PartnerForm.propTypes = {
  partner: PropTypes.object,
  onFormValid: PropTypes.func,
  disabled: PropTypes.bool,
};

export const Partner = (props) => {
  const [ partner, setPartner ] = useState();
  const [ step, setStep ] = useState(1);
  const [ secondStepAvailable, setSecondStepAvailable ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const editFormRef = useRef();
  const scrollViewRef = useRef();

  const { isDesktop } = useDeviceType();

  const gqlClient = useApolloClient();

  const formDisabled = (props.newPartner && !partner) || !secondStepAvailable;

  useEffect(() => {
    if (props.newPartner) {
      setStep(1);
      setSecondStepAvailable(false);
      setPartner();
    } else if (props.partnerRef) {
      gqlClient.query({
        query: getPartner,
        variables: { ref: props.partnerRef },
      }).then((res) => {
        const partnerData = res?.data?.partners?.[0];
        if (partnerData) {
          setPartner(partnerData);
        } else {
          showError(messages.PARTNER_LOAD_FAILED);
        }
      });
    }
  }, [ props.newPartner, props.partnerRef ]);


  const position = { of: '#form' };

  const handlePartnerSave = async () => {
    if (!editFormRef.current.instance.validate().isValid) {
      showError(messages.HAS_INVALID_FIELDS);
      return;
    }
    const partnerData = editFormRef.current.instance.option('formData');
    const doctosave = _.cloneDeep(partnerData);
    const ref = doctosave.ref || uuid_v4();
    if (!doctosave._id) {
      doctosave._id = `cat.partners|${ref}`;
      doctosave.class_name = 'cat.partners';
    }
    if (doctosave.ref) delete doctosave.ref;
    if (!doctosave.name_full) {
      doctosave.name_full = doctosave.name;
    }

    setLoading(true);
    const res = await gqlClient.mutate({
      mutation: updatePartner,
      variables: { input: doctosave },
    });

    if (res.errors) {
      res.errors.forEach((err) => {
        showError(docBackValidationMsg(err?.message ?? '<невідомо>'));
      });
    } else {
      showSuccess(messages.DOC_SAVED);
      if (!partnerData.ref) partnerData.ref = ref;
      props.onSave?.(partnerData);
      props.onClose?.();
    }
    setLoading(false);
  };

  return (
    <Popup
      className={styles.popup}
      visible={props.visible}
      onHiding={props.onClose}
      dragEnabled
      closeOnOutsideClick
      showTitle
      fullScreen={!isDesktop}
      showCloseButton
      title={`Контрагент${props.newPartner ? ' (новый)' : ''}`}
      width='75%'
      maxWidth='700px'
      height='auto'
      maxHeight='100%'
    >
      <ScrollView ref={scrollViewRef}>
        <div className={styles.content}>
          <LoadPanel
            visible={loading}
            position={position}
            showIndicator
            shading
            showPane
          />

          {props.newPartner &&
            <div
              className={buildClass(styles.step, step === 1 && styles.active)}
            >
              <label>пошук</label>
              <NewPartnerForm
                onPartnerReady={(partner) => {
                  setPartner(partner);
                  setSecondStepAvailable(true);
                  setStep(2);

                  scrollViewRef.current.instance.scrollTo({
                    top: editFormRef.current.instance.element()
                      .getBoundingClientRect().top - 100,
                  });
                }}
                onProcessingStart={() => {
                  setSecondStepAvailable(false);
                  setPartner();
                  setStep(1);
                }}
              />
            </div>
          }
          <div
            className={buildClass(
              props.newPartner ? styles.step : styles.editForm,
              step === 2 && styles.active,
            )}
          >
            <label>заповнення інформації</label>
            <PartnerForm
              ref={editFormRef}
              partner={partner}
              disabled={props.newPartner && formDisabled}
            />
          </div>
          <div className={styles.buttons}>
            <Button
              className='otk-normal-button'
              text='Зберегти і закрити'
              icon='save'
              disabled={!partner || loading}
              onClick={handlePartnerSave}
            />
          </div>
        </div>
      </ScrollView>
    </Popup>
  );
};

Partner.propTypes = {
  partnerRef: PropTypes.string,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  newPartner: PropTypes.bool,
  visible: PropTypes.bool,
};

