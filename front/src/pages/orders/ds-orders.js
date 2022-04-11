import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsGetOrders = loader('./gql/dsGetOrders.gql');

export const dsOrders = createDataSource(dsGetOrders);
