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

const users = require('../data/users');
const dbf = require('../db');
const jwt = require('../jwt');
const {
  getOpendatabotInfo,
  loginCouch,
  getInfoApi,
  checkCouchUser,
} = require('../utils');

const SortType = require('./sortType');
const FilterType = require('./filterType');
const BuyersOrderType = require('./buyersOrderType');
const LabReportType = require('./labReportType');
const PartnerType = require('./partnerType');
const NomType = require('./nomType');
const PriceType = require('./priceType');
const ServiceSellingType = require('./serviceSellingType');
const PurchaseOrderType = require('./purchaseOrderType');

const config = require('../config');
const FileStorage = require('@google-cloud/storage').Storage;
const BlanksType = require('./BlanksType');
const PriceOrderType = require('./priceOrderType');
const EpType = require('./EpType');
const ProjType = require('./projType');
const messages = require('./messages');
const SchedulerType = require('./schedulerType');
const MessagesType = require('./messagesType');
const AssuranceType = require('./AssuranceType');
const PayKindesType = require('./PayKindesType');
const { getPaymentData } = require('../payment/payment');
const { roledecode, authResp } = require('../auth');
const { easyPayTerminalReportCreate } = require('../payment/easypay');
const projectId = config.gapi.projectId;

const keyFilename = `${config.gapi.path}/${config.gapi.keyFile}`;
const fileStorage = new FileStorage({ projectId, keyFilename });

