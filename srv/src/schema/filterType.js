'use strict';

const { GraphQLString, GraphQLInputObjectType } = require('graphql');

const FilterType = new GraphQLInputObjectType({
  name: 'filter',
  fields: {
    field: { type: GraphQLString },
    expr: { type: GraphQLString },
    value: { type: GraphQLString },
  },
});

module.exports = FilterType;
