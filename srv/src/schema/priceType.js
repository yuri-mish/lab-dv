'use strict';

const { GraphQLString, GraphQLObjectType, GraphQLFloat } = require('graphql');

const PriceType = new GraphQLObjectType({
  name: 'price',
  description: 'This represents price',
  fields: () => ({
    nom: { type: GraphQLString },
    price: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    vat_included: { type: GraphQLString },
  }),
});

module.exports = PriceType;
