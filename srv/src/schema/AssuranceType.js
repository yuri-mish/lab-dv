'use strict';
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt
} = require('graphql');
const { GraphQLJSONObject } = require('graphql-type-json');

const OrganizationType = require('./organizationType');
const PartnerType = require('./partnerType');
const DepartmentType = require('./departmentType');
//const NomType = require('./nomType');
const { globalDocFields } = require('./generalTypes');


const getCaption = obj => (`Страховий поліс ${obj.number_doc} від ${obj.date}`);


const AssuranceType = new GraphQLObjectType({
  name: 'Assurance',
  description: 'Страховий поліс',
  args: {
    ref: { type: GraphQLString },
  },
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: '"doc.assurance"',
      class_name: 'doc.assurance',
    },
  },
  fields: () => ({
    ...globalDocFields,
    caption: { type: GraphQLString, resolve: getCaption },
    organization: { type: OrganizationType },
    partner: { type: PartnerType },
    department: { type: DepartmentType },
    // nom: { type: NomType },
    note: { type: GraphQLString },
    totalcount: { type: GraphQLInt },
    body: { type: GraphQLJSONObject },
    // order_type: { type: GraphQLString }
  }),
});

module.exports = AssuranceType;
