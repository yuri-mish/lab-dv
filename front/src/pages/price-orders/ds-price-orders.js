import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsGetPriceOrders = loader('./dsGetPriceOrders.gql');

export const dsPriceOrders = createDataSource(dsGetPriceOrders);
