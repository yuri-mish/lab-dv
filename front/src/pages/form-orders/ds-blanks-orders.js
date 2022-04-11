import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsGetBlanksOrders = loader('./dsGetBlanksOrders.gql');

export const dsBlanksOrders = createDataSource(dsGetBlanksOrders);
