'use strict';

const { GraphQLString, GraphQLInputObjectType } = require('graphql');

const SortType = new GraphQLInputObjectType({
  name: 'sort',
  fields: {
    selector: { type: GraphQLString },
    desc: { type: GraphQLString },
  },
});

module.exports = SortType;
