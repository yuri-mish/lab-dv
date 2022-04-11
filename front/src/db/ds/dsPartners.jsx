import CustomStore from 'devextreme/data/custom_store';
import { catLoad, handleErrors } from 'utils/filtfunc';
import { API_HOST } from 'app-constants';


const cls_name = 'partners';
const cls_fields = 'ref name edrpou id parent is_buyer is_supplier ' +
  'legal_address note name_full individual_legal inn isCorporate';

export const partnerDataSource = new CustomStore({
  key: 'ref',
  byKey: (ref) => {
    if (!ref) return { ref: '', name: '' };
    const q = `{${cls_name} (ref:"${ref}") {${cls_fields}}}`;
    return fetch(API_HOST, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ query: q }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((response) => (response?.data[cls_name].length === 0 ?
        { ref: '', name: '' } :
        response.data[cls_name][0]));
  },
  load: (options) => {
    if (options?.filter?.[0] === 'ref') {
      return partnerDataSource.byKey(options.filter[2]);
    }
    return catLoad(options, cls_name, cls_fields);
  },
});

partnerDataSource.byEdrpou = async (edrpou) => {
  const options = { filter: [ 'edrpou', '=', edrpou ] };
  const res = await catLoad(options, cls_name, cls_fields);
  return res?.data?.[0];
};
