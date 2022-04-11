'use strict';

const { GraphQLString, GraphQLObjectType, GraphQLInt } = require('graphql');
const { globalCatFields } = require('./generalTypes');

const NomType = new GraphQLObjectType({
  name: 'Nom',
  description: 'This represent Nomenclature',
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'cat',
      class_name: 'cat.nom',
    },
  },
  fields: () => ({
    ...globalCatFields,
    name_full: { type: GraphQLString },
    vat_rate: { type: GraphQLString },
    totalcount: { type: GraphQLInt },
  }),
});

module.exports = NomType;
