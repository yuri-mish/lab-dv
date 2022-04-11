'use strict';

const { GraphQLString, GraphQLBoolean, GraphQLFloat } = require('graphql');
const { GraphQLJSONObject } = require('graphql-type-json');
const { getRefObj } = require('../utils');

const globalFields = {
  _id: { type: GraphQLString },
  ref: { type: GraphQLString, resolve: getRefObj },
  ext_json: { type: GraphQLJSONObject },
};

const globalDocFields = {
  ...globalFields,
  number_doc: { type: GraphQLString },
  date: { type: GraphQLString },
  posted: { type: GraphQLBoolean },
  totalsum: { type: GraphQLFloat }
};

const globalCatFields = {
  ...globalFields,
  id: { type: GraphQLString },
  name: { type: GraphQLString },

};

module.exports = {
  globalCatFields,
  globalDocFields,
  globalFields
};
