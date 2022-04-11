
import { loader } from 'graphql.macro';
import { createDataSource } from 'utils/gql-datasource';
const dsGetNoms = loader('./dsGetNoms.gql');

const ds = createDataSource(dsGetNoms);

export const dsProjNoms = (projRef) => {
  const dsProxy = Object.create(ds);
  const projFilter = [ 'proj', '=', projRef ];
  dsProxy.load = (options) => ds.load({ ...options, filter: projFilter });
  return dsProxy;
};


