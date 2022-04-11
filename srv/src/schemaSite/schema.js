'use strict';

const { GraphQLSchema } = require('graphql');

const queryRootType = require('./queryRootType');
const mutationRootType = require('./mutationRootType');

const appSchema = new GraphQLSchema({
  query: queryRootType,
  mutation: mutationRootType,
});

module.exports = appSchema;
