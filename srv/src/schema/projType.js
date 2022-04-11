'use strict';

const { GraphQLString, GraphQLObjectType, GraphQLInt } = require('graphql');
const { globalCatFields } = require('./generalTypes');

const ProjType = new GraphQLObjectType({
  name: 'proj',
  description: 'This represent ptoj',
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'cat',
      class_name: 'cat.proj',
    },
  },
  fields: () => ({
    ...globalCatFields,
    predefined_name: { type: GraphQLString },
    totalcount: { type: GraphQLInt },
  }),
});

module.exports = ProjType;
