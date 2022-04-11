'use strict';

const { GraphQLSchema } = require('graphql');

const BlogQueryRootType = require('./blogQueryRootType');
const BlogMutationRootType = require('./blogMutationRootType');
const { SubscriptionRootType } = require('./subscriptionRootType');

const BlogAppSchema = new GraphQLSchema({
  query: BlogQueryRootType,
  mutation: BlogMutationRootType,
  subscription: SubscriptionRootType,
});

module.exports = BlogAppSchema;
