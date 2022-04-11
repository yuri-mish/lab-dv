import { removeEmpty } from 'utils/filtfunc';
import { loader } from 'graphql.macro';
import { gqlClient } from 'gql-client';

export const writeAppointment = (data) => {
  const doctosave = removeEmpty({
    ...data,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
  });

  const setAppointment = loader('./setAppoint.graphql');
  return gqlClient.mutate({
    mutation: setAppointment,
    variables: { input: doctosave },
  });
};
