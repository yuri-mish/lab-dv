import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsGetLabReports = loader('./dsGetLabReports.graphql');

export const dsLabReports = createDataSource(dsGetLabReports);
