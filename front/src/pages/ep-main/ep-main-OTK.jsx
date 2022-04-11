import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useDate } from '../../hooks';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { LoadPanel } from 'devextreme-react/load-panel';
import dayjs from 'dayjs';
import { v4 as uuid_v4 } from 'uuid';
import { useApolloClient } from '@apollo/client';
import { filterObj } from 'utils/filtfunc';
import {
  showError,
} from 'utils/notify.js';
import { messages } from 'messages';

import {
  Popup,
  Menu,
  TextBox,
  TextArea,
  Button,
  DateBox,
  SelectBox,
  TagBox,
  RadioGroup,
  ValidationSummary,
  ValidationGroup,
  ScrollView,
  Tooltip,
  CheckBox,
} from 'devextreme-react';

import Validator, {
  RequiredRule,
  PatternRule,
  StringLengthRule,
  RangeRule,
} from 'devextreme-react/validator';

import styles from './styles/ep-main.module.scss';
//components
import { FormField } from 'components/form-field/form-field';
import { TextLine } from './components/text-line';
import { ColumnField } from './components/column-field';
import { CheckItem } from './components/check-item';
import { PartnerSearch } from 'components/partner-search/partner-search';
import { PopupFormsAdapter } from './components/popup-forms-adapter';
import {
  SingleImageFileUploader,
  DocInfoBar,
  StickyBar,
} from 'components';
import { CarNumSearch } from 'components/car-num-search/car-num-search';

const PrintPDFbtn = React.lazy(() => import('./components/print/printPDF'));

import { codesCheck } from 'utils/codes-check';

import {
  mockText,
  fuel_type_list,
  turbine_compressor_list,
  ecological_list,
  check_items_list,
  check_items_addition_list,
  inspectors_list,
  conclusion_list,
  file_img_types,
  file_accept,
  purpose_list,
  car_color_list,
  re_equipment_name_list,
  check_list_KTZ,
} from 'moks/moksData';
import { pNum, pNum_3_3, pTemperature, pNum_2_1, pNum_3_1,
  pVINCode_1, pVINCode_2 } from 'moks/patterns';
import { dateShortFormatL } from 'utils/date-formats';
import { loader } from 'graphql.macro';

const getEpOtkOrders = loader('./gql/getEpOtkOrders.graphql');
const updateEpOtkOrder = loader('./gql/updateEpOtkOrder.graphql');
const getEpBranch = loader('./gql/getBranch.graphql');
const getNoms = loader('./gql/getNoms.graphql');
const getBuyersOrders = loader('./gql/getBuyersOrders.graphql');
const getAddressLab = loader('./gql/getAddressLab.graphql');
const getBrands = loader('./gql/getCarBrands.graphql');

const BLANKS_BUCKET_URL = process.env.REACT_APP_BLANKS_BUCKET_URL;


import { required } from 'pages/ep-main/constants';
import { maxFileSize2MB } from 'app-constants';
import { textAddress } from 'utils/text-address';

