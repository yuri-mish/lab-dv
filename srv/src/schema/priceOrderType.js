/* eslint-disable linebreak-style */
'use strict';
const dbf = require('../db');
const {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');
const PartnerType = require('./partnerType');
const NomType = require('./nomType');
const { dateFromISO } = require('../helpers');
const { globalDocFields } = require('./generalTypes');
const getCaption = obj => (`Замовлення цін №${obj.number_doc} від ${dateFromISO(obj.date)}`);

const DiscountPriceTypes = new GraphQLObjectType({
  name: 'BlType',
  description: 'This represent GoodsLine for PurchaseOrder',
  fields: () => ({
    row: { type: GraphQLInt },
    nom: { type: NomType },
    newprice: { type: GraphQLFloat },
    discount_percent: { type: GraphQLFloat },
    quantity: { type: GraphQLInt },
  }),
});

const PriceOrderType = new GraphQLObjectType({
  name: 'priceorder',
  description: 'Замовлення цін',
  args: {
    ref: { type: GraphQLString },
  },
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'doc',
      class_name: 'doc.priceorder',
    },
  },
  fields: () => ({
    ...globalDocFields,
    caption: { type: GraphQLString, resolve: getCaption },
    partner: { type: PartnerType },
    posted: { type: GraphQLBoolean },
    status: { type: GraphQLInt },
    quantity: { type: GraphQLInt },
    start_date: { type: GraphQLString },
    expiration_date: { type: GraphQLString },
    checklog: { type: GraphQLString },
    transactions_kind: { type: GraphQLString },
    note: { type: GraphQLString },
    totalcount: { type: GraphQLInt },
    goods: {
      type: new GraphQLList(DiscountPriceTypes),
      resolve: async(obj, arg, cont, info) => {
        const res = await dbf.getPriceOrder(
          obj,
          info,
          DiscountPriceTypes,
          10
        );
        return res.rows.map(e => e.jsb);
      },
    },
  }),
});

module.exports = PriceOrderType;
