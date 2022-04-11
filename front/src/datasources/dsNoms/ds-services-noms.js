import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsGetServicesNoms = loader('./dsGetServicesNoms.gql');

export const dsServicesNoms = createDataSource(dsGetServicesNoms);


