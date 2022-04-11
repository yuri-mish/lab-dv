'use strict';

const {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

const dbf = require('../db');

const OrganizationType = require('./organizationType');
const PartnerType = require('./partnerType');
const DepartmentType = require('./departmentType');
const UserType = require('./userType');
const ServiceLineBuyersOrderType = require('./serviceLineBuyersOrderType');

const { dateFromISO } = require('../helpers');
const { globalDocFields } = require('./generalTypes');

const getCaption = (obj) => `Замовлення ${obj.number_doc} від ${dateFromISO(obj.date)}`;

const contractType = new GraphQLObjectType({
  name: 'contractType',
  fields: () => ({
    partner: { type: GraphQLString },
    price_type: { type: GraphQLString },
    contract: { type: GraphQLString },
  }),
});

const subContractType = new GraphQLObjectType({
  name: 'subContractType',
  fields: () => ({
    id: { type: GraphQLString },
    cont: { type: contractType },
  }),
});

const BuyersOrderType = new GraphQLObjectType({
  name: 'BuyersOrder',
  description: 'This represent Buyers Order',
  args: {
    ref: { type: GraphQLString },
  },
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: '"doc.buyers_order"',
      class_name: 'doc.buyers_order',
    },
  },
  fields: () => ({
    ...globalDocFields,
    protected: { type: GraphQLBoolean },
    caption: { type: GraphQLString, resolve: getCaption },
    organization: { type: OrganizationType },
    doc_amount: { type: GraphQLFloat },
    partner: { type: PartnerType },
    department: { type: DepartmentType },
    ClientPerson: { type: GraphQLString },
    ClientPersonPhone: { type: GraphQLString },
    responsible: { type: UserType },
    vat_included: { type: GraphQLString },
    note: { type: GraphQLString },
    paid: { type: GraphQLFloat },
    shipped: { type: GraphQLFloat },
    totalcount: { type: GraphQLInt },
    proj: { type: GraphQLString },
    useAddPrice: { type: GraphQLBoolean },
    ship_date: { type: GraphQLString },
    fine_time: { type: GraphQLString },
    price_type: { type: GraphQLString },
    contract: { type: subContractType },
    isSubContract: { type: GraphQLBoolean },
    partner_subcontract: { type: PartnerType },
    pay_kind: { type: GraphQLString },

    services: {
      type: new GraphQLList(ServiceLineBuyersOrderType),
      resolve: async(obj, arg, cont, info) => {
        const res = await dbf.getBuyersOrder(
          obj,
          info,
          ServiceLineBuyersOrderType,
          10
        );
        return res.rows.map((e) => {
          if (e.jsb?.partner_subcontract) {
            e.jsb.partner = e.jsb.partner_subcontract;
          }
          return e.jsb;
        });
      },
    },
  }),
});

module.exports = BuyersOrderType;