const BlogQueryRootType = new GraphQLObjectType({
  name: 'BlogAppSchema',
  description: 'Blog Application Schema Query Root',
  fields: {
    buyers_orders: {
      name: 'buyers_order',
      type: new GraphQLList(BuyersOrderType),
      args: {
        ref: { type: GraphQLString },
        branches: { type: new GraphQLList(GraphQLString) },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        sort: { type: SortType },
        totalCount: { type: GraphQLInt },
        token: { type: GraphQLString },
      },
      resolve: async(par, args, cont, info) => {
        if (!cont.currUser && args.token) {
          const result = await jwt.verify(args.token);
          if (result.error) {
            return new Error('AUTH_ERROR');
          }
          cont.currUser = users.findByName(result.data.name);
        }
        console.log('currUser:', cont.currUser);
        console.log('=Args:', args);
        if (!cont.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getBuyersOrderList(
          args,
          info,
          BuyersOrderType,
          cont.currUser
        );

        if (!args.totalCount) {
          return res.rows.map((e) => {
            e.jsb.useAddPrice =
              e.jsb.price_type &&
              e.jsb.price_type === cont.currUser.alter_price_type;
            return e.jsb;
          });
        }
        return res.rows;
      },
    },
    lab_report: {
      name: 'lab_report',
      type: new GraphQLList(LabReportType),
      args: {
        ref: { type: GraphQLString },
        branches: { type: new GraphQLList(GraphQLString) },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        sort: { type: SortType },
        totalCount: { type: GraphQLInt },
        token: { type: GraphQLString },
      },
      resolve: async(par, args, cont, info) => {
        if (!cont.currUser && args.token) {
          const result = await jwt.verify(args.token);
          if (result.error) {
            return new Error('AUTH_ERROR');
          }
          cont.currUser = users.findByName(result.data.name);
        }

        const res = await dbf.getLabReportList(
          args,
          info,
          LabReportType,
          cont.currUser
        );

        if (!args.totalCount) {
          return res.rows.map(e => e.jsb);
        }

        return res.rows;
      },
    },
    purchase_orders: {
      name: 'purchase_order',
      type: new GraphQLList(PurchaseOrderType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        sort: { type: SortType },
        totalCount: { type: GraphQLInt },
      },
      resolve: async(par, args, cont, info) => {
        console.log('currUser:', cont.currUser);
        console.log('=Args:', args);
        if (!cont.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getPurchaseOrderList(
          args,
          info,
          PurchaseOrderType,
          cont.currUser
        );

        if (!args.totalCount) {
          return res.rows.map(e => e.jsb);
        }
        return res.rows;
      },
    },
    blanks: {
      name: 'blanks',
      type: new GraphQLList(BlanksType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        sort: { type: SortType },
        totalCount: { type: GraphQLInt },
      },
      resolve: async(par, args, cont, info) => {
        // console.log('currUser:', cont.currUser);
        // console.log('=Args:', args);
        if (!cont.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getBlanksList(
          args,
          info,
          BlanksType,
          cont.currUser
        );

        if (!args.totalCount) {
          return res.rows.map(e => e.jsb);
        }
        return res.rows;
      },
    },

    priceorder: {
      name: 'priceorders',
      type: new GraphQLList(PriceOrderType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        sort: { type: SortType },
        totalCount: { type: GraphQLInt },
      },
      resolve: async(par, args, cont, info) => {
        // console.log('currUser:', cont.currUser);
        // console.log('=Args:', args);
        if (!cont.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getPriceOrderList(
          args,
          info,
          PriceOrderType,
          cont.currUser
        );

        if (!args.totalCount) {
          return res.rows.map(e => e.jsb);
        }
        return res.rows;
      },
    },

    servise_selling: {
      name: 'servise_selling',
      type: new GraphQLList(ServiceSellingType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        sort: { type: SortType },
        totalCount: { type: GraphQLInt },
      },
      resolve: async(par, args, cont, info) => {
        console.log('currUser:', cont.currUser);
        console.log('=Args:', args);
        if (!cont.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getServiceSellingList(
          args,
          info,
          ServiceSellingType,
          cont.currUser
        );

        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },

    getEPOTK: {
      name: 'ElProtocol',
      type: new GraphQLList(EpType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        sort: { type: SortType },
        totalCount: { type: GraphQLInt },
      },
      resolve: async(par, args, cont, info) => {
        console.log('currUser:', cont.currUser);
        console.log('=Args:', args);
        if (!cont.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getEPOTK(args, info, EpType, cont.currUser);

        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },
    getAssurance: {
      name: 'Assurance',
      type: new GraphQLList(AssuranceType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        sort: { type: SortType },
        totalCount: { type: GraphQLInt },
      },
      resolve: async(par, args, cont, info) => {
        console.log('currUser:', cont.currUser);
        console.log('=Args:', args);
        if (!cont.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getAssurance(
          args,
          info,
          AssuranceType,
          cont.currUser
        );

        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },

    partners: {
      name: 'partners',
      type: new GraphQLList(PartnerType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        //nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        totalCount: { type: GraphQLInt },
        js: { type: GraphQLJSON },
      },
      resolve: async(par, args, cont, info) => {
        console.log('===args:', args);

        const res = await dbf.getPartners(
          args,
          info,
          PartnerType,
          cont.currUser
        );

        if (!args.totalCount) {
          return res.rows.map((e) => {
            let retValue = false;
            if (e.jsb.is_buyer) {
              // TODO: seems like a dead code
              if (e.jsb.is_buyer === '') retValue = false;
              else retValue = e.jsb.is_buyer;
            }
            e.jsb.is_buyer = retValue;

            retValue = false;
            if (e.jsb.is_supplier) {
              // TODO: same
              if (e.jsb.is_supplier === '') retValue = false;
              else retValue = e.jsb.is_supplier;
            }
            e.jsb.is_supplier = retValue;

            return e.jsb;
          });
        }

        return res.rows;
      },
    },

    noms: {
      name: 'noms',
      type: new GraphQLList(NomType),
      args: {
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
        console.log(args);

        const res = await dbf.getNoms(args, info, NomType);

        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },

    sched: {
      name: 'shed',
      type: new GraphQLList(SchedulerType),
      args: {
        ref: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        lookup: { type: GraphQLString },
        nameContain: { type: GraphQLString },
        filter: { type: new GraphQLList(FilterType) },
        skip: { type: GraphQLInt },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        totalCount: { type: GraphQLInt },
        options: { type: GraphQLJSON },
      },
      resolve: async(par, args, cont, info) => {
        console.log(args);

        const res = await dbf.getSched(
          args,
          info,
          SchedulerType,
          cont.currUser
        );

        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },

    messages: {
      name: 'messages',
      type: new GraphQLList(MessagesType),
      args: {
        nameContain: { type: GraphQLString },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
        options: { type: GraphQLJSON },
      },
      resolve: async(par, args, cont, info) => {
        console.log('args:', args);
        console.log('currUser:', cont.currUser);
        const res = await dbf.getMessages(
          args,
          info,
          GraphQLString,
          cont.currUser
        );
        //if (!args.totalCount) return res.rows.map(e => e.jsb);
        //console.log(args)
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
      },
      resolve: async(par, args, cont, info) => {
        console.log(args);

        const res = await dbf.getProjs(args, info, ProjType);

        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },

    prices: {
      name: 'prices',
      type: new GraphQLList(PriceType),
      args: {
        date: { type: GraphQLString },
        useAddPrice: { type: GraphQLBoolean },
        priceType: { type: GraphQLString },
      },
      resolve: async(par, args, cont) => {
        console.log('method prices:', args);
        let res;
        if (args.priceType) {
          res = await dbf.getPrices(args.date, args.priceType);
        } else {
          res = await dbf.getPrices(
            args.date,
            args.useAddPrice
              ? cont.currUser.alter_price_type
              : cont.currUser.price_type
          );
        }
        return res.rows;
      },
    },

    branch: {
      name: 'branch',
      type: GraphQLJSONObject,
      args: {
        ref: { type: GraphQLString },
        refs: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async(par, args, cont, info) => {
        const res = await dbf.getBranch(args, info, cont).catch((e) => {
          console.log('getBranch => error reading pg', e);
        });

        if (res.rowCount === 1) {
          return res.rows[0];
        } else if (res.rowCount > 1) {
          return { list: res.rows };
        }
        return { nodata: res.rows };
      },
    },

    car: {
      name: 'car',
      type: new GraphQLList(GraphQLJSONObject),
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
      },
      resolve: async(par, args, _, info) => {
        const res = await dbf.getCar(args, info).catch((e) => {
          console.log('car => error reading pg', e);
        });

        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },

    car_brand: {
      name: 'car_brand',
      type: new GraphQLList(GraphQLJSONObject),
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
      },
      resolve: async(par, args, _, info) => {
        const res = await dbf.getCar_brand(args, info).catch((e) => {
          console.log('car_brand => error reading pg', e);
        });

        if (!args.totalCount) return res.rows.map((e) => e.jsb);
        return res.rows;
      },
    },

    easyPayReportCreate: {
      name: 'easyPayReportCreate',
      type: GraphQLJSONObject,
      args: {
        branch: { type: GraphQLString }
      },
      resolve: async( par, args, cont ) => {
        if (!cont.currUser ) {
          return new Error('AUTH_ERROR');
        }
        const branch = args?.branch ?? cont.currUser.branch;
        const report = await easyPayTerminalReportCreate(branch);
        return report;
      }
    },

    easyPayReportCreateAll: {
      name: 'easyPayReportCreateAll',
      type: GraphQLJSONObject,
      args: {
      },
      resolve: async( par, args, cont ) => {
        if (!cont.currUser ) {
          return new Error('AUTH_ERROR');
        }
        const report = await easyPayTerminalReportCreate();
        return report;
      }
    },

    opendatabot: {
      name: 'opendatabot',
      type: GraphQLJSONObject,
      args: {
        kod: { type: GraphQLString },
      },
      resolve: async(par, args, cont) => {
        if (!cont.currUser) return { error: 'Неавторизований' };
        const res = await getOpendatabotInfo(args.kod);
        return res;
      },
    },

    logout: {
      name: 'logout',
      type: GraphQLJSON,
      resolve: async(obj, args, context) => {
        context.res.setHeader(
          'Set-Cookie',
          [ 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' ]
        );
        if (context.currUser) {
          users.deleteByName(context.currUser.name);
        }
        return {};
      },
    },

    checkVersion: {
      name: 'checkversion',
      type: GraphQLBoolean,
      args: {
        ver: { type: GraphQLString },
      },
      resolve: async(obj, args) => {
        const resQ = await dbf.getVers();
        const [ labVer, labSubVer ] = args.ver.split('.');
        const [ minVer, minSubVer ] = resQ.rows[0].vers.split('.');
        console.log('labVersion:', args.ver);
        return (labVer * 1000) + labSubVer >= (minVer * 1000) + minSubVer;
      },
    },

    getConfig: {
      name: 'getConfig',
      type: GraphQLJSON,
      resolve: async(obj, args, cont) => {
        console.log(cont.currUser);
        if (!cont.currUser || !cont.currUser.isAdmin) {
          return new Error('AUTH_ERROR');
        }
        const resQ = await dbf.getConfig();
        return JSON.stringify(resQ);
      },
    },

    auth_g: {
      name: 'auth',
      type: GraphQLJSON,
      args: {
        token_g: { type: GraphQLString },
      },
      resolve: async(_, args, context) => {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(config.gauth.clientId);
        const ticket = await client.verifyIdToken({
          idToken: args.token_g,
          audience: config.gauth.audience,
        });
        const payload = ticket.getPayload();
        const retValue = await authResp(context, undefined, payload.email);
        return retValue;

      },
    },

    auth: {
      name: 'auth',
      type: GraphQLJSON,
      args: {
        name: { type: GraphQLString },
        pass: { type: GraphQLString },
      },
      resolve: async(obj, args, context) => {
        const data = await loginCouch(args.name, args.pass);
        if (!data.ok) return new Error('AUTH_ERROR');
        const retValue = await authResp(context, args.name);
        return retValue;
      },
    },

    refresh_auth: {
      name: 'refresh auth',
      type: GraphQLJSON,
      args: {
        token: { type: GraphQLString },
      },
      resolve: async(obj, args) => {
        const oldToken = args.token;
        console.log('token to refresh', oldToken);
        if (!oldToken) return { ok: false, message: 'No token' };

        const result = await jwt.verify(oldToken);
        if (result.error) return { ok: false, message: 'No valid token' };

        const user = result.data;
        const couchUser = await checkCouchUser(user.name);
        if (!couchUser || couchUser?._deleted) {
          return { ok: false, message: 'Invalid user' };
        }
        const roles = roledecode(couchUser);
        const { ok, token } = await jwt.sign(user);
        const retValue = {
          ok,
          token,
          expiresIn: config.jwt.expire * 1000,
          ...user,
          ...roles,
        };
        if (user.alter_price_type) retValue.isAlterPrice = true;
        return retValue;
      }
    },
    infoapi: {
      name: 'infoapi',
      type: GraphQLJSON,
      args: {
        doc: { type: GraphQLString },
        ref: { type: GraphQLString },
      },
      resolve: async(obj, args, context) => getInfoApi(args, context),
    },

    getNewFileUrl: {
      name: 'getNewFileUrl',
      type: GraphQLString,
      args: {
        fileName: { type: GraphQLString },
      },
      resolve: async(_, args) => {
        const options = {
          version: 'v4',
          action: 'write',
          // eslint-disable-next-line no-mixed-operators
          expires: 15 * 60 * 1000 + Date.now(), // 15 minutes
        };
        // Get a v4 signed URL for uploading file
        const [ url ] = await fileStorage
          .bucket(config.gapi.bucket)
          .file(args.fileName)
          .getSignedUrl(options);
        return url;
      },
    },

    getApiVersion: {
      name: 'getApiVersion',
      type: GraphQLJSON,
      resolve: () => ({ ver: config.ver }),
    },
    getLab: {
      name: 'getLab',
      type: new GraphQLList(GraphQLJSON),
      args: {
        labNumbers: { type: new GraphQLList(GraphQLInt) },
        jfilt: { type: new GraphQLList(GraphQLJSON) },
      },
      resolve: async(par, args) => {
        const res = await dbf.getLab(args.labNumbers, args.jfilt);
        return res;
      },
    },
    getPayKindes: {
      name: 'getPayKindes',
      type: new GraphQLList(PayKindesType),
      resolve: async(par, args, cont, info) => {
        const res = await dbf.getKindes(info, PayKindesType);
        const retValue = res.rows.map((el) => el.jsb);
        return retValue;
      },
    },
    getState: {
      name: 'getState', //get Init state for User
      type: GraphQLJSON,
      args: {
        //token: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async(par, args, context) => {
        console.log('getState context', context.currUser);
        if (!context.currUser) return new Error('AUTH_ERROR');

        messages.getState(context.currUser);
        return { ok: true };
      },
    },
    getPaymentData: {
      name: 'getPaymentData',
      type: GraphQLJSONObject,
      args: {
        paymentType: { type: GraphQLString },
        organization: { type: GraphQLString },
        options: { type: GraphQLJSONObject },
      },
      resolve: async(_, args) => (
        getPaymentData(args.paymentType, args.organization, {
          ...args.options,
          data: { ...args.options.data, organization: args.organization }
        })
      ),
    },
    getTest: {
      name: 'getTest', //get Init state for User
      type: GraphQLString,
      args: {
        p1: { type: GraphQLString },
        p2: { type: GraphQLString },
        p3: { type: GraphQLString },
        input: { type: GraphQLJSONObject },
      },
      resolve: async(par, args, cont) => {
        if (!cont.currUser || !cont.currUser.isAdmin) {
          return new Error('AUTH_ERROR');
        }
        const res = await dbf.getNewDocNumber(args.p1, args.p2, args.p3);
        //const res = await dbf.getNewDocNumber('doc.buyers_order', 'ff', '_УК');
        console.log(res);
        return res;
      },
    },
    checkContract: {
      name: 'checkContract', //get Init state for User
      type: GraphQLJSONObject,
      args: {
        partner: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        gos_code: { type: GraphQLString },
      },
      resolve: async(par, args, cont) => {
        if (!cont.currUser) return new Error('AUTH_ERROR');
        const res = await dbf.checkSubContract(
          args,
          cont.currUser.organizations
        );
        //const res = await dbf.getNewDocNumber('doc.buyers_order', 'ff', '_УК');
        console.log(res);
        return res;
      },
    },
  },
});

module.exports = BlogQueryRootType;
