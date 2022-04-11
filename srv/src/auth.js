'use strict';

const jwt = require('./jwt');
const dbf = require('./db');
const config = require('./config');
const users = require('./data/users');
const { couchUsers } = require('./couch');

const authResp = async(context, username = undefined, email = undefined) => {
  const couchUser = await checkCouchUser(username, email);
  if (!couchUser || couchUser?._deleted) return new Error('AUTH_ERROR');

  const { name, branch, ref, branches, isAdmin, roles } = roledecode(couchUser);
  let organizations = '';
  let priceType = '';
  let priceTypeCash = '';
  let alterPriceType;

  const resQ = await dbf.getJsbCatByBranch(branch, branches);

  if (resQ.rowCount > 0) {
    const bRow = resQ.rows.find((el) => el.ref === branch);
    const brRow = bRow.jsb;
    organizations = brRow.organizations[0].acl_obj;
    const extraFields = brRow.departments[0].acl_obj.extra_fields;
    for (const extr of extraFields) {
      if (extr.property_name === 'ТипЦенНоменклатуры') {
        priceType = extr.value;
      }
      if (extr.property_name === 'ТипЦенНоменклатурыРП') {
        priceTypeCash = extr.value;
      }
      if (extr.property_name === 'ТипЦенНоменклатурыДополнительный') {
        alterPriceType = extr.value;
      }
    }
  }

  const user = {
    name,
    ref,
    isAdmin,
    branch,
    organizations,
    price_type: priceType,
    roles: roles,
    branches,
  };

  if (alterPriceType) user.alter_price_type = alterPriceType;
  if (priceTypeCash) user.price_type_cash = priceTypeCash;

  let fuser = users.findByName(username);
  if (fuser) {
    fuser = { ...fuser, ...user };
  } else {
    users.add(user);
  }

  const jwtUser = { ...user };
  delete jwtUser?.branches;

  const { ok, token } = await jwt.sign(jwtUser);
  context.res.setHeader('Set-Cookie', [
    `token=${token};Path=/;${config.cookieAttributes}`,
  ]);

  const retValue = {
    ok,
    token,
    expiresIn: config.jwt.expire * 1000,
    ...user,
  };

  if (user.alter_price_type) {
    retValue.isAlterPrice = true;
  }
  console.log(retValue);
  return retValue;
};

const roledecode = (data) => {
  const roles = [];
  for (const r of data.roles) {
    const [ key, value ] = r.split(':');
    if (value === undefined) roles.push(key);
  }
  let branch = '';
  let ref = '';
  let isAdmin = false;

  for (const r of data.roles) {
    const [ key, value ] = r.split(':');
    if (key === 'branch') {
      branch = value;
    } else if (key === 'ref') {
      ref = value;
    } else if (key === '_admin') {
      isAdmin = true;
    }
  }
  console.log(`data: ${data}`);
  return {
    name: data.name,
    branch,
    ref,
    isAdmin,
    branches: data?.branches ?? [],
    roles,
  };
};

const checkCouchUser = async(name, email) => {
  let query = { selector: { name: `${name}` } };
  if (email) {
    query = { selector: { email: `${email}` } };
  }
  const docs = await couchUsers.find(query);
  return docs?.docs?.[0];
};

module.exports = {
  authResp,
  roledecode,
  checkCouchUser,

};
