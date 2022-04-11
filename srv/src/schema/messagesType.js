'use strict';

const { GraphQLString, GraphQLObjectType, GraphQLInt } = require('graphql');
const { default: GraphQLJSON } = require('graphql-type-json');

const MessagesType = new GraphQLObjectType({
  name: 'Messages',
  description: 'This represent Messages',
  fields: () => ({
    branch: { type: GraphQLString },
    count: { type: GraphQLInt },
    mes_array: { type: GraphQLJSON },
  }),
});

module.exports = MessagesType;
