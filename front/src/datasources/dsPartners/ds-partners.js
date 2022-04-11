import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsGetPartners = loader('./dsGetPartners.gql');

export const dsPartners = createDataSource(dsGetPartners);

dsPartners.byEdrpou = async (edrpou) => {
  const options = { filter: [ 'edrpou', '=', edrpou ] };
  return Promise.resolve(dsPartners.load(options))
    .then((response) => response?.data?.[0]);
};

dsPartners.byPhone = async (phone) => {
  const options = { filter: [ 'phones', 'contains', phone ] };
  return Promise.resolve(dsPartners.load(options))
    .then((response) => response?.data?.[0]);
};
