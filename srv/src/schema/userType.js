'use strict';

const { GraphQLObjectType } = require('graphql');
const { globalCatFields } = require('./generalTypes');

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represent User',
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'cat',
      class_name: 'cat.users',
    },
  },
  fields: () => ({
    ...globalCatFields
  }),
});

module.exports = UserType;
