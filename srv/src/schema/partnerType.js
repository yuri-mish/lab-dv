'use strict';

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');
const { globalCatFields } = require('./generalTypes');

const PartnerType = new GraphQLObjectType({
  name: 'Partner',
  description: 'This represent Partner',
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'cat',
      class_name: 'cat.partners',
    },
  },
  fields: () => ({
    ...globalCatFields,
    edrpou: { type: GraphQLString },
    totalcount: { type: GraphQLInt },
    parent: { type: GraphQLString },
    is_buyer: { type: GraphQLBoolean },
    isCorporate: { type: GraphQLBoolean },
    is_supplier: { type: GraphQLBoolean },
    legal_address: { type: GraphQLString },
    partner_details: { type: GraphQLString },
    individual_legal: { type: GraphQLString },
    inn: { type: GraphQLString },
    note: { type: GraphQLString },
    name_full: { type: GraphQLString },
    phones: { type: GraphQLString },
  }),
});

module.exports = PartnerType;
