/* eslint-disable function-call-argument-newline */
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpLink } from '@apollo/client/link/http';
import { onError } from '@apollo/client/link/error';
import {
  ApolloClient,
  split,
  InMemoryCache,
  ApolloLink,
  makeVar,
} from '@apollo/client';
import { WS_API_HOST, API_HOST } from './app-constants';
import { getMainDefinition } from '@apollo/client/utilities';

// Authenticated user
export const userVar = makeVar();
// Websocket health check
export const wsIsActiveVar = makeVar(false);
// Server/network health check
export const serverIsAliveVar = makeVar(true);

const wsClient = new SubscriptionClient(WS_API_HOST, {
  reconnect: true,
  connectionParams: () => ({
    token: userVar()?.token,
  }),
  connectionCallback: () => {
    wsIsActiveVar(true);
    serverIsAliveVar(true);
  },
  lazy: true,
});
wsClient.onDisconnected(() => serverIsAliveVar(false));

const wsLink = new WebSocketLink(wsClient);

const httpLink = new HttpLink({
  uri: API_HOST,
  credentials: 'include',
});

const errorLink = onError(
  ({ graphQLErrors, networkError, forward, operation }) => {
    if (networkError) {
      console.error('[APOLLO CLIENT]: Network error', '\n', networkError);
      serverIsAliveVar(false);
    } else {
      serverIsAliveVar(true);
    }
    if (graphQLErrors) {
      console.error(
        '[APOLLO CLIENT]: GraphQL errors', '\n',
        'Errors list:', graphQLErrors, '\n',
        'Operation:', operation,
      );

      // Reload page if auth token expired
      if (
        graphQLErrors?.[0]?.statusCode === 401 &&
        operation.operationName !== 'getAuth'
      ) {
        location.reload();
      }
    }
    return forward(operation);
  },
);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const gqlClient = new ApolloClient({
  connectToDevTools: process.env.NODE_ENV !== 'production',
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: ApolloLink.from([
    errorLink,
    link,
  ]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    },
    mutate: {
      errorPolicy: 'ignore',
    },
  },
});
