'use strict';

const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
} = require('graphql');

const { globalCatFields } = require('./generalTypes');


const VehicleModelsType = new GraphQLObjectType({
  name: 'vehicle_modeles',
  description: 'Моделі авто',
  args: {
    ref: { type: GraphQLString },
  },
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'cat',
      class_name: 'cat.vehicle_modeles',
    },
  },
  fields: () => ({
    ...globalCatFields,
    type: { type: GraphQLString },
    brand: { type: GraphQLString }, //TODO:
    totalcount: { type: GraphQLInt }, //TODO:
  }),
});

module.exports = VehicleModelsType;
