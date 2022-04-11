import { gql } from 'graphql.macro';
import { gqlClient } from 'gql-client';
import { DEFAULT_AVATAR_URL } from 'app-constants';

const AUTH = gql`
  query getAuth($user: String, $pass: String) {
    auth(name: $user, pass: $pass)
  }
`;

const LOGOUT = gql`
  query logout {
    logout
  }
`;

const getAuth = async (user, pass) => gqlClient.query({
  query: AUTH,
  variables: { user, pass },
})
  .then((response) => {
    if (response.data.auth) response.data.auth.isOk = true;
    return response.data.auth || { isOk: false };
  })
  .catch((e) => console.error('Authentication failed', e));

export const logout = async () => gqlClient.query({ query: LOGOUT })
  .then((response) => response.data.logout);

export const signIn = async (email, password) => getAuth(email, password)
  .then((result) => ({
    isOk: result.isOk,
    message: result.isOk ? '' : 'Помилка входу',
    data: {
      ...result,
      email,
      avatarUrl: result.avatarUrl || DEFAULT_AVATAR_URL,
    },
  }))
  .catch(() => ({
    isOk: false,
    message: 'Помилка входу',
  }));


export const createAccount = async (email, password) => {
  console.log(email, password);
  Promise.resolve({
    isOk: true,
  });
  /*
  {
    isOk: false,
    message: 'Failed to create account',
  };
  */
};


export const changePassword = async (email, recoveryCode) => {
  console.log(email, recoveryCode);
  Promise.resolve({
    isOk: true,
  });
  /*
  {
    isOk: false,
    message: 'Failed to change password',
  };
  */
};

export const resetPassword = async (email) => {
  console.log(email);
  Promise.resolve({
    isOk: true,
  });
  /*
    {
      isOk: false,
      message: 'Failed to reset password',
    };
  */
};
