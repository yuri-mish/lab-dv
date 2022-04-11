'use strict';

const { GraphQLObjectType } = require('graphql');
const { globalCatFields } = require('./generalTypes');

const OrganizationType = new GraphQLObjectType({
  name: 'Organisation',
  description: 'This represent Organization',
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'cat',
      class_name: 'cat.organizations',
    },
  },
  fields: () => ({
    ...globalCatFields
  }),
});

module.exports = OrganizationType;
