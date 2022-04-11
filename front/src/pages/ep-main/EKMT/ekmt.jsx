import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useDate } from 'hooks';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { LoadPanel } from 'devextreme-react/load-panel';
import dayjs from 'dayjs';
import { v4 as uuid_v4 } from 'uuid';
import { useApolloClient } from '@apollo/client';
import { filterObj } from 'utils/filtfunc';
import { textAddress } from 'utils/text-address';
import {
  showError,
} from 'utils/notify.js';
import { messages } from 'messages';

import {
  Popup,
  Menu,
  Button,
  ValidationSummary,
  ValidationGroup,
  ScrollView,
} from 'devextreme-react';


import styles from '../styles/ep-main.module.scss';
//components
import { DocInfoBar, StickyBar } from 'components';
import { PopupFormsAdapter } from '../components/popup-forms-adapter';
//parts
import { PartOne } from './part1';
import { PartTwo } from './part2';
import { PartFiles } from './partFiles';
import { PartForms } from './partForms';
import { PartConfirm } from './partConfirm';

const PrintPDFbtn =
  React.lazy(() => import('../components/print/printTahograph'));

import { mockText } from 'moks/moksData';

import { loader } from 'graphql.macro';

const getEpOtkOrders = loader('../gql/getEpOtkOrders.graphql');
const updateEpOtkOrder = loader('../gql/updateEpOtkOrder.graphql');
const getEpBranch = loader('../gql/getBranch.graphql');
const getBuyersOrders = loader('../gql/getBuyersOrders.graphql');
const getAdressLab = loader('../gql/getAddressLab.graphql');


