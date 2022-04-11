import { showError } from 'utils/notify.js';
import { messages } from 'messages';
import { loader } from 'graphql.macro';

const getEpOtkOrders = loader('../gql/getEpOtkOrders.graphql');

export const getPolicy = async ({
  ref = '',
  gqlClient = () => {},
}) => {
  let result = null;
  await gqlClient
    .query({
      query: getEpOtkOrders,
      variables: { ref },
    })
    .then((response) => {
      const res = response?.data?.getEPOTK?.[0];
      if (res) {
        console.log('getPolicy res', res);
        result = {
          test: 'тестова інформація 12345678901234567',
          policy_num: '0001test',
        };
      } else { showError(messages?.DATA_LOAD_FAILED); }
    })
    .catch(() => {
      showError(messages?.DATA_LOAD_FAILED);
    });
  return result;
};
