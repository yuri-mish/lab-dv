'use strict';

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
} = require('graphql');

const NomType = require('./nomType');

const ServiceLineBuyersOrderType = new GraphQLObjectType({
  name: 'ServiceLineBuyerOrder',
  description: 'This represent ServiceLineBuyerOrder',
  fields: () => ({
    row: { type: GraphQLInt },
    nom: { type: NomType },
    content: { type: GraphQLString },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLFloat },
    amount: { type: GraphQLFloat },
    discount_percent: { type: GraphQLFloat },
    discount_percent_automatic: { type: GraphQLFloat },
    gos_code: { type: GraphQLString },
    vin_code: { type: GraphQLString },
    vat_rate: { type: GraphQLString },
    vat_amount: { type: GraphQLFloat },
  }),
});

module.exports = ServiceLineBuyersOrderType;
