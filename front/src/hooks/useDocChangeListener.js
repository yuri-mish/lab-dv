/* eslint-disable no-unused-vars */
import { gql, useSubscription } from '@apollo/client';
import { useAuth } from 'contexts/auth';
import { useEffect } from 'react';

const DOC_SUBCRIPTION = gql(
  `subscription OnDocChanged($input: JSONObject, $className: String) {
    docChange(input: $input, class_name: $className)
  }`,
);

export const useDocChangeListener = (className, onChange, ref) => {
  const { user } = useAuth();
  const { data, loading } = useSubscription(DOC_SUBCRIPTION, {
    variables: {
      input: { username: user ? user.email : '' },
      className,
    },
  });

  useEffect(() => {
    if (!loading && (!ref || data?.docChange?.ref === ref)) {
      onChange(data?.docChange);
    }
  }, [ data ]);
};
