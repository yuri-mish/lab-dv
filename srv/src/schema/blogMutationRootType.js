'use strict';

const { GraphQLJSONObject } = require('graphql-type-json');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const dbf = require('../db');
const { couchCat, couchDoc, couchShed } = require('../couch');
const { mergeObjects } = require('../utils');

const pubsub = require('./pubsub');

const BuyersOrderType = require('./buyersOrderType');
const PartnerType = require('./partnerType');
const BlanksType = require('./BlanksType');
const PriceOrderType = require('./priceOrderType');
const { sendSoglasMessage, sendApproveMessage } = require('../bot/tg');
const EpType = require('./EpType');
const LabReportType = require('./labReportType');
const { v4: uuid_v4 } = require('uuid');
const dayjs = require('dayjs');
const ProjType = require('./projType');
const NomType = require('./nomType');
const config = require('../config');
const AssuranceType = require('./AssuranceType');

const BlogMutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    setBuyersOrder: {
      type: BuyersOrderType,
      args: {
        input: { type: GraphQLJSONObject }
      },
      resolve: async(source, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');

        args.input.price_type = args.input.useAddPrice ?
          context.currUser.alter_price_type : args.input.price_type;
        args.input.price_type = args.input.price_type ?
          args.input.price_type : context.currUser.price_type;


        const res = await dbf.getJsbDocById(args.input._id);
        const origDoc = res.rows.length > 0 ? res.rows[0].jsb : {
          department: context.currUser.branch,
          organization: context.currUser.organizations,
        };

        if ('services' in origDoc) delete origDoc.services;

        const resDoc = mergeObjects(origDoc, args.input);
        const result = await couchDoc.insert(resDoc).then(() => true).catch(() => false );

        if (result) {
          return { _id: 'ok' };
        }
        return new Error('SAVE_COUCH_ERROR');
      },
    },
    setLabReport: {
      type: LabReportType,
      args: {
        input: { type: GraphQLJSONObject }
      },
      resolve: async(source, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getJsbDocById(args.input._id);
        const origDoc = res.rows.length > 0 ? res.rows[0].jsb : {
          department: context.currUser.branch,
          organization: context.currUser.organizations,
        };

        const resDoc = mergeObjects(origDoc, args.input);
        const result = await couchDoc.insert(resDoc).then(() => {
          pubsub.publish('NOTIFICATION_NEW_DOCUMENT', args.input);
          return true;
        }).catch(() => false );

        if (result) {
          return { _id: 'ok' };
        }
        return new Error('SAVE_COUCH_ERROR');
      },
    },
    setBlanks: {
      type: BlanksType,
      args: {
        input: { type: GraphQLJSONObject }
      },
      resolve: async(_, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getJsbDocById(args.input._id);
        const origDoc = res.rows.length > 0 ? res.rows[0].jsb : {
          department: context.currUser.branch,
          organization: context.currUser.organizations,
        };

        if ('services' in origDoc) delete origDoc.services;
        if ('goods' in origDoc) delete origDoc.goods;
        if ('pos_blank' in origDoc) delete origDoc.pos_blank;


        args.input.account_kind = 'Бланки';
        const resDoc = mergeObjects(origDoc, args.input);

        if (res.rows.length > 0) {
          dbf.updateJsbDoc(resDoc, context.currUser.branch);
        } else {
          dbf.insertJsbDoc(args.input._id, resDoc, context.currUser.branch);
        }

        await couchDoc.insert(resDoc);
        return { _id: 'ok' };
      },
    },

    setPriceOrder: {
      type: PriceOrderType,
      args: {
        input: { type: GraphQLJSONObject }
      },
      resolve: async(_, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');
        const id = args.input._id ? args.input._id : `doc.priceorder|${args.input.ref}`;

        const res = await dbf.getJsbDocById(id);
        console.log(args.input);
        console.log(res);
        const origDoc = res.rows.length > 0 ? res.rows[0].jsb : {
          department: context.currUser.branch,
          organization: context.currUser.organizations,
        };

        if ('goods' in origDoc) delete origDoc.goods;

        const resDoc = mergeObjects(origDoc, args.input);

        if (res.rows.length > 0) {
          dbf.updateJsbDoc(resDoc, context.currUser.branch);
        } else {
          dbf.insertJsbDoc(args.input._id, resDoc, context.currUser.branch);
        }

        await couchDoc.insert(resDoc).catch( e => {
          console.log('err:', e);
        });
        return { _id: 'ok' };
      },
    },

    setCars: {
      type: GraphQLJSONObject,
      args: {
        input: { type: new GraphQLList(GraphQLJSONObject) }
      },
      resolve: async(source, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');
        const errors = [];
        if (Array.isArray(args?.input)) {
          dbf.insertCar(args.input, (err, rec) => errors.push({ err, rec }));
        }
        const retValue = { _id: 'ok' };
        if (errors.length > 0) retValue.errors = errors;
        return retValue;
      }
    },

    appendCarBrand: {
      type: GraphQLJSONObject,
      args: {
        brand: { type: GraphQLString }
      },
      resolve: async(source, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');
        couchCat.insert({
          _id: `cat.car_brand|${uuid_v4()}`,
          class_name: 'cat.car_brand',
          name: args.brand
        }).catch( e => {
          console.log('err:', e);
        });
        return { _id: 'ok' };

      }
    },

    setPartner: {
      type: PartnerType,
      args: {
        input: { type: GraphQLJSONObject }
      },
      resolve: async(source, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getJsbCatById(args.input._id);
        const origDoc = res.rows.length > 0 ? res.rows[0].jsb : {};

        if ('ext_json' in args.input) {
          args.input.ext_json = JSON.stringify(args.input.ext_json);
        }

        const resDoc = mergeObjects(origDoc, args.input);

        console.log('Set partner:', args.input);

        if (res.rows.length > 0) {
          dbf.updateJsbCat(resDoc);
        } else {
          dbf.insertJsbCat(args.input._id, resDoc);
        }

        await couchCat.insert(resDoc);

        return { _id: 'ok' };
      },
    },

    removeMessage: {
      type: GraphQLJSONObject,
      args: {
        ids: { type: new GraphQLList(GraphQLString) }
      },
      resolve: async(source, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');
        dbf.removeMessages(args.ids);
        return { ok: true };
      }
    },

    setAppoint: {
      type: GraphQLJSONObject,
      args: {
        input: { type: GraphQLJSONObject }
      },
      resolve: async(source, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');

        const res = await dbf.getJsbShedById(args.input._id);
        const savedDoc = res.rows.length > 0 ? res.rows[0].jsb : {
        };

        const origDoc = {
          ...savedDoc,
          department: context.currUser.branch,
          organization: context.currUser.organizations,
          class_name: 'shed.appoint'
        };

        args.input.date = args.input.startDate;


        if ('ext_json' in args.input) {
          args.input.ext_json = JSON.stringify(args.input.ext_json);
        }

        const resDoc = mergeObjects(origDoc, args.input);

        console.log('Set appoint:', args.input);
        //console.log('Set appoint:', args.input);

        if (res.rows.length > 0) {
          dbf.updateJsbShed(resDoc);
        } else {
          dbf.insertJsbShed(args.input._id, resDoc);
        }

        await couchShed.insert(resDoc);

        return { _id: 'ok' };
      },
    },

    setVersion: {
      type: GraphQLJSONObject,
      args: {
        vers: { type: GraphQLString }
      },
      resolve: async(_, args, context) => {
        if (!context.currUser || !context.currUser.isAdmin ) return new Error('AUTH_ERROR');
        await dbf.updateVersion(args.vers);
        return { _id: 'ok' };
      },
    },
    setEPOTK: {
      type: EpType,
      args: {
        input: { type: GraphQLJSONObject }
      },
      resolve: async(_, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');
        const id = args.input._id ? args.input._id : `doc.ep|${args.input.ref}`;

        const res = await dbf.getJsbDocById(id);
        const origDoc = res.rows.length > 0 ? res.rows[0].jsb : {
          department: context.currUser.branch,
          organization: context.currUser.organizations,
        };
        if (!args.input.number_doc && !origDoc.number_doc) {
          const newNumber = await dbf.getNewDocNumber('doc.ep', origDoc.organization);
          args.input.number_doc = newNumber;
          args.input.body.number_doc = newNumber;
        }
        //if (args.input.body.number_doc === 'ДА-72' ) {
        await createBuyersOrderFromEp(args, context);
        //        }
        const resDoc = { ...origDoc, ...args.input };
        const result = await couchDoc.insert(resDoc).then(() => true).catch(() => false );
        if ( !result ) return new Error('SAVE_COUCH_ERROR');

        return { _id: 'ok' };
      },
    },

    setAssurance: {
      type: AssuranceType,
      args: {
        input: { type: GraphQLJSONObject }
      },
      resolve: async(_, args, context) => {
        if (!context.currUser) return new Error('AUTH_ERROR');
        const id = args.input._id ? args.input._id : `doc.assurance|${args.input.ref}`;

        const res = await dbf.getJsbDocById(id);
        const origDoc = res.rows.length > 0 ? res.rows[0].jsb : {
          department: context.currUser.branch,
          organization: context.currUser.organizations,
        };
        if (!args.input.number_doc && !origDoc.number_doc) {
          const newNumber = await dbf.getNewDocNumber('doc.assurance', origDoc.organization);
          args.input.number_doc = newNumber;
          args.input.body.number_doc = newNumber;
        }
        const resDoc = { ...origDoc, ...args.input };
        const result = await couchDoc.insert(resDoc).then(() => true).catch(() => false );
        if ( !result ) return new Error('SAVE_COUCH_ERROR');

        return { _id: 'ok' };
      },
    },
    sendSoglas: {
      type: GraphQLJSONObject,
      args: {
        users: { type: new GraphQLList(GraphQLString) },
        message: { type: GraphQLString },
        docid: { type: GraphQLString },
      },
      resolve: async(_, args) => {
        sendSoglasMessage( args.message, args.users, args.docid );
        return { _id: 'ok' };
      },
    },
    sendApprove: {
      type: GraphQLJSONObject,
      args: {
        users: { type: new GraphQLList(GraphQLString) },
        message: { type: GraphQLString },
        docid: { type: GraphQLString },
      },
      resolve: async(_, args) => {
        sendApproveMessage( args.message, args.users, args.docid );
        return { _id: 'ok' };
      },
    },

  },
});

