import { loader } from 'graphql.macro';
import CustomStore from 'devextreme/data/custom_store';
import { gqlClient } from 'gql-client';
const dsGetPayKinds = loader('./getPayKinds.gql');

const getPayKinds = () => gqlClient
  .query({ query: dsGetPayKinds, fetchPolicy: 'cache-first' })
  .then((res) => res.data.list);

export const dsPayKinds = new CustomStore({
  key: 'ref',
  load: () => getPayKinds(),
  byKey: (ref) => getPayKinds().then((res) => res.filter((p) => p.ref === ref)),
});
