'use strict';

const {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

const OrganizationType = require('./organizationType');
const PartnerType = require('./partnerType');
const DepartmentType = require('./departmentType');
const NomType = require('./nomType');
const { globalDocFields } = require('./generalTypes');

const getCaption = obj => (`Замовлення товарів ${obj.number_doc} від ${obj.date}`);

const BlanksLineType = new GraphQLObjectType({
  name: 'BlanksLineType',
  description: 'This represent GoodsLine for PurchaseOrder',
  fields: () => ({
    row: { type: GraphQLInt },
    nom: { type: NomType },
    /**
       Тип номенклатур
       0 - Бланки Протоколів ОТК
       1 - Забезпечення ТК бланками
       2 - Доступ до загальнодержавної бази даних
       */
    nomType: { type: GraphQLInt },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLFloat },
    amount: { type: GraphQLFloat },
    vat_rate: { type: GraphQLString },
    vat_amount: { type: GraphQLFloat },
    coefficient: { type: GraphQLFloat },
    in_doc_number: { type: GraphQLString },
    in_doc_date: { type: GraphQLString },
    file_lab: { type: GraphQLString },
    file_1c: { type: GraphQLString },
  }),
});

const BlanksType = new GraphQLObjectType({
  name: 'Blanks',
  description: 'Замовлення бланків',
  args: {
    ref: { type: GraphQLString },
  },
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: 'doc',
      class_name: 'doc.blankorder',
    },
  },
  fields: () => ({
    ...globalDocFields,
    caption: { type: GraphQLString, resolve: getCaption },
    organization: { type: OrganizationType },
    doc_amount: { type: GraphQLFloat },
    partner: { type: PartnerType },
    department: { type: DepartmentType },
    vat_included: { type: GraphQLBoolean },
    note: { type: GraphQLString },
    trust_doc: { type: GraphQLString },
    totalcount: { type: GraphQLInt },
    pos_blank: { type: new GraphQLList(BlanksLineType) },
  }),
});

module.exports = BlanksType;
