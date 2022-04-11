'use strict';

const { GraphQLJSONObject } = require('graphql-type-json');
const { GraphQLObjectType, GraphQLString } = require('graphql');

const pubsub = require('./pubsub');

const DB = require('../db');
const { withFilter } = require('graphql-subscriptions');
const users = require('../data/users');
const safejson = require('safejson');
const { checkLabReports } = require('./messages');
const { debounce } = require('lodash');

const checkLab = debounce(() => {
  checkLabReports();
}, 1000);


DB.docListener.on('notification', (msg) => {
  safejson.parse(msg.payload, (err, json) => {
    if (err) json = {};
    switch (msg.channel) {
    case 'changedoc': {
      pubsub.publish('NOTIFICATION_NEW_DOCUMENT', json);
      break;
    }
    case 'reperrors': {
      if (json.minVers) {
        pubsub.publish('HEADMESSAGE', json);
        break;
      }
      checkLab();
      break;
    }
    case 'messages': {
      console.log(msg);
      pubsub.publish('MESSAGE', msg);
      break;
    }

    }
    return null;
  });
});

const sendHeaderMessage = (message) => {
  //console.log('=repEvents', message );
  pubsub.publish('HEADMESSAGE', message);
};

const SubscriptionRootType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    docChange: {
      type: GraphQLJSONObject,
      args: {
        input: { type: GraphQLJSONObject },
        class_name: { type: GraphQLString },
      },
      resolve: (source) => {
        console.log('...resolve new doc...');
        return source;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator([ 'NOTIFICATION_NEW_DOCUMENT' ]),
        (payload, args) => {
          const user = users.findByName(args.input.username);
          const class_name = args.class_name
            ? args.class_name
            : 'doc.buyers_order';
          const branch = user ? user.branch : '';
          return payload.branch === branch && payload.class_name === class_name;
        }
      ),
    },
    headMessage: {
      type: GraphQLJSONObject,
      args: {
        input: { type: GraphQLJSONObject },
        //class_name: { type: GraphQLString },
      },
      resolve: (source) => source,
      subscribe: withFilter(
        () => pubsub.asyncIterator([ 'HEADMESSAGE' ]),
        (payload, args) => {
          const user = users.findByName(args.input.username);
          const branch = user ? user.branch : '';
          return (!payload.branch) || (payload.branch === branch);
        }
      ),
    },
    extCallBack: {
      type: GraphQLJSONObject,
      args: {
        orderId: { type: GraphQLString },
      },
      resolve: (source) => source,
      subscribe: withFilter(
        () => pubsub.asyncIterator([ 'EASYPAY_CALLBACK' ]),
        (payload, args) => {
          console.log('payload:', payload);
          return (payload.orderId === args.order_id);
        }
        // const user = users.findByName(args.input.username);
        // const branch = user ? user.branch : '';
      ),
    },
  },
});

module.exports = { SubscriptionRootType, sendHeaderMessage };
