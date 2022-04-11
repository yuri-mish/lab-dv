'use strict';

const { GraphQLString, GraphQLObjectType, GraphQLInt } = require('graphql');
const BuyersOrderType = require('./buyersOrderType');
//const BuyersOrderType = require('./buyersOrderType');
const { globalCatFields } = require('./generalTypes');
const PartnerType = require('./partnerType');


const SchedulerType = new GraphQLObjectType({
  name: 'Scheduler',
  description: 'This represent scheduls',
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'shed',
      class_name: 'shed.appoint',
    },
  },
  fields: () => ({
    ...globalCatFields,
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    duration: { type: GraphQLInt },
    text: { type: GraphQLString },
    note: { type: GraphQLString },
    partner: { type: PartnerType },
    buyers_order: { type: BuyersOrderType },
    phone: { type: GraphQLString },
    source: { type: GraphQLString },
  }),
});

module.exports = SchedulerType;
