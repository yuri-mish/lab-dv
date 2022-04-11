import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

const getProj = loader('./getProj.gql');

export const useProj = () => {
  const { data } = useQuery(getProj, {
    fetchPolicy: 'cache-first',
  });

  return {
    proj: data?.getProj,
  };
};
