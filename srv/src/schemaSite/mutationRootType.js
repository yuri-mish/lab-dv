'use strict';

const { GraphQLJSONObject } = require('graphql-type-json');
const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql');
const { checkToken } = require('../utilsSite');
const { validateAndCreateOrder } = require('../siteOrder');


const mutationRootType = new GraphQLObjectType({
  name: 'appMutationSchema',
  description: 'Application Schema Mutation Root',
  fields: {
    createOrder: {
      type: GraphQLJSONObject,
      args: {
        token: { type: GraphQLString },
        input: { type: GraphQLJSONObject }
      },
      resolve: async(_, args) => {
        const token = checkToken(args.token);
        if (!token) {
          return new Error('TOKEN_ERROR');
        }


        return validateAndCreateOrder(args.input)
          .then((order) => ({ order_id: order.short_order_number }));
      }
    },
  },
});

module.exports = mutationRootType;
