import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsGetActs = loader('./dsGetActs.gql');

export const dsActs = createDataSource(dsGetActs);
