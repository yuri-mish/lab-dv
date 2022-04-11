import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

const getPayKinds = loader('./getPayKinds.gql');

export const usePayKinds = () => {
  const { data } = useQuery(getPayKinds, {
    fetchPolicy: 'cache-first',
  });

  return {
    payKinds: data?.list,
  };
};
