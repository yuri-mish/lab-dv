'use strict';

const { GraphQLObjectType } = require('graphql');
const { globalCatFields } = require('./generalTypes');

const DepartmentType = new GraphQLObjectType({
  name: 'Department',
  description: 'This represent Department',
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'cat',
      class_name: 'cat.branches',
    },
  },
  fields: () => ({
    ...globalCatFields
  }),
});

module.exports = DepartmentType;
