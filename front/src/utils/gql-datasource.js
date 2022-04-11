import { DOCLIST_PAGE_SIZE } from 'app-constants';
import CustomStore from 'devextreme/data/custom_store';
import { gqlClient } from 'gql-client';
import { filterObj } from './filtfunc';

export const createDataSource = (gqlQuery, {
  processData,
  byKeyGqlQuery,
  listGqlQuery,
} = {}) => {
  const checkResponse = (response) => {
    if (response?.errors) {
      throw new Error(response.errors?.[0]?.message ?? '');
    }

    return response;
  };

  const getByKey = (key) => gqlClient.query({
    query: byKeyGqlQuery ?? gqlQuery,
    variables: {
      ref: key,
      requireTotalCount: false,
    },
  })
    .then(checkResponse)
    .then((response) => {
      if (response?.data.list.length > 0) {
        return response.data.list[0];
      }
      throw new Error('Empty data');
    });

  const getList = (options) => {
    const filter = options.searchExpr && options.searchValue !== null ?
      [ options.searchExpr, options.searchOperation, options.searchValue ] :
      options.filter;
    return gqlClient.query({
      query: listGqlQuery ?? gqlQuery,
      variables: {
        requireTotalCount: !!options?.requireTotalCount,
        jfilt: filter ? filterObj(filter) : undefined,
        offset: options.skip,
        limit: options.take || DOCLIST_PAGE_SIZE,
        sort: options.sort ? {
          selector: options.sort[0].selector,
          desc: options.sort[0].desc.toString(),
        } : undefined,
      },
    })
      .then(checkResponse)
      .then((response) => ({
        data: processData?.(response.data.list) ?? response.data.list,
        totalCount: options.requireTotalCount ?
          response.data?.totalcount[0]?.totalcount :
          undefined,
      }));

  };


  return new CustomStore({
    key: 'ref',
    byKey: (key) => getByKey(key),
    load: (options) => getList(options),
  });
};
