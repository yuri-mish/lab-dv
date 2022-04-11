import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { LoadPanel } from 'devextreme-react/load-panel';
import { useApolloClient } from '@apollo/client';

import {
  Popup,
  Menu,
  ValidationGroup,
  ScrollView,
} from 'devextreme-react';

import styles from '../styles/ep-main.module.scss';

//components
import { PopupFormsAdapter } from '../components/popup-forms-adapter';

import {
  DocInfoBar,
  StickyBar,
} from 'components';

import { codesCheck } from 'utils/codes-check';

import { mockText } from 'moks/moksData';

import { getOrderData, getBuyersOrderData, getBranchData,
  saveFormData, getLabAddress, getLastCO2 } from './backend-data';

//parts
import { TopContent } from './partTopContent';
import { Auto } from './partAuto';
import { InspectConditions } from './partInspectConditions';
import { Files } from './partFiles';
import { Forms } from './partForms';
import { Confirm } from './partConfirm';

export const EpCO2Form = () => {
  const history = useHistory();
  const gqlClient = useApolloClient();
  const search = useLocation().search;
  const order_ref = new URLSearchParams(search).get('order_ref');
  const order_services = new URLSearchParams(search).get('s');
  const { id } = useParams();
  const isNewDoc = id === 'new';
  const printRef = useRef();
  const groupRef = useRef();
  const saveRef = useRef();
  const [ loading, setLodading ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ popupData, setPopupData ] = useState('');
  const [ pdfLoading, setPdfLoading ] = useState(false);
  const [ blockBtn, setBlockBtn ] = useState(false);
  const [ data, setData ] = useState({
    conclusion: false,
    partner: null,
    draft: true,
    type: 'CO2',
    order: {},
    codes_mismatch: '',
  });
  const handlePdfLoading = (val = false) => {
    setPdfLoading(val);
  };
  const codes_mismatch = codesCheck({
    data,
    fildsToCheck: [
      [
        {
          text: 'Характеристики негативного впливу на ' +
            'навколишнє природне середовище',
          field: 'co2_environmental_impact',
        },
      ],
    ],
  });

  useEffect(() => {
    codes_mismatch && setData((prev) => ({
      ...prev,
      conclusion: false,
      codes_mismatch,
    }));
  }, [ codes_mismatch ]);

  const handleFormSave = async ({ draft = true }) => {
    setBlockBtn(true);
    setLodading(true);
    await saveFormData({ draft, data, setData, gqlClient,
      isNewDoc, history }).finally(() => {
      setBlockBtn(false);
      setLodading(false);
    });
  };

  useEffect(() => {
    getBranchData({ gqlClient, setData });
    getLastCO2({ gqlClient, setData });
    if (order_ref && order_services) {
      getBuyersOrderData({ ref: order_ref, s: order_services, setData });
    }
    if (!isNewDoc) {
      setLodading(true);
      getOrderData({ ref: id, setData, gqlClient })
        .finally(() => setLodading(false));
    }
  }, []);
  useEffect(() => {
    getLabAddress({ suffix: data?.suffix, gqlClient, setData });
  }, [ data?.suffix ]);
  useEffect(() => {
    if (data?.category_KTZ_text?.startsWith('O') && isNewDoc) {
      setData((prev) => ({
        ...prev,
        fuel_type: 'Без топлива',
      }));
    }
    // якщо  Категорія КТЗ - починається з символа "О", змінюємо паливо
  }, [ data?.category_KTZ_text ]);

  const handleFieldValueChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.element.id]: e.event?.target?.value || e?.value,
      co2_environmental_impact: (e.element.id === 'fuel_type' &&
        data?.co2_environmental_impact) ? null : prev?.co2_environmental_impact,
    }));
    // обнуляєм дані форми перевірки коли змінюється поле "Паливо"-"fuel_type"
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

  const handleSubmit = () => {
    const validate = groupRef?.current?.instance?.validate();
    if (validate?.status === 'valid') {
      confirm(mockText?.confirm, `Висновок: "${data?.conclusion ?
        'Відповідає' : 'Не відповідає'}"`).then((dialogResult) => {
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
            first_registration_date = {data?.first_registration_date || ''}
            handleChange={handleChangeCheckItemData}
            handlePopupClose={handlePopupClose}
          />
        </ScrollView>
      </Popup>
      <StickyBar>
        <DocInfoBar
          name={`Електроний протокол "${data?.type}" `}
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
              disabled: !data.draft || blockBtn,
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
              disabled: !data.draft || blockBtn,
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
            <TopContent
              data={data}
              setData={setData}
              handleFieldValueChange={handleFieldValueChange}
            />
            <Auto
              data={data}
              setData={setData}
              handleFieldValueChange={handleFieldValueChange}
            />
            <InspectConditions
              data={data}
              setData={setData}
              handleFieldValueChange={handleFieldValueChange}
            />
            <Files data={data} setData={setData} />
            <Forms data={data} handleCheckItem={handleCheckItem} />
            <Confirm
              data={data}
              printRef={printRef}
              saveRef={saveRef}
              codes_mismatch={codes_mismatch}
              blockBtn={blockBtn}
              handleFieldValueChange={handleFieldValueChange}
              handlePdfLoading={handlePdfLoading}
              handleFormSave={handleFormSave}
              handleSubmit={handleSubmit}
            />
          </ValidationGroup>
        </ScrollView>
      </div>
    </div>
  );
};