export const EPMainForm = () => {
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
  const { today, formatDate } = useDate();
  const [ loading, setLoading ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ popupData, setPopupData ] = useState('');
  const [ category_KTZ_list, setCategory_KTZ_list ] = useState([]);
  const [ pdfLoading, setPdfLoading ] = useState(false);
  const [ blockBtn, setBlockBtn ] = useState(false);
  const [ tooltipVisible, setTooltipVisible ] = useState(false);
  const [ validateVINLenth, setValidateVINLenth ] = useState(true);
  const [ brandList, setBrandList ] = useState([]);
  const [ data, setData ] = useState({
    conclusion: false,
    partner: null,
    draft: true,
    type: 'ОТК',
    order: {},
    codes_mismatch: '',
  });
  const handlePdfLoading = (val = false) => {
    setPdfLoading(val);
  };
  const handleOnSerchCar = (data) => {
    if (data) {
      setData((prev) => ({
        ...prev,
        car_brand: data?.car_brand || '',
        car_color: data?.car_color || '',
        vin: data?.vin || '',
        manufacture_date: data?.manufacture_date || '',
        carrying: data?.carrying?.toString() || '',
        fuel_type: data?.fuel_type || '',
        car_model: data?.car_model || '',
      }));
    }
  };
  //отримуємо коди невідповідності з форм перевірок
  //значення виводимо на форму "Коди невідповідносі" в самому низу форми
  const codes_mismatch = codesCheck({
    data,
    fildsToCheck: [
      check_items_list,
      check_items_addition_list,
      [
        {
          text: 'Перевірка рівня зовнішнього шуму.',
          field: 'noise_level',
        },
      ],
    ],
  });
  //показуємо\приховуємо тултіп з опиом вибраної категорії "Категорія КТЗ"
  const toggleVisible = () => {
    setTooltipVisible(!tooltipVisible);
  };
  // отримуємо дані з Бекенду
  // список категорій "Категорія КТЗ" для селекту
  const getNomsData = () => {
    gqlClient
      .query({
        query: getNoms,
        variables: { options: { selectServices: true } },
      })
      .then((response) => {
        const res = response?.data?.noms;
        if (res) {
          // фільтруємо отримані значення щоб виводились тільки категорії:
          // 'M1', 'M2', 'M3', 'N1', 'N2', 'N3', 'O1', 'O2', 'O3', 'O4',
          const resFiltered =
            res?.filter((item) => check_list_KTZ?.includes(item?.name)) || [];
          setCategory_KTZ_list(
            resFiltered?.map((item) => ({
              text: item.name,
              // значення description виводиться в тултіп для опису категорії
              description: item.name_full,
              value: item.ref,
            })),
          );
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
  };
  // отримуємо дані з Бекенду
  // значеня suffix  відображаємо у:
  // "Номер у реєстрації суб`єктів ОТК та номер дільниці"
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
  // отримуємо дані з Бекенду - адресу лабораторії
  const getLabAddress = async () => {
    // номер лабораторії переводимо в число
    const numLab = Number.parseInt(data?.suffix) || undefined;
    await gqlClient
      .query({
        query: getAddressLab,
        variables: { labNumbers: [ numLab ] },
      })
      .then((response) => {
        const data = response?.data?.getLab?.[0]?.contacts?.address;
        if (data) {
          // формуємо з обєкта адреси текстову строку
          const address = textAddress({ data });
          // записуємо в дані в стейт поле city - відображається в:
          // "Місце проведення"
          setData((prev) => ({
            ...prev,
            city: address,
          }));
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
  };
  // отримуємо дані з Бекенду - останій протокол типу ОТК
  // отримані дані задаємо для полів: "Перевірку провели"
  const getLastOTK = async () => {
    setLoading(true);
    await gqlClient
      .query({
        query: getEpOtkOrders,
        variables: { ref: '', sort: { selector: 'date', desc: 'true' },
          jfilt: filterObj([ 'order_type', '=', 'ОТК' ]) },
        limit: 1,
      })
      .then((response) => {
        const res = response?.data?.getEPOTK?.[0];
        if (res) {
          // задаємо значення для полів: "Перевірку провели"
          // inspector_1_name - [1] Ініціали, прізвище
          // inspector_1_position - ТКД, ЗТКД, посада
          setData((prev) => ({
            ...prev,
            inspector_1_name: res?.body?.inspector_1_name || '',
            inspector_2_name: res?.body?.inspector_2_name || '',
            inspector_3_name: res?.body?.inspector_3_name || '',
            inspector_1_position: res?.body?.inspector_1_position || '',
            inspector_2_position: res?.body?.inspector_2_position || '',
            inspector_3_position: res?.body?.inspector_3_position || '',
          }));
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
    setLoading(false);
  };
  // отримуємо дані з Бекенду - шукаємо протокол по номеру авто
  // потріно для того щоб отримати дані пробігу авто
  const getOTKbyCarNumber = async () => {
    setLoading(true);
    await gqlClient
      .query({
        query: getEpOtkOrders,
        variables: { ref: '', sort: { selector: 'date', desc: 'true' },
          jfilt: [
            { fld: 'car_number', expr: '=',
              val: data?.car_number?.toUpperCase() },
          ] },
        limit: 1,
      })
      .then((response) => {
        const res = response?.data?.getEPOTK?.[0];
        if (res) {
          // значення прогігу авто записуємо в поле "Попередній пробіг"
          setData((prev) => ({
            ...prev,
            preliminary_mileage: res?.body?.odometer || '',
          }));
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
    setLoading(false);
  };
  const getBrandsData = () => {
    gqlClient
      .query({
        query: getBrands,
        variables: {},
      })
      .then((response) => {
        const res = response?.data?.car_brand;
        if (res) {
          console.log('getBrands', res);
          setBrandList(res?.map((item) => item?.name) || []);
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
  };
  // отримуємо дані з Бекенду - ящко сворюємо протокол на основі замовлення
  // ref - передаємо ід замовлення
  // s - номер запису в таблиці замовлень, по ньому отримуємо інформацію
  // конкретного запису в таблиці
  const handleGetOrder = ({ ref = '', s = 0 }) => {
    gqlClient
      .query({
        query: getBuyersOrders,
        variables: { ref },
      })
      .then((response) => {
        const res = response?.data?.buyers_orders?.[0];
        if (res) {
          // записуємо дані з таблиці в локальний стейт
          setData((prev) => ({
            ...prev,
            partner: res?.partner,
            // дані використовуємо для посилання на заказ
            // "Заказ №_ДА-0001-000083"
            order: {
              number_doc: res?.number_doc,
              ref: res?.ref,
            },
            vin: res?.services[s]?.vin_code?.toUpperCase() ?? '',
            car_number: res?.services[s]?.gos_code?.toUpperCase() ?? '',
            category_KTZ: res?.services[s]?.nom?.ref ?? '',
            category_KTZ_text: res?.services[s]?.nom?.name ?? '',
          }));
        } else {
          showError(messages?.DATA_LOAD_FAILED);
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
  };
  // отримуємо дані протоколу по ід коли відкриваємо стоврений протокол
  const handleGetData = async ({ ref = '' }) => {
    setLoading(true);
    await gqlClient
      .query({
        query: getEpOtkOrders,
        variables: { ref },
      })
      .then((response) => {
        const res = response?.data?.getEPOTK?.[0];
        console.log(res);
        if (res) {
          setData({
            _id: res?._id,
            ref: res?.ref,
            date: res?.date,
            caption: res?.caption,
            number_doc: res?.number_doc,
            ...res?.body,
            car_brand: res?.body?.car_brand?.toUpperCase(),
          });
        } else {
          showError(messages?.DATA_LOAD_FAILED);
        }
      })
      .catch(() => {
        showError(messages?.DATA_LOAD_FAILED);
      });
    setLoading(false);
  };
  // при зміні даних в полі codes_mismatch - "Коди невідповідносі"
  // змінюємо поле "Висновок" conclusion
  //якщо поле не пусте то "Висновок" => "Не відповідає"
  useEffect(() => {
    codes_mismatch && setData((prev) => ({
      ...prev,
      conclusion: false,
      codes_mismatch,
    }));
  }, [ codes_mismatch ]);
  // зберігаємо зміни
  // формуємо дані для відправки на бекенд
  // поле draft - відповідає за то чи протокол буде збережено
  //як "чорновик"\"чистовик" по замовчуваню зберігаємо як "чорновик"
  const handleFormSave = async ({ draft = true }) => {
    // формуємо дані для відправки
    const docToSave = {};
    const saveUuid = data?.ref || uuid_v4();
    docToSave._id = data?._id || `doc.ep|${saveUuid}`;
    docToSave.class_name = 'doc.ep';
    docToSave.date = data?.date || dayjs().format();
    docToSave.partner = data?.partner?.ref;
    docToSave.order_type = data?.type;
    docToSave.car_number = data?.car_number?.toUpperCase();
    docToSave.vin = data?.vin?.toUpperCase();
    docToSave.body = { ...data, draft };
    try {
      // блокуємо клік по кнопці збереження даних
      setBlockBtn(true);
      // відправляємо запрос на зберігання
      const response = await gqlClient.mutate({
        mutation: updateEpOtkOrder,
        variables: { input: docToSave },
      });
      // вписуємо значення поля draft - "чорновик"\"чистовик", в локальний стейт
      // якщо draft=false (чистовик) - то всі поля перейдуть
      // в стан disabled чи readOnly
      setData((prev) => ({
        ...prev,
        draft,
      }));
      // якщо це новий документ (id === 'new';)
      if (isNewDoc) {
        // переходимо на сторінку для подальшого редагування
        // saveUuid - поле по якому отримуємо збережені дані
        history.push({ pathname: `/ep/${saveUuid}` });
        // отримуємо дані протоколу
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
      // розблоковуємо клік по кнопці збереження даних
      setBlockBtn(false);
    } catch (error) {
      // розблоковуємо клік по кнопці збереження даних якщо відбулась помилка
      setBlockBtn(false);
      notify(error?.message, 'error', 1600);
    }
    return Promise.resolve(saveUuid);

  };
  // при першій загрузці сторінки
  useEffect(() => {
    // отримуємо список категорій для селекту "Категорія КТЗ"
    getNomsData();
    // отримуємо дані поля: "Номер у реєстрації суб`єктів ОТК та номер дільниці"
    getBranch();
    // отримуємо дані - адресу лабораторії
    getLabAddress();
    // отримуємо дані останього протокол типу ОТК
    // необхідно для отримання даних для полів: "Перевірку провели" - щоб
    // не вводити їх кожен раз
    getLastOTK();
    // отримуємо список брендів авто
    getBrandsData();
    // перевіряємо чи сворюємо протокол на основі замовлення:
    // присутні відповідні праметри в URL
    // order_ref, order_services - отримані з URLSearchParams
    if (order_ref && order_services) {
      // отримуємо дані замовлення по значеню полів order_ref, order_services
      handleGetOrder({ ref: order_ref, s: order_services });
    }
    // якщо це не новий протокол підтягуємо дані протоколу з Бекенду
    if (!isNewDoc) {
      handleGetData({ ref: id });
    }
  }, []);
  // якщо змінились дані номеру лабораторії - тоді отримуємо дані адреси
  // (дані лабораторії можемо отримати пізніше чим намагаємось отримати адресу)
  useEffect(() => {
    getLabAddress();
  }, [ data?.suffix ]);
  // якщо змінилось значеня поля "Категорія КТЗ"
  useEffect(() => {
    // перевіряємо якщо ктегорія починається O - потрібно щоб спрацьовувало для
    // категорій O1, O2, O3, 04 ...
    // задаєм зачення для поля "Паливо" - 'Без топлива'
    if (data?.category_KTZ_text?.startsWith('O')) {
      setData((prev) => ({
        ...prev,
        fuel_type: 'Без топлива',
      }));
    }
  }, [ data?.category_KTZ_text ]);
  // при зміні поля "Державний реєстраційний номер" - data?.car_number
  // якщо в нас новий протокол тоді шукаємо протокол по номеру авто
  // і задаємо значення для поля "Попередній пробіг" - з поля "Одометр (км)".
  useEffect(() => {
    if (id === 'new')getOTKbyCarNumber();
  }, [ data?.car_number ]);
  // функція для запису даних з полів в локальний стейт, при їхній зміні
  const handleFieldValueChange = (e) => {
    // по атрибуду id оприділяємо в яке поле локального стейту
    // буде записуватись значеня.
    setData((prev) => ({
      ...prev,
      [e.element.id]: e.event?.target?.value || e?.value,
      // якщо змінилось поле "Паливо" то обнуляємо дані для форми перевірки
      //"Характеристики негативного впливу на навколишнє природне середовище"
      // якщо там є збережені дані.
      // залежно від типу палива в формі перевірки можуть відображаються різні
      // поля для вводу норм і їх перевірки - тому потрібно дані обнулити
      // щоб в пдф відобразились тільки дані для відповідного типу палива.
      environmental_impact: (e.element.id === 'fuel_type' &&
        data?.environmental_impact) ? null : prev?.environmental_impact,
    }));
  };
  // використовуємо при зміні даних поля "VIN"
  const handleVINValueChange = (e) => {
    //записуємо введене значення в зміну, вдаляємо символи io, приводимо все до
    // верхнього регістру
    const val = (e.event?.target?.value || e?.value)
      ?.replaceAll(/[ioіо ]/gi, '').toUpperCase();
    // записуємо значеня в локальний стейт
    setData((prev) => ({
      ...prev,
      [e.element.id]: val,
    }));
    // якщо довжина не попадає в норми то по токазуємо вікно з підтвердженям від
    // користувача, залежно від вибору валідуємо\не валідуємо довжину поля "VIN"
    if (val.length !== 0 && val.length !== 17) {
      confirm('Ви підтверджуєте ввід Більше/Меньше 17 символів?',
        `VIN складає ${val?.length} - символів`).then((dialogResult) => {
        dialogResult ? setValidateVINLenth(false) : setValidateVINLenth(true);
      });
    }
  };
  // використовуємо при зміні даних поля "Категорія КТЗ"
  const handleSelectionChanged = (e) => {
    setData((prev) => ({
      ...prev,
      //задаємо імя поля залежно від ід
      [e.element.id]: e?.selectedItem?.value || '',
      //записуємо текстове значення потрібно для пдф і деяких інших перевірок
      [`${e.element.id}_text`]: e?.selectedItem?.text || '',
      //записуємо опис категорії для підсказки (тултіп)
      [`${e.element.id}_description`]: e?.selectedItem?.description || '',
      //занулюємо значення поля "Вантажопідйомність (т.)" - за лежно від
      //категорії воно може бути не активним
      carrying: '',
    }));
  };
  // використовуємо при зміні значеня полів з датами
  const handleDateChange = (e) => {
    setData((prev) => ({
      ...prev,
      // якщо змінилось поле "Дата першої державної реєстрації"
      // то обнуляємо дані для форми перевірки
      //"Характеристики негативного впливу на навколишнє природне середовище"
      // якщо там є збережені дані. (по тій самій причині як і для палива)
      environmental_impact: (e.element.id === 'first_registration_date' &&
      data?.environmental_impact) ? null : prev?.environmental_impact,
      [e.element.id]: formatDate(e.value),
    }));
  };
  //використовуємо для зберігання даних з форм перевірок:
  // "Результати перевірки", "Перевірка рівня зовнішнього шуму",
  // "Додаток до протоколу" - в локальний стейт
  // popupData.target - визначає в яке поле локального стейту будуть
  // записані дані
  const handleChangeCheckItemData = (value) => {
    setData((prev) => ({
      ...prev,
      [popupData.target]: value,
    }));
  };
  // спрацьовує при кліку по одній з форм перевірок ("Двигун та його системи",
  // "Захисні пристрої", ...)
  const handleCheckItem = (item) => {
    // відкриває попап
    setDialogOpen(true);
    // задаємо дані які мають відобразитись в попапі
    // title - заголовок попапу
    // target - оприділяє контент в середені попапу
    setPopupData({ title: item?.text, target: item?.field });
  };
  // закриває попап
  const handlePopupClose = () => {
    setDialogOpen(false);
  };
  // спрацьовує при кліку на кнопку "Зберегти як чистовик"
  const handleSubmit = () => {
    // перевіряємо\валідуємо поля по атрибуту ref={groupRef}
    const validate = groupRef?.current?.instance?.validate();
    //якщо валідація успішна питаєм користувача чи він дійсно хоче зберегти
    // протокол як чистовик
    // handleFormSave({ draft: false }); => зберігаєм як чистовик
    if (validate?.status === 'valid') {
      confirm(mockText?.confirm, `Висновок: "${data?.conclusion ?
        'Відповідає' : 'Не відповідає'}"`).then((dialogResult) => {
        dialogResult && handleFormSave({ draft: false });
      });
    //якщо валідація не успішна формуємо повідомлення з полями які
    // не пройшли валідацію
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
            ecological= {data?.ecological || ''}
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
            if (e.itemData.id === 'globe') {
              history.push({ pathname: `/ep-dio/${id}` });
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
              text: 'Диотрейд',
              id: 'globe',
              icon: 'globe',
              disabled: isNewDoc,
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
            <div className={`${styles?.df_space_between} ${styles?.df_wrap}`}>
              <div className={styles?.mr_right}>
                <p>{`${mockText.line_1} ${data?.suffix || ''}`}</p>
                <div>
                  <FormField text={mockText?.line_city}>
                    <TextBox
                      id={'city'}
                      value={data?.city}
                      stylingMode={'outlined'}
                      onValueChanged={handleFieldValueChange}
                      width={'300px'}
                      readOnly={!data.draft || true}
                    >
                      <Validator>
                        <RequiredRule
                          message={`${mockText?.line_city} - ${required}`}
                        />
                      </Validator>
                    </TextBox>
                  </FormField>
                </div>
                <p> {`${mockText?.line_type} ${data?.type}`}</p>
              </div>
              <div>
                <p>{`${mockText?.line_date} ${
                dayjs(data?.date).format('DD.MM.YYYY') || ''
              }`}</p>
                {data?.order?.number_doc &&
                <a href={`#/order/${data?.order?.ref || ''}`}>
                  {`${mockText.line_order}${data?.order?.number_doc || ''}`}
                </a>
                }
                <p>{`${mockText.line_EP}${data?.number_doc || ''}`}</p>
              </div>
            </div>
            <div>
              <label>{mockText?.line_user}</label>
              <PartnerSearch
                isRequired={true}
                stylingMode={'outlined'}
                partner={data?.partner}
                readOnly={!data.draft}
                onSelect={(e) => {
                  setData((prev) => ({
                    ...prev,
                    partner: {
                      ref: e.ref || '',
                      name: e.name || '',
                    },
                  }));
                }}
                validator={
                  <Validator>
                    <RequiredRule
                      message={`${mockText?.line_user} - ${required}`}/>
                  </Validator>
                }
              />
            </div>
            <br />
            <div>
              <FormField text={mockText?.line_user_to_print}>
                <TextBox
                  id={'partner_to_print'}
                  value={data?.partner_to_print}
                  stylingMode={'outlined'}
                  onValueChanged={handleFieldValueChange}
                  width={'320px'}
                  readOnly={!data.draft}
                />
              </FormField>
            </div>
            <TextLine text={'Данні авто'} />
            <div className={`${styles?.df} ${styles?.df_wrap}`}>
              <div className={styles?.left_block}>
                <FormField text={mockText?.auto?.vin +
                (data?.vin?.length ? `(${ data?.vin?.length })` : '')}
                mrBottom = {true}>
                  <TextBox
                    id={'vin'}
                    value={data?.vin}
                    stylingMode={'outlined'}
                    onValueChanged={handleVINValueChange}
                    width={'200px'}
                    // maxLength={17}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.vin} - ${required}`}
                      />
                      <PatternRule
                        pattern={pVINCode_1}
                        message
                          ="не використовуйте спеціальні символи крім - '\'"
                      />
                      <PatternRule
                        pattern={pVINCode_2}
                        message="символи: 'і','о' - заборонені"
                      />
                      {validateVINLenth &&
                      <StringLengthRule
                        min={17}
                        max={17}
                        message="17 символів"
                      />}
                    </Validator>
                  </TextBox>
                </FormField>
                <FormField text={mockText?.auto?.number} mrBottom = {true}
                  wrapText={true}>
                  <CarNumSearch
                    id={'car_number'}
                    value={data?.car_number?.toUpperCase()}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'170px'}
                    readOnly={!data.draft}
                    onSerch={handleOnSerchCar}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.number} - ${required}`}
                      />
                    </Validator>
                  </CarNumSearch>
                  {/* <TextBox
                    id={'car_number'}
                    value={data?.car_number?.toUpperCase()}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.number} - ${required}`}
                      />
                    </Validator>
                  </TextBox> */}
                </FormField>

                <FormField text={mockText?.auto?.manufacture_date}
                  mrBottom = {true} wrapText={true}>
                  <DateBox
                    value={data?.manufacture_date}
                    id="manufacture_date"
                    type="date"
                    displayFormat={'yyyy'}
                    useMaskBehavior={true}
                    stylingMode={'outlined'}
                    onValueChanged={handleDateChange}
                    hint={mockText?.auto?.manufacture_date}
                    max={today}
                    width={'200px'}
                    readOnly={!data.draft}
                    calendarOptions={{
                      zoomLevel: 'year',
                      maxZoomLevel: 'year',
                    }}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText
                          ?.auto?.manufacture_date} - ${required}`}
                      />
                    </Validator>
                  </DateBox>
                </FormField>
                <FormField text={mockText?.auto?.first_registration_date}
                  mrBottom = {true} wrapText={true}>
                  <DateBox
                    value={data?.first_registration_date}
                    id="first_registration_date"
                    type="date"
                    displayFormat={dateShortFormatL}
                    useMaskBehavior={true}
                    stylingMode={'outlined'}
                    onValueChanged={handleDateChange}
                    hint={mockText?.auto?.first_registration_date}
                    min={data?.manufacture_date}
                    max={today}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText
                          ?.auto?.first_registration_date} - ${required}`}
                      />
                    </Validator>
                  </DateBox>
                </FormField>
                <FormField text={mockText?.auto?.last_registration_date}
                  mrBottom = {true} wrapText={true}>
                  <DateBox
                    value={data?.last_registration_date}
                    id="last_registration_date"
                    type="date"
                    displayFormat={dateShortFormatL}
                    useMaskBehavior={true}
                    stylingMode={'outlined'}
                    onValueChanged={handleDateChange}
                    hint={mockText?.auto?.last_registration_date}
                    min={data?.first_registration_date}
                    max={today}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText
                          ?.auto?.last_registration_date} - ${required}`}
                      />
                    </Validator>
                  </DateBox>
                </FormField>
                <FormField text={mockText?.auto?.category_KTZ}
                  mrBottom={true} wrapText={true}>
                  <div className={styles.df_center}>
                    <Button id="category_description" icon='info'
                      disabled={!data?.category_KTZ_description}
                      onClick={toggleVisible}
                      style={{ marginRight: '5px' }}
                    />
                    {data?.category_KTZ_description &&
                      <Tooltip
                        target="#category_description"
                        maxWidth={500}
                        visible={tooltipVisible}
                        closeOnOutsideClick={toggleVisible}
                      >
                        <p className={styles?.break_spaces}>
                          {data?.category_KTZ_description || ''}
                        </p>
                      </Tooltip>
                    }
                    <SelectBox
                      id={'category_KTZ'}
                      items={category_KTZ_list}
                      onSelectionChanged={handleSelectionChanged}
                      value={data?.category_KTZ || null}
                      displayExpr="text"
                      valueExpr="value"
                      searchEnabled={true}
                      showClearButton={true}
                      wrapItemText={true}
                      stylingMode={'outlined'}
                      width={'300px'}
                      readOnly={!data.draft}
                    >
                      <Validator>
                        <RequiredRule
                          message=
                            {`${mockText?.auto?.category_KTZ} - ${required}`}
                        />
                      </Validator>
                    </SelectBox>
                  </div>
                </FormField>
                <FormField text={mockText?.auto?.carrying} mrBottom = {true}>
                  <TextBox
                    id={'carrying'}
                    value={data?.carrying}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    readOnly={!data.draft}
                    disabled={!(data?.category_KTZ_text === 'N2' ||
                    data?.category_KTZ_text === 'N3' ||
                    data?.category_KTZ_text === 'O3' ||
                    data?.category_KTZ_text === 'O4')}
                  >
                    <Validator>
                      <RequiredRule
                        message=
                          {`${mockText.auto.carrying} - ${required}`}
                      />
                      <PatternRule
                        pattern={pNum_3_3}
                        message="використовуйте формат для вводу: 3 | 1,725 "
                      />
                    </Validator>
                  </TextBox>
                </FormField>
                <br />
                <br />
                <FormField text={mockText?.auto?.re_equipment_date}
                  mrBottom = {true} wrapText={true}>
                  <DateBox
                    value={data?.re_equipment_date}
                    id="re_equipment_date"
                    type="date"
                    displayFormat={dateShortFormatL}
                    useMaskBehavior={true}
                    stylingMode={'outlined'}
                    onValueChanged={handleDateChange}
                    hint={mockText?.auto?.re_equipment_date}
                    max={today}
                    width={'200px'}
                    readOnly={!data.draft}
                  />
                </FormField>
                <FormField text={mockText?.auto?.re_equipment_doc_number}
                  mrBottom = {true} wrapText={true}>
                  <TextBox
                    id={'re_equipment_doc_number'}
                    value={data?.re_equipment_doc_number}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    readOnly={!data.draft}
                  />
                </FormField>
                <FormField text={mockText?.auto?.re_equipment_name}
                  mrBottom = {true} wrapText={true}>
                  <SelectBox
                    id={'re_equipment_name'}
                    items={re_equipment_name_list}
                    value={data?.re_equipment_name}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    readOnly={!data.draft}
                  />
                </FormField>
                <FormField text={mockText?.auto?.re_equipment_description}
                  mrBottom = {true} wrapText={true}>
                  <TextArea
                    id={'re_equipment_description'}
                    value={data?.re_equipment_description}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'300px'}
                    readOnly={!data.draft}
                  />
                </FormField>
              </div>
              <div className={styles?.right_block}>
                <FormField text={mockText?.auto?.car_brand} mrBottom = {true}
                  dfGrow = {true}>
                  <SelectBox
                    id={'car_brand'}
                    items={brandList}
                    onValueChanged={handleFieldValueChange}
                    value={data?.car_brand || null}
                    searchEnabled={true}
                    showClearButton={true}
                    deferRendering={false}
                    stylingMode={'outlined'}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.car_brand} - ${required}`}
                      />
                    </Validator>
                  </SelectBox>
                </FormField>
                <FormField text={mockText?.auto?.car_model} mrBottom = {true}
                  dfGrow = {true}>
                  <TextBox
                    id={'car_model'}
                    value={data?.car_model?.toUpperCase()}
                    stylingMode={'outlined'}
                    onValueChanged={(e) => {
                      handleFieldValueChange({ ...e,
                        value: e?.value?.toUpperCase() });
                    }}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.car_model} - ${required}`}
                      />
                    </Validator>
                  </TextBox>
                </FormField>
                <FormField text={mockText?.auto?.fuel_type} mrBottom = {true}
                  dfGrow = {true}>
                  <SelectBox
                    id={'fuel_type'}
                    items={fuel_type_list}
                    onValueChanged={handleFieldValueChange}
                    value={data?.fuel_type || null}
                    searchEnabled={true}
                    showClearButton={true}
                    stylingMode={'outlined'}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.fuel_type} - ${required}`}
                      />
                    </Validator>
                  </SelectBox>
                </FormField>
                <FormField text={mockText?.auto?.car_color} mrBottom = {true}
                  dfGrow = {true}>
                  <SelectBox
                    id={'car_color'}
                    items={car_color_list}
                    value={data?.car_color || null}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.car_color} - ${required}`}
                      />
                    </Validator>
                  </SelectBox>
                </FormField>
                <FormField text={mockText?.auto?.odometer} mrBottom = {true}
                  dfGrow = {true}>
                  <TextBox
                    id={'odometer'}
                    value={data?.odometer}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.odometer} - ${required}`}
                      />
                      <PatternRule pattern={pNum} message="тільки цифри" />
                    </Validator>
                  </TextBox>
                </FormField>
                <FormField text={mockText?.auto?.preliminary_mileage}
                  mrBottom = {true} dfGrow = {true}>
                  <TextBox
                    id={'preliminary_mileage'}
                    value={data?.preliminary_mileage}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      {!data?.odometer_replacement &&
                      <RangeRule max={+data?.odometer}
                        message="значення не може бути більшим поля 'Одометр'"/>
                      }
                      <PatternRule pattern={pNum} message="тільки цифри" />
                    </Validator>
                  </TextBox>
                </FormField>
                <FormField text={'«Круг / заміна одометра»'}
                  mrBottom = {true} dfGrow = {true}>
                  <CheckBox
                    id={'odometer_replacement'}
                    value={data?.odometer_replacement || false}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    text="замінити"
                    readOnly={!data.draft}
                  >
                  </CheckBox>
                </FormField>
                <FormField text={mockText?.auto?.turbine_compressor}
                  mrBottom = {true} dfGrow = {true}>
                  <SelectBox
                    id={'turbine_compressor'}
                    items={turbine_compressor_list}
                    onValueChanged={handleFieldValueChange}
                    value={data?.turbine_compressor || null}
                    searchEnabled={true}
                    showClearButton={true}
                    stylingMode={'outlined'}
                    width={'200px'}
                    readOnly={!data.draft}
                  >
                    <Validator>
                      <RequiredRule message={required} />
                    </Validator>
                  </SelectBox>
                </FormField>
                <br />
                <br />
                <FormField text={mockText?.auto?.cylinders} mrBottom = {true}
                  dfGrow = {true}>
                  <TextBox
                    id={'cylinders'}
                    value={data?.cylinders}
                    stylingMode={'outlined'}
                    onValueChanged={handleFieldValueChange}
                    width={'200px'}
                    readOnly={!data?.draft}
                  >
                    <Validator>
                      <RequiredRule
                        message={`${mockText?.auto?.cylinders} - ${required}`}
                      />
                      <PatternRule pattern={pNum} message="тільки цифри" />
                      <RangeRule max={24} min={1}
                        message="допустиме значеня від 1 до 24"/>
                    </Validator>
                  </TextBox>
                </FormField>
                <FormField text={mockText?.auto?.ecological} mrBottom = {true}
                  dfGrow = {true}>
                  <SelectBox
                    id={'ecological'}
                    items={ecological_list}
                    onValueChanged={handleFieldValueChange}
                    value={data?.ecological || null}
                    searchEnabled={true}
                    showClearButton={true}
                    stylingMode={'outlined'}
                    width={'200px'}
                    readOnly={!data?.draft}
                    wrapItemText={true}
                  >
                    <Validator>
                      <RequiredRule
                        message
                          ={`${mockText?.auto?.ecological} - ${required}`}
                      />
                    </Validator>
                  </SelectBox>
                </FormField>
                <FormField text={mockText?.auto?.purpose} mrBottom = {true}
                  dfGrow = {true}>
                  <TagBox
                    id={'purpose'}
                    items={purpose_list}
                    onValueChanged={handleFieldValueChange}
                    value={data?.purpose || null}
                    searchEnabled={true}
                    showClearButton={true}
                    wrapItemText={true}
                    stylingMode={'outlined'}
                    width={'300px'}
                    readOnly={!data.draft}
                    multiline={true}
                    applyValueMode={'useButtons'}
                  />
                </FormField>
              </div>
            </div>
            <br />
            <div className={`${styles?.df_space_around} 
            ${styles?.df_wrap} ${styles?.mr_wrap}`}>
              <ColumnField text={mockText?.auto?.air_temperature}>
                <TextBox
                  id={'air_temperature'}
                  value={data?.air_temperature}
                  stylingMode={'outlined'}
                  onValueChanged={handleFieldValueChange}
                  width={'200px'}
                  readOnly={!data.draft}
                >
                  <Validator>
                    <RequiredRule
                      message=
                        {`${mockText?.auto?.air_temperature} - ${required}`}
                    />
                    <PatternRule
                      pattern={pTemperature}
                      message={`використовуйте формат для вводу: +10
                    | +10,5 | -10 | -10,5`}
                    />
                    <RangeRule
                      min={5}
                      max={35}
                      message="значення має бути не меньше +5 i не більше +35"
                    />
                  </Validator>
                </TextBox>
              </ColumnField>
              <ColumnField text={mockText?.auto?.humidity}>
                <TextBox
                  id={'humidity'}
                  value={data?.humidity}
                  stylingMode={'outlined'}
                  onValueChanged={handleFieldValueChange}
                  width={'200px'}
                  readOnly={!data.draft}
                >
                  <Validator>
                    <RequiredRule
                      message={`${mockText?.auto?.humidity} - ${required}`}
                    />
                    <PatternRule
                      pattern={pNum_2_1}
                      message="використовуйте формат для вводу: 40 | 40,5 "
                    />
                    <RangeRule
                      min={10}
                      max={80}
                      message="значення має бути не меньше 10 i не більше 80"
                    />
                  </Validator>
                </TextBox>
              </ColumnField>
              <ColumnField text={mockText?.auto?.atmospheric_pressure}>
                <TextBox
                  id={'atmospheric_pressure'}
                  value={data?.atmospheric_pressure}
                  stylingMode={'outlined'}
                  onValueChanged={handleFieldValueChange}
                  width={'200px'}
                  readOnly={!data?.draft}
                >
                  <Validator>
                    <RequiredRule
                      message={`${mockText?.auto
                        ?.atmospheric_pressure} - ${required}`}
                    />
                    <PatternRule
                      pattern={pNum_3_1}
                      message="використовуйте формат для вводу: 100 | 100,5 "
                    />
                    <RangeRule
                      min={92}
                      max={107}
                      message="значення має бути не меньше 92 i не більше 107"
                    />
                  </Validator>
                </TextBox>
              </ColumnField>
            </div>
            <br />
            <TextLine text={'Файли'} />
            <FormField textWidth="200px"
              text={mockText?.foto_technical_passport_1}>
              <SingleImageFileUploader
                showImg={true}
                bucketUrl={BLANKS_BUCKET_URL}
                accept={file_accept}
                allowedFileExtensions={file_img_types}
                maxFileSize={maxFileSize2MB}
                uploadedFileUrl={data?.foto_technical_passport_1}
                disabled={!data?.draft}
                onFileUploaded={(file) => {
                  setData((prev) => ({
                    ...prev,
                    foto_technical_passport_1: file.url,
                  }));
                }}
                onFileDeleted={() => {
                  setData((prev) => ({
                    ...prev,
                    foto_technical_passport_1: '',
                  }));
                }}
              >
                <Validator>
                  {!data?.foto_technical_passport_1 &&
                  (<RequiredRule
                    message={`${mockText?.foto_technical_passport_1
                      } - ${required}`}
                  />)
                  }
                </Validator>
              </SingleImageFileUploader>
            </FormField>
            <br />
            <FormField textWidth="200px"
              text={mockText?.foto_technical_passport_2}>
              <SingleImageFileUploader
                showImg={true}
                bucketUrl={BLANKS_BUCKET_URL}
                accept={file_accept}
                allowedFileExtensions={file_img_types}
                maxFileSize={maxFileSize2MB}
                uploadedFileUrl={data?.foto_technical_passport_2}
                type={'required'}
                message={'Choose a file'}
                disabled={!data?.draft}
                onFileUploaded={(file) => {
                  setData((prev) => ({
                    ...prev,
                    foto_technical_passport_2: file.url,
                  }));
                }}
                onFileDeleted={() => {
                  setData((prev) => ({
                    ...prev,
                    foto_technical_passport_2: '',
                  }));
                }}
              >
                <Validator>
                  {!data?.foto_technical_passport_2 &&
                  (<RequiredRule
                    message={`${mockText?.foto_technical_passport_2
                      } - ${required}`}
                  />)
                  }
                </Validator>
              </SingleImageFileUploader>
            </FormField>
            <br />
            <FormField textWidth="200px" text={mockText?.foto_odometr}>
              <SingleImageFileUploader
                showImg={true}
                bucketUrl={BLANKS_BUCKET_URL}
                accept={file_accept}
                allowedFileExtensions={file_img_types}
                maxFileSize={maxFileSize2MB}
                uploadedFileUrl={data?.foto_odometr}
                disabled={!data?.draft}
                onFileUploaded={(file) => {
                  setData((prev) => ({
                    ...prev,
                    foto_odometr: file.url,
                  }));
                }}
                onFileDeleted={() => {
                  setData((prev) => ({
                    ...prev,
                    foto_odometr: '',
                  }));
                }}
              >
                <Validator>
                  {!data?.foto_odometr &&
                  (<RequiredRule
                    message={`${mockText?.foto_odometr
                      } - ${required}`}
                  />)
                  }
                </Validator>
              </SingleImageFileUploader>
            </FormField>
            <br />
            <FormField textWidth="200px" text={mockText?.foto_auto}>
              <SingleImageFileUploader
                showImg={true}
                bucketUrl={BLANKS_BUCKET_URL}
                accept={file_accept}
                allowedFileExtensions={file_img_types}
                maxFileSize={maxFileSize2MB}
                uploadedFileUrl={data?.foto_auto}
                disabled={!data?.draft}
                onFileUploaded={(file) => {
                  setData((prev) => ({
                    ...prev,
                    foto_auto: file.url,
                  }));
                }}
                onFileDeleted={() => {
                  setData((prev) => ({
                    ...prev,
                    foto_auto: '',
                  }));
                }}
              >
                <Validator>
                  {!data?.foto_auto &&
                  (<RequiredRule
                    message={`${mockText?.foto_auto
                      } - ${required}`}
                  />)
                  }
                </Validator>
              </SingleImageFileUploader>
            </FormField>
            <br />
            <FormField textWidth="200px" text={mockText?.foto_brake_stand}>
              <SingleImageFileUploader
                showImg={true}
                bucketUrl={BLANKS_BUCKET_URL}
                accept={file_accept}
                allowedFileExtensions={file_img_types}
                maxFileSize={maxFileSize2MB}
                uploadedFileUrl={data?.foto_brake_stand}
                disabled={!data?.draft}
                onFileUploaded={(file) => {
                  setData((prev) => ({
                    ...prev,
                    foto_brake_stand: file.url,
                  }));
                }}
                onFileDeleted={() => {
                  setData((prev) => ({
                    ...prev,
                    foto_brake_stand: '',
                  }));
                }}
              >
                <Validator>
                  {!data?.foto_brake_stand &&
                  (<RequiredRule
                    message={`${mockText?.foto_brake_stand
                      } - ${required}`}
                  />)
                  }
                </Validator>
              </SingleImageFileUploader>
            </FormField>
            <br />
            <FormField textWidth="200px" text={'Фото реглоскопу'}>
              <SingleImageFileUploader
                showImg={true}
                bucketUrl={BLANKS_BUCKET_URL}
                accept={file_accept}
                allowedFileExtensions={file_img_types}
                maxFileSize={maxFileSize2MB}
                uploadedFileUrl={data?.photo_relogoskop}
                disabled={!data?.draft}
                onFileUploaded={(file) => {
                  setData((prev) => ({
                    ...prev,
                    photo_relogoskop: file.url,
                  }));
                }}
                onFileDeleted={() => {
                  setData((prev) => ({
                    ...prev,
                    photo_relogoskop: '',
                  }));
                }}
              >
                <Validator>
                  {!data?.photo_relogoskop &&
                  (<RequiredRule
                    message={'Фото реглоскопу - обов`язкове поле'}
                  />)
                  }
                </Validator>
              </SingleImageFileUploader>
            </FormField>
            <br />
            <FormField textWidth="200px" text={'Фото "Чек"'}>
              <SingleImageFileUploader
                showImg={true}
                bucketUrl={BLANKS_BUCKET_URL}
                accept={file_accept}
                allowedFileExtensions={file_img_types}
                maxFileSize={maxFileSize2MB}
                uploadedFileUrl={data?.photo_check}
                disabled={!data?.draft}
                onFileUploaded={(file) => {
                  setData((prev) => ({
                    ...prev,
                    photo_check: file.url,
                  }));
                }}
                onFileDeleted={() => {
                  setData((prev) => ({
                    ...prev,
                    photo_check: '',
                  }));
                }}
              >
                <Validator>
                  {!data?.photo_check &&
                  (<RequiredRule
                    message={'Фото "Чек" - обов`язкове поле'}
                  />)
                  }
                </Validator>
              </SingleImageFileUploader>
            </FormField>
            <br />
            <FormField textWidth="200px" text="Фото таблички">
              <SingleImageFileUploader
                showImg={true}
                bucketUrl={BLANKS_BUCKET_URL}
                accept={file_accept}
                allowedFileExtensions={file_img_types}
                maxFileSize={maxFileSize2MB}
                uploadedFileUrl={data?.photo_table}
                disabled={!data?.draft}
                onFileUploaded={(file) => {
                  setData((prev) => ({
                    ...prev,
                    photo_table: file.url,
                  }));
                }}
                onFileDeleted={() => {
                  setData((prev) => ({
                    ...prev,
                    photo_table: '',
                  }));
                }}
              />
            </FormField>
            <br />

            <TextLine text={'Результати перевірки'} />
            <div className={`${styles?.df_space_around} ${styles?.df_wrap}`}>
              {check_items_list &&
              check_items_list.map((item, index) => (
                <CheckItem
                  key={index}
                  text={item?.text}
                  status={data[item?.field]?.status}
                  handleClick={() => handleCheckItem(item)}
                />
              ))}
            </div>

            <TextLine text={'Перевірка рівня зовнішнього шуму'} />
            <CheckItem
              description={false}
              text={'Перевірка'}
              status={data.noise_level?.status}
              handleClick={() => {
                handleCheckItem({
                  text: 'Перевірка рівня зовнішнього шуму',
                  field: 'noise_level',
                });
              }}
            />

            <TextLine text={'Додаток до протоколу'} />
            <div className={`${styles?.df_space_around} ${styles?.df_wrap}`}>
              {check_items_addition_list &&
              check_items_addition_list.map((item, index) => (
                <CheckItem
                  description={false}
                  key={index}
                  text={item?.text}
                  activeFor={item?.activeFor}
                  checkList={data?.purpose || []}
                  status={data[item?.field]?.status}
                  handleClick={() => handleCheckItem(item)}
                />
              ))}
            </div>
            <TextLine />
            <ColumnField text={mockText?.inspection}>
              <div style={{ maxWidth: 900 }}
                className={`${styles?.df} ${styles?.df_wrap}`}>
                {inspectors_list?.map((item, index) => (
                  <div className={styles?.field_wrap} key={index}>
                    <TextBox
                      id={`${item?.field}_name`}
                      value={data[`${item?.field}_name`]}
                      stylingMode={'outlined'}
                      onValueChanged={handleFieldValueChange}
                      width={'200px'}
                      readOnly={!data.draft}
                      placeholder={`[${index + 1}] Ініціали, прізвище`}
                    >
                      <Validator>
                        <RequiredRule
                          message=
                            {`[${index + 1}] Ініціали, прізвище - ${required}`}
                        />
                      </Validator>
                    </TextBox>
                    <TextBox
                      id={`${item?.field}_position`}
                      value={data[`${item?.field}_position`]}
                      stylingMode={'outlined'}
                      onValueChanged={handleFieldValueChange}
                      width={'200px'}
                      readOnly={!data.draft}
                      placeholder={item?.pos_placeholder || 'Посада'}
                    >
                      <Validator>
                        <RequiredRule
                          message={`${item?.pos_placeholder}
                          - ${required}`}
                        />
                      </Validator>
                    </TextBox>
                  </div>
                ))}
              </div>
            </ColumnField>
            <ColumnField text={mockText?.codes_mismatch}>
              <TextBox
                id={'codes_mismatch'}
                value={codes_mismatch}
                stylingMode={'outlined'}
                width={'100%'}
                readOnly={true}
              />
            </ColumnField>
            <br />
            <ColumnField text={mockText?.comments}>
              <TextBox
                id={'comments'}
                value={data?.comments}
                stylingMode={'outlined'}
                onValueChanged={handleFieldValueChange}
                width={'100%'}
                readOnly={!data?.draft}
              />
            </ColumnField>
            <br />
            <FormField textWidth="200px" text={mockText?.conclusion}>
              <RadioGroup
                id={'conclusion'}
                dataSource={conclusion_list}
                displayExpr={'text'}
                valueExpr={'value'}
                value={data?.conclusion}
                layout="horizontal"
                onValueChanged={handleFieldValueChange}
                readOnly={!!codes_mismatch || !data.draft}
              />
            </FormField>
            <br />
            <ValidationSummary id="summary"/>
            <div className={`${styles?.df_space_around} ${styles?.df_wrap}
            ${styles?.mr_wrap}`}>
              <Button
                icon="edit"
                onClick={() => {
                  handleFormSave({ draft: true });
                }}
                text={mockText?.draft_btn}
                disabled={!data.draft || blockBtn}
              />
              <Button
                ref={saveRef}
                icon="save"
                onClick={handleSubmit}
                text={mockText?.save_btn}
                disabled={!data.draft || blockBtn}
              />
              <Button
                icon="globe"
                onClick={() => {
                  history.push({ pathname: `/ep-dio/${id}` });
                }}
                text={'для Диотрейд'}
                disabled={isNewDoc}
              />
              <Suspense fallback={<div>Loading...</div>}>
                <PrintPDFbtn forwardedRef={printRef}
                  data={{ ...data, codes_mismatch }}
                  handlePdfLoading = {handlePdfLoading} />
              </Suspense>
            </div>
          </ValidationGroup>
        </ScrollView>
      </div>
    </div>
  );
};
