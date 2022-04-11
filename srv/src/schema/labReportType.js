'use strict';

const {
  GraphQLString,
  //GraphQLList,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');

//const OrganizationType = require('./organizationType');
const PartnerType = require('./partnerType');
const DepartmentType = require('./departmentType');
const NomType = require('./nomType');
const BuyersOrderType = require('./buyersOrderType');
const VehicleModelsType = require('./vehicleModelsType');
const { dateFromISO } = require('../helpers');
const { globalDocFields } = require('./generalTypes');


const getCaption = obj => (`Звіт лабораторії №${obj.number_doc} від ${dateFromISO(obj.date)}`);

const LabReportType = new GraphQLObjectType({
  name: 'labReport',
  description: 'Звіт лабораторії',
  args: {
    ref: { type: GraphQLString },
  },
  extensions: {
    otk: {
      keyF: 'ref',
      tbl: '"doc.lab_report"',
      class_name: 'doc.lab_report',
    },
  },
  fields: () => ({
    ...globalDocFields,
    caption: { type: GraphQLString, resolve: getCaption },
    amount: { type: GraphQLFloat },
    status: { type: GraphQLString },
    gnumber: { type: GraphQLString },
    partner: { type: PartnerType },
    invoice: { type: BuyersOrderType },
    department: { type: DepartmentType },
    service: { type: NomType },
    dangerous: { type: GraphQLBoolean },
    has_error: { type: GraphQLBoolean },
    next_date: { type: GraphQLString },
    validated: { type: GraphQLBoolean },
    vehicle_map: { type: GraphQLBoolean },
    blank_number: { type: GraphQLInt },
    blank_series: { type: GraphQLString },
    spot_cashless: { type: GraphQLBoolean },
    vehicle_model: { type: VehicleModelsType },
    error: { type: GraphQLString },
    rp: { type: GraphQLFloat },
    rv: { type: GraphQLInt },
    note: { type: GraphQLString },
    totalcount: { type: GraphQLInt },
    source_report: { type: LabReportType },
  }),
});

module.exports = LabReportType;
