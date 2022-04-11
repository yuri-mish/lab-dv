import { useQuery } from '@apollo/client';
import { useAuth } from 'contexts/auth';
import { loader } from 'graphql.macro';

const getLab = loader('./getLab.gql');

export const useLab = () => {
  const { user } = useAuth();
  const { data, loading } = useQuery(getLab, {
    variables: { lab: user.branch },
    fetchPolicy: 'cache-first',
  });

  return {
    loading,
    lab: data?.getLab?.[0],
  };
};
