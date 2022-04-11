/* eslint-disable no-unused-vars */
import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsReportsSearch = loader('./dsReportsSearch.gql');

const ds = createDataSource(dsReportsSearch);

export const dsReports = (orderRef, ignoreRef) => {
  const dsProxy = Object.create(ds);

  const buildFilter = (filter) => {
    let resFilter = filter;
    if (ignoreRef) {
      resFilter = resFilter ?
        [ resFilter, 'and', [ 'ref', '<>', ignoreRef ] ] :
        [ 'ref', '<>', ignoreRef ];
    }
    if (orderRef) {
      resFilter = resFilter ?
        [ resFilter, 'and', [ 'invoice', '=', orderRef ] ] :
        [ 'invoice', '=', orderRef ];
    }

    return resFilter;
  };

  dsProxy.load = (options) => ds.load({
    ...options,
    filter: buildFilter(options.filter),
  });
  return dsProxy;
};
