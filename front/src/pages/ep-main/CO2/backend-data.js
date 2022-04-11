import notify from 'devextreme/ui/notify';
import dayjs from 'dayjs';
import { v4 as uuid_v4 } from 'uuid';
import {
  showError,
} from 'utils/notify.js';
import { messages } from 'messages';
import { filterObj } from 'utils/filtfunc';
import { textAddress } from 'utils/text-address';

import { loader } from 'graphql.macro';

const getEpOtkOrders = loader('../gql/getEpOtkOrders.graphql');
const updateEpOtkOrder = loader('../gql/updateEpOtkOrder.graphql');
const getEpBranch = loader('../gql/getBranch.graphql');
const getNoms = loader('../gql/getNoms.graphql');
const getBuyersOrders = loader('../gql/getBuyersOrders.graphql');
const getAddressLab = loader('../gql/getAddressLab.graphql');

export const getOrderData = async ({
  ref = '',
  setData = () => {},
  gqlClient = () => {},
}) => {
  await gqlClient
    .query({
      query: getEpOtkOrders,
      variables: { ref },
    })
    .then((response) => {
      const res = response?.data?.getEPOTK?.[0];
      if (res) {
        setData({
          _id: res?._id,
          ref: res?.ref,
          date: res?.date,
          caption: res?.caption,
          number_doc: res?.number_doc,
          ...res?.body,
        });
      } else { showError(messages?.DATA_LOAD_FAILED); }
    })
    .catch(() => {
      showError(messages?.DATA_LOAD_FAILED);
    });
  return null;
};

export const getBuyersOrderData = ({
  ref = '',
  s = 0,
  setData = () => {},
  gqlClient = () => {},
}) => {
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
  return null;
};

export const getNomsData = ({
  setCategory_KTZ_list = () => {}, gqlClient = () => {} }) => {
  gqlClient
    .query({
      query: getNoms,
      variables: { options: { selectServices: true } },
    })
    .then((response) => {
      const res = response?.data?.noms;
      if (res) {
        setCategory_KTZ_list(
          res.map((item) => ({
            text: item.name,
            value: item.ref,
          })),
        );
      }
    })
    .catch(() => {
      showError(messages?.DATA_LOAD_FAILED);
    });
  return null;
};
export const getBranchData = ({ gqlClient = () => {}, setData = () => {} }) => {
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
  return null;
};
export const getLabAddress = ({
  suffix, gqlClient = () => {}, setData = () => {},
}) => {
  const numLab = Number.parseInt(suffix) || undefined;
  gqlClient
    .query({
      query: getAddressLab,
      variables: { labNumbers: [ numLab ] },
    })
    .then((response) => {
      const data = response?.data?.getLab?.[0]?.contacts?.address;
      if (data) {
        const address = textAddress({ data });
        setData((prev) => ({
          ...prev,
          city: address,
        }));
      }
    })
    .catch(() => {
      showError(messages?.DATA_LOAD_FAILED);
    });
  return null;
};
export const getLastCO2 = async ({
  gqlClient = () => {}, setData = () => {},
}) => {
  await gqlClient
    .query({
      query: getEpOtkOrders,
      variables: { ref: '', sort: { selector: 'date', desc: 'true' },
        jfilt: filterObj([ 'order_type', '=', 'CO2' ]) },
      limit: 1,
    })
    .then((response) => {
      const res = response?.data?.getEPOTK?.[0];
      if (res) {
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
};
export const saveFormData = async ({
  draft = true, data = {}, setData = () => {},
  gqlClient = () => {}, isNewDoc, history,
}) => {
  const docToSave = {};
  const saveUuid = data?.ref || uuid_v4();
  docToSave._id = data?._id || `doc.ep|${saveUuid}`;
  docToSave.class_name = 'doc.ep';
  docToSave.date = data?.date || dayjs().format();
  docToSave.partner = data?.partner?.ref;
  docToSave.order_type = data?.type;
  docToSave.body = { ...data, draft };
  try {
    const response = await gqlClient.mutate({
      mutation: updateEpOtkOrder,
      variables: { input: docToSave },
    });
    setData((prev) => ({
      ...prev,
      draft,
    }));
    if (isNewDoc) {
      history.push({ pathname: `/ep-co2/${saveUuid}` });
      await getOrderData({ ref: saveUuid, setData, gqlClient });
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
  } catch (error) {
    notify(error?.message, 'error', 1600);
  }
  return Promise.resolve(saveUuid);
};
