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
const NomType = require('./nomType');
const { globalDocFields } = require('./generalTypes');


const getCaption = obj => (`Замовлення товарів ${obj.number_doc} від ${obj.date}`);

const GoodsLinePurchaseOrderType = new GraphQLObjectType({
  name: 'GoodsLinePurchaseOrder',
  description: 'This represent GoodsLine for PurchaseOrder',
  fields: () => ({
    row: { type: GraphQLInt },
    nom: { type: NomType },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLFloat },
    amount: { type: GraphQLFloat },
    vat_rate: { type: GraphQLString },
    vat_amount: { type: GraphQLFloat },
    coefficient: { type: GraphQLFloat },
  }),
});

const BlankLabFile = new GraphQLObjectType({
  name: 'BlankLabFile',
  description: 'files uploaded in lab',
  fields: () => ({
    row: { type: GraphQLInt },
    file_name: { type: GraphQLString },
    http_ref: { type: GraphQLString },
    descript: { type: GraphQLString },
  }),
});

const PurchaseOrderType = new GraphQLObjectType({
  name: 'PurchaseOrder',
  description: 'Замовлення товарів',
  args: {
    ref: { type: GraphQLString },
  },
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'doc',
      class_name: 'doc.purchase_order',
    },
  },
  fields: () => ({
    ...globalDocFields,
    caption: { type: GraphQLString, resolve: getCaption },
    organization: { type: OrganizationType },
    doc_amount: { type: GraphQLFloat },
    partner: { type: PartnerType },
    department: { type: DepartmentType },
    fio_person: { type: GraphQLString },
    doc_person: { type: GraphQLString },
    vat_included: { type: GraphQLBoolean },
    note: { type: GraphQLString },
    paid: { type: GraphQLFloat },
    totalcount: { type: GraphQLInt },
    lab_files: { type: new GraphQLList(BlankLabFile) },
    goods: {
      type: new GraphQLList(GoodsLinePurchaseOrderType),
      resolve: async(obj, arg, cont, info) => {
        const res = await dbf.getPurchaseOrder(
          obj,
          info,
          GoodsLinePurchaseOrderType,
          10
        );
        return res.rows.map(e => e.jsb);
      },
    },
  }),
});

module.exports = PurchaseOrderType;
