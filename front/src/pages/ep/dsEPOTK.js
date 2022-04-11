import CustomStore from 'devextreme/data/custom_store';

import { docLoad } from 'utils/filtfunc';
import { gqlClient } from 'gql-client';
import { loader } from 'graphql.macro';

const getEpOtkOrders = loader('../ep-main/gql/getEpOtkOrders.graphql');
const cls_name = 'getEPOTK';
const cls_fields = `_id ref caption number_doc date body
partner {ref name}`;

export const dsEPOTK = new CustomStore({
  key: 'ref',
  byKey: (ref) => {
    if (!ref) return { ref: '' };
    return gqlClient.query({
      query: getEpOtkOrders,
      variables: { ref },
    })
      .then((response) => (response?.data[cls_name]?.length === 0 ?
        { ref: '' } :
        response?.data[cls_name][0]))
      .catch((e) => {
        throw Error(e);
      });
  },

  load: (options) => {
    const addOptions = options.addOptions || {
      cls_name,
      cls_fields,
    };
    if (options?.filter?.[0] === 'ref') {
      return dsEPOTK.byKey(options.filter[2]);
    }
    return docLoad(options, addOptions);
  },
});
