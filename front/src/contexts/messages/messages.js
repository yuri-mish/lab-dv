/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo } from 'react';
import {
  useApolloClient,
  useQuery,
  useReactiveVar,
  useSubscription,
} from '@apollo/client';
import { loader } from 'graphql.macro';
import { useAuth } from 'contexts/auth';
import { wsIsActiveVar } from 'gql-client';
import { MessageManager } from './MessageManager';
const messageSubscription = loader('./messageSubscription.gql');
const getMessages = loader('./getMessages.gql');
const removeMessages = loader('./removeMessages.gql');
const getState = loader('./getState.gql');


const msgManager = new MessageManager([], 'id', 'type_message');

const filterByType = (notificationArray, type) => (
  notificationArray.filter((msg) => msg.type_message === type)
);

msgManager.registerVars(
  [ 'newOrdersList', 'newOrdersCount' ],
  (messageList) => {
    const list = filterByType(messageList, 'newdoc');
    return [ list, list.length ];
  },
  [ 'newdoc' ],
);

msgManager.registerVars(
  [ 'reportsWithErrorCount' ],
  (messageList) => {
    const list = filterByType(messageList, 'reportsWithError');
    return [ list[0]?.jsb?.count ?? 0 ];
  },
  [ 'reportsWithError' ],
);

msgManager.registerVars(
  [ 'minVersion' ],
  (messageList) => ([ filterByType(messageList, 'newVersion')
    .reduce((prev, current) => (
      (prev?.jsb?.version > current?.jsb?.version) ?
        prev?.jsb?.version :
        current?.jsb?.version
    ), '0.00.0'),
  ]),
  [ 'newVersion' ],
);

msgManager.init();


export const MessageContext = React.createContext(msgManager);

export const MessageProvider = (props) => {
  const { user } = useAuth();
  const wsIsActive = useReactiveVar(wsIsActiveVar);
  const gqlClient = useApolloClient();

  useSubscription(messageSubscription, {
    variables: {
      input: { username: user ? user.email : '' },
    },
    onSubscriptionData: (subscriptionData) => {
      const data = subscriptionData.subscriptionData.data.headMessage;
      // TODO: remove old notification support
      const newMsgs = [];
      if (data?.labReportHasError?.count) {
        newMsgs.push({
          type_message: 'reportsWithError',
          jsb: {
            count: data.labReportHasError.count,
          },
        });
      }
      if (data?.minVers) {
        newMsgs.push({
          type_message: 'newVersion',
          jsb: {
            version: data?.minVers,
          },
        });
      }

      msgManager.update((prev) => (
        [ ...(prev.filter(
          (msg) => msg.type_message !== 'reportsWithError')
        ), ...newMsgs ]
      ));
    },
  });

  useQuery(getMessages, {
    skip: !user || !wsIsActive,
    onCompleted: (data) => (
      msgManager.update((prev) => ([
        ...prev, ...(data.messages?.[0]?.mes_array ?? []),
      ]))
    ),
  });

  useEffect(() => () => {
    msgManager.reset();
  }, []);

  const messageHandler = useMemo(() => {
    const splitAndRemove = (array, conditionFn) => {
      const [ victims, remaining ] = array.reduce((result, elem) => {
        result[conditionFn(elem) ? 0 : 1].push(elem);
        return result;
      }, [ [], [] ]);

      if (victims.length > 0) {
        gqlClient.query({
          query: removeMessages,
          variables: {
            refs: victims.map((msg) => msg.id),
          },
        }).catch((e) => console.error(e));
      }

      return remaining;
    };

    const removeById = (idArray) => {
      msgManager.update((messageList) => (
        splitAndRemove(messageList, (msg) => idArray.includes(msg.id))
      ));
    };

    const removeByType = (type) => {
      msgManager.update((messageList) => (
        splitAndRemove(messageList, (msg) => msg.type_message === type)
      ));
    };

    const handler = {
      removeById,
      removeByType,
    };

    Object.setPrototypeOf(handler, msgManager);

    return handler;
  }, []);

  useQuery(getState, { skip: !user || !wsIsActive });

  return (
    <MessageContext.Provider
      value={messageHandler}
      {...props}
    />
  );
};