const createBuyersOrderFromEp = async(args, context) => {
  //-------------------
  let projId;
  let nomRef = '';
  let nom = {};
  switch (args.input.body.type) {
  case 'Taho':
    projId = 'tacho'; nomRef = config.utp.TahoNom;
    break;
  case 'CO2':
    projId = 'co'; nomRef = config.utp.CO2Nom;
    break;
  default:
    return;
  }
  //nothing to do for draft
  if (args.input.body.draft) return;

  //-----------------------------
  let projRef = '';
  const projResult = await dbf.getProjs({
    jfilt: [ { fld: 'id', expr: '=', val: projId } ]
  }, {}, ProjType);

  if (projResult && projResult.rows && projResult.rows.length > 0 ) {
    projRef = projResult.rows[0].jsb._id.split('|')[1];
    args.input.proj = projRef;
  }
  //-------------------
  const nomRes = await dbf.getNoms({ ref: nomRef }, {}, NomType);
  if (nomRes && nomRes.rowCount > 0 ) {
    nom = nomRes.rows[0].jsb;
  }
  //-------------------------------------
  let orderRef = uuid_v4();
  if (args.input.body && args.input.body.order
           && args.input.body.order.ref) orderRef = args.input.body.order.ref;

  const orderResult = await dbf.getJsbDocById(`doc.buyers_order|${orderRef}` );
  let order = orderResult.rows.length > 0 ? orderResult.rows[0].jsb : {
    _id: `doc.buyers_order|${orderRef}`,
    date: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    class_name: 'doc.buyers_order',
    proj: projRef,
    department: context.currUser.branch,
    organization: context.currUser.organizations,
  };

  let price = 0;
  let vat_included = true;
  const priceRes = await dbf.getPrices(dayjs(order.date), context.currUser.price_type, nomRef);
  if (priceRes && priceRes.rowCount > 0 ) {
    price = priceRes.rows[0].price;
    vat_included = priceRes.rows[0].vat_included === 'true';
  }

  order = { ...order,
    partner: args.input.partner,
    services: [ {
      nom: nomRef,
      content: nom.name,
      price: price,
      quantity: 1,
      amount: price,
      vin_code: args.input.body.vin || '',
      gos_code: args.input.body.car_number || '',
    } ],
    doc_amount: price,
    price_type: context.currUser.price_type,
    vat_included: vat_included,
    ClientPerson: args.input.body.authorized_person || '',
    ClientPersonPhone: args.input.body.phone || '',
    note: `[Електронний протокол: ${args.input.body.number_doc}]`,
    extData: {
      ep: args.input.body.number_doc,
      draft: args.input.body.draft }
  };

  await couchDoc.insert(order);

  args.input.body.order = { ref: orderRef };

};

module.exports = BlogMutationRootType;