export const EKMT = () => {
  const history = useHistory();
  const gqlClient = useApolloClient();
  const search = useLocation().search;
  const order_ref = new URLSearchParams(search).get('order_ref');
  const order_services = new URLSearchParams(search).get('s');
  const { id } = useParams();
  const isNewDoc = id === 'new';
  const printRef = useRef();
  const groupRef = useRef();
  const [ loading, setLoading ] = useState(true);
  const { today, formatDate } = useDate();
  const [ blockBtn, setBlockBtn ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ popupData, setPopupData ] = useState('');
  const [ pdfLoading, setPdfLoading ] = useState(false);
  const [ data, setData ] = useState({
    partner: null,
    draft: true,
    type: 'EKMT',
    order: {},
  });
  const handlePdfLoading = (val = false) => {
    setPdfLoading(val);
  };
  const handleFieldValueChange = (e) => {
    if (e.element.id === 'car_number' || e.element.id === 'vin') {
      setData((prev) => ({
        ...prev,
        [e.element.id]: e.event?.target?.value.toUpperCase() ||
          e?.value.toUpperCase(),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.element.id]: e.event?.target?.value || e?.value,
      }));
    }
  };
  const handleDateChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.element.id]: formatDate(e.value),
    }));
  };

  const handleChangeCheckItemData = (value) => {
    setData((prev) => ({
      ...prev,
      [popupData.target]: value,
    }));
  };
  const handleCheckItem = (item) => {
    setDialogOpen(true);
    setPopupData({ title: item?.text, target: item?.field });
  };

  const handlePopupClose = () => {
    setDialogOpen(false);
  };

  const getBranch = () => {
    gqlClient
      .query({
        query: getEpBranch,
        variables: { ref: '' },
      })
      .then((response) => {
        const res = response?.data?.branch;
        if (res) {
          setData((prev) => ({
            ...prev,
            suffix: res?.jsb?.suffix,
          }));
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
  };

  const handleGetOrder = ({ ref = '', s = 0 }) => {
    gqlClient
      .query({
        query: getBuyersOrders,
        variables: { ref },
      })
      .then((response) => {
        const res = response?.data?.buyers_orders[0];
        if (res) {
          setData((prev) => ({
            ...prev,
            partner: res?.partner,
            order: {
              number_doc: res?.number_doc,
              ref: res?.ref,
            },
            authorized_person: res?.ClientPerson ?? '',
            phone: res?.ClientPersonPhone ?? '',
            vin: res?.services[s]?.vin_code?.toUpperCase() ?? '',
            car_number: res?.services[s]?.gos_code?.toUpperCase() ?? '',
            category_KTZ: res?.services[s]?.nom?.ref ?? '',
            category_KTZ_text: res?.services[s]?.nom?.name ?? '',
          }));
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
  };
  const handleGetData = async ({ ref = '' }) => {
    setLoading(true);
    await gqlClient
      .query({
        query: getEpOtkOrders,
        variables: { ref },
      })
      .then((response) => {
        const res = response?.data?.getEPOTK[0];
        if (res) {
          setData({
            _id: res?._id,
            ref: res?.ref,
            date: res?.date,
            caption: res?.caption,
            number_doc: res?.number_doc,
            ...res?.body,
          });
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
    setLoading(false);
  };
  const getLastTaho = async () => {
    setLoading(true);
    await gqlClient
      .query({
        query: getEpOtkOrders,
        variables: { ref: '', sort: { selector: 'date', desc: 'true' },
          jfilt: filterObj([ 'order_type', '=', 'Taho' ]) },
        limit: 1,
      })
      .then((response) => {
        const res = response?.data?.getEPOTK?.[0];
        if (res) {
          setData((prev) => ({
            ...prev,
            workshop_card: res?.body?.workshop_card || '',
          }));
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
    setLoading(false);
  };
  const getLabAdress = async () => {
    const numLab = Number.parseInt(data?.suffix) || undefined;
    await gqlClient
      .query({
        query: getAdressLab,
        variables: { labNumbers: [ numLab ] },
      })
      .then((response) => {
        const data = response?.data?.getLab?.[0]?.contacts?.address;
        if (data) {
          const address = textAddress({ data });
          setData((prev) => ({
            ...prev,
            tachograph_service: address,
          }));
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
  };
  const handleFormSave = async ({ draft = true }) => {
    const docToSave = {};
    const saveUuid = data?.ref || uuid_v4();
    docToSave._id = data?._id || `doc.ep|${saveUuid}`;
    docToSave.class_name = 'doc.ep';
    docToSave.date = data?.date || dayjs().format();
    docToSave.partner = data?.partner?.ref;
    docToSave.order_type = data?.type;
    docToSave.body = { ...data, draft };
    try {
      setBlockBtn(true);
      const response = await gqlClient.mutate({
        mutation: updateEpOtkOrder,
        variables: { input: docToSave },
      });
      setData((prev) => ({
        ...prev,
        draft,
      }));
      if (isNewDoc) {
        history.push({ pathname: `/ep-ekmt/${saveUuid}` });
        handleGetData({ ref: saveUuid });
      }

      if (!response?.errors) {
        notify('Успішно збережено !!!', 'success', 800);
      }
      if (response?.errors) {
        response.errors.forEach((err) => {
          if (err?.message) {
            showError(`Помилка запису: ${err.message}`);
          }
        });
        return Promise.reject('back validation error');
      }
      setBlockBtn(false);
    } catch (error) {
      setBlockBtn(false);
      notify(error?.message, 'error', 1600);
    }

    return Promise.resolve(saveUuid);
  };
  const handleSubmit = () => {
    const validate = groupRef?.current?.instance?.validate();
    if (validate?.status === 'valid') {
      confirm(mockText?.confirm, 'Тахограф').then((dialogResult) => {
        dialogResult && handleFormSave({ draft: false });
      });
    } else if (validate?.brokenRules) {
      let mes = '';
      validate?.brokenRules?.forEach((item) => {
        mes += `${item?.message }\n`;
      });
      notify(mes, 'error', 2000);
    }
  };
  useEffect(async () => {
    await getBranch();
    if (order_ref) {
      await handleGetOrder({ ref: order_ref, s: order_services });
    }
    if (!isNewDoc) {
      await handleGetData({ ref: id });
    }
    setLoading(false);
  }, []);

  useEffect(async () => {
    if (isNewDoc) {
      getLabAdress();
      getLastTaho();
    }
  }, [ data?.suffix ]);

  return (
    <div>
      <Popup
        visible={dialogOpen}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showCloseButton={true}
        onHiding={handlePopupClose}
        showTitle={true}
        title={popupData?.title || ''}
        width="85%"
        height="95%"
      >
        <ScrollView width="100%" height="100%">
          <PopupFormsAdapter
            target={popupData?.target}
            data={data[popupData?.target] || {}}
            blocked={!data?.draft}
            number_doc={data?.number_doc || ''}
            category_KTZ={data?.category_KTZ_text || ''}
            fuel_type = {data?.fuel_type || ''}
            cylinders = {data?.cylinders || ''}
            manufacture_date = {data?.manufacture_date || ''}
            handleChange={handleChangeCheckItemData}
            handlePopupClose={handlePopupClose}
          />
        </ScrollView>
      </Popup>
      <StickyBar>
        <DocInfoBar
          name='Електроний протокол "Тахограф" '
          data={{
            date: data.date,
            number: data.number_doc,
          }}
          loading={loading}
          isNew={isNewDoc}
        >
          {!data.draft &&
              <div className={'otk-tag otk-status-warning'}>
                <div className='dx-icon-warning'></div>
                &nbsp;Документ тільки для перегляду
              </div>
          }
        </DocInfoBar>
        <Menu
          onItemClick={(e) => {
            if (e.itemData.id === 'close') {
              history.push({ pathname: '/ep' });
            }
            if (e.itemData.id === 'edit') {
              handleFormSave({ draft: true });
            }
            if (e.itemData.id === 'save') {
              handleSubmit();
            }
            if (e.itemData.id === 'print') {
              printRef?.current?.props?.onClick();
            }
          }}
          dataSource={[
            {
              text: 'Зберегти(чорновик)',
              id: 'edit',
              icon: 'edit',
              disabled: !data.draft,
            },
            {
              text: 'Закрити',
              id: 'close',
              icon: 'close',
            },
            {
              text: 'Зберегти(чистовик)',
              id: 'save',
              icon: 'save',
              disabled: !data.draft,
            },
            {
              text: 'Друк',
              id: 'print',
              icon: 'print',
            },
          ]}
        />
      </StickyBar>
      <div className={`${styles?.ep_main_content_block} dx-card`}>
        <ScrollView>
          <LoadPanel
            height={100}
            width={250}
            message={'load'}
            visible={pdfLoading}
            position={'center'}
          />
          <ValidationGroup ref={groupRef}>
            <PartOne
              data={data}
              today={today}
              setData={setData}
              handleFieldValueChange={handleFieldValueChange}
              handleDateChange={handleDateChange}
            />
            <PartTwo
              data={data}
              today={today}
              handleFieldValueChange={handleFieldValueChange}
              handleDateChange={handleDateChange}
            />
            <PartFiles
              data={data}
              setData={setData}
            />
            <PartForms
              data={data}
              handleCheckItem={handleCheckItem}
            />
            <PartConfirm
              data={data}
              handleFieldValueChange={handleFieldValueChange}
            />
            <ValidationSummary id="summary" />
            <div className={`${styles?.df_space_around} ${styles?.df_wrap} 
            ${styles?.mr_wrap}`}>
              <Button
                icon="edit"
                onClick={() => {
                  handleFormSave({ draft: true });
                }}
                text={mockText.draft_btn}
                disabled={!data.draft || blockBtn}
              />
              <Button
                icon="save"
                onClick={handleSubmit}
                text={mockText.save_btn}
                disabled={!data.draft || blockBtn}
              />
              <Suspense fallback={<div>Loading...</div>}>
                <PrintPDFbtn forwardedRef={printRef} data={{ ...data }}
                  handlePdfLoading = {handlePdfLoading} />
              </Suspense>
            </div>
          </ValidationGroup>
        </ScrollView>
      </div>
    </div>
  );
};
