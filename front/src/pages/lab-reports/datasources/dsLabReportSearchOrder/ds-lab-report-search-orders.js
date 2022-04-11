import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsLabReportGetOrders = loader(
  './dsOrdersSearch.gql',
);
const dsGetOrderByKey = loader('./dsOrdersSearchGetByKey.gql');

export const dsLabReportSearchOrders = createDataSource(dsLabReportGetOrders, {
  byKeyGqlQuery: dsGetOrderByKey,
});
