'use strict';

const { GraphQLObjectType, GraphQLString } = require('graphql');

const { globalCatFields } = require('./generalTypes');

const PayKindesType = new GraphQLObjectType({
  name: 'PayKindesType',
  description: 'This represent PayKindesType',
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'cat',
      class_name: 'cat.pay_kindes',
    },
  },
  fields: () => ({
    ...globalCatFields,
    pay_form: { type: GraphQLString },
  }),
});

module.exports = PayKindesType;
