'use strict';

const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
} = require('graphql');

const dbf = require('../db');
const { checkToken } = require('../utilsSite');
const ProjType = require('../schema/projType');
const FilterType = require('../schema/filterType');
const NomType = require('../schema/nomType');
const PriceType = require('../schema/priceType');

const queryRootType = new GraphQLObjectType({
  name: 'appSchema',
  description: 'Application Schema Query Root',
  fields: {
    getLabs: {
      name: 'getLabs',
      type: new GraphQLList(GraphQLJSON),
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async(par, args) => {
        const token = checkToken(args.token);
        if (!token) {
          return new Error('TOKEN_ERROR');
        }
        const res = await dbf.getLabs();
        const retValue = res.rows.map((el) => {
          if (el.lab.extra_fields) delete el.lab.extra_fields;
          return el.lab;
        });
        return retValue;
      },
    },
    getLab: {
      name: 'getLabs',
      type: new GraphQLList(GraphQLJSON),
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
        labNumbers: { type: new GraphQLList(GraphQLInt) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },

      },
      resolve: async(par, args) => {
        const token = checkToken(args.token);
        if (!token) {
          return new Error('TOKEN_ERROR');
        }
        const res = await dbf.getLab(args.labNumbers, args.jfilt);
        return res;
      },
    },
    noms: {
      name: 'noms',
      type: new GraphQLList(NomType),
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        name: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        skip: { type: GraphQLInt },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        js: { type: GraphQLJSON },
        totalCount: { type: GraphQLInt },
        options: { type: GraphQLJSON },
      },
      resolve: async(par, args, cont, info) => {
        const token = checkToken(args.token);
        if (!token) {
          return new Error('TOKEN_ERROR');
        }

        const res = await dbf.getNoms(args, info, NomType);
        if (!args.totalCount) return res.rows.map(e => e.jsb);
        return res.rows;
      },
    },

    prices: {
      name: 'prices',
      type: new GraphQLList(PriceType),
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLString },
        useAddPrice: { type: GraphQLBoolean },
        priceType: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async(par, args) => {
        const token = checkToken(args.token);
        if (!token) {
          return new Error('TOKEN_ERROR');
        }
        const res = await dbf.getPrices(args.date, args.priceType);
        return res.rows;
      },
    },

    getKey: {
      name: 'resource key (ex liqpay)',
      type: new GraphQLList(GraphQLJSON),
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
        resource: { type: new GraphQLNonNull(GraphQLString) },
        organization: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async(par, args) => {
        const token = checkToken(args.token);
        if (!token) {
          return new Error('TOKEN_ERROR');
        }
        console.log('method getKey:', args);
        const res = await dbf.getKey(args.resource, args.organization);
        return res.rows;
      },
    },

    getProj: {
      name: 'proj',
      type: new GraphQLList(ProjType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        skip: { type: GraphQLInt },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        totalCount: { type: GraphQLInt },
        options: { type: GraphQLJSON },
        token: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async(par, args, cont, info) => {
        const token = checkToken(args.token);
        if (!token) {
          return new Error('TOKEN_ERROR');
        }
        const res = await dbf.getProjs(args, info, ProjType);
        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },
    getPaymentForm: {
      name: 'getPaymentForm',
      type: GraphQLString,
      args: {
        token: { type: GraphQLString },
        orderData: { type: GraphQLJSONObject },
        redirectUrl: { type: GraphQLString },
      },
      resolve: async(_, args) => {
        if (!checkToken(args.token)) {
          return new Error('TOKEN_ERROR');
        }
        // TODO
        return new Error('VALIDATION_ERROR');
      },
    }
  },

});

module.exports = queryRootType;
