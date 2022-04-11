import { loader } from 'graphql.macro';
const dsGetProj = loader('./dsGetProj.gql');
import CustomStore from 'devextreme/data/custom_store';
import { gqlClient } from 'gql-client';

const getProj = () => gqlClient
  .query({ query: dsGetProj, fetchPolicy: 'cache-first' })
  .then((res) => res.data.list);

export const dsProj = new CustomStore({
  key: 'ref',
  load: () => getProj(),
  byKey: (ref) => getProj().then((res) => res.filter((p) => p.ref === ref)),
});
