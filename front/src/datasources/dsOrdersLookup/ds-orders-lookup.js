import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';
const dsGetOrdersLookup = loader('./dsGetOrdersLookup.gql');

export const dsOrdersLookup = createDataSource(dsGetOrdersLookup, {
  processData: (data) => orderBy(
    uniqBy(data, 'number_doc'),
    [ 'number_doc' ],
    [ 'asc' ],
  ),
});

