'use strict';

const {
  GraphQLString,
  //  GraphQLList,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
} = require('graphql');

const OrganizationType = require('./organizationType');
const PartnerType = require('./partnerType');
const BuyersOrderType = require('./buyersOrderType');
const UserType = require('./userType');

const { dateFromISO } = require('../helpers');
const { globalDocFields } = require('./generalTypes');

const getCaption = obj => (`Замовлення ${obj.number_doc} від ${dateFromISO(obj.date)}`);


const ServiceSellingType = new GraphQLObjectType({
  name: 'ServiceSelling',
  description: 'This represent Service Selling (acts)',
  args: {
    ref: { type: GraphQLString },
  },
  fields: () => ({
    ...globalDocFields,
    caption: { type: GraphQLString, resolve: getCaption },
    organization: { type: OrganizationType },
    doc_amount: { type: GraphQLFloat },
    partner: { type: PartnerType },
    trans: { type: BuyersOrderType }, //сделка
    responsible: { type: UserType },
    note: { type: GraphQLString },
    totalcount: { type: GraphQLInt },
  }),
});

module.exports = ServiceSellingType;
