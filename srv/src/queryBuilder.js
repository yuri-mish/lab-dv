'use strict';

const { isEmptyValue } = require('./utils');
const lodash = require('lodash');
const separeted = [
  'doc.lab_report',
  'doc.buyers_order',
  'doc.nom_prices_setup',
  'doc.ep',
  'cat.cars'
];

const jsonbFld = (fld) => {
  const fields = fld.split('.');
  const size = fields.length - 1;
  let res = '';
  fields.forEach((field, index) => {
    const prefix = index === size ? '->>' : '->';
    res += `${prefix}'${field}'`;
  });
  return res;
};

const checkParams = (fld, expr, val) => {
  let field = `coalesce(d.jsb${jsonbFld(fld)},'null')`;
  if (fld === 'date') {
    field = `d.${fld}`;
    if (isEmptyValue(val)) val = '0001-01-01';
  }
  if (fld === 'ref') {
    field = `d.${fld}`;
  }

  const defVal = typeof(val) === 'number' ? lodash.toString(val) : `'${val}'`;
  const defField = typeof(val) === 'number' ? `cast(${field}  as numeric)` : field;

  switch (expr) {
  case 'contains':
    return [ field, 'ilike', `'%${val}%'` ];
  case 'startswith':
    return [ field, 'ilike', `'${val}%'` ];
  case 'endswith':
    return [ field, 'ilike', `'%${val}'` ];
  default:
    return [ defField, `${expr}`, defVal ];
  }
};

const createFilt = (filters) => {
  const arr = filters.map((elem) => {
    if (Array.isArray(elem)) return createFilt(elem);
    if (elem.c) return elem.c;
    const [ fld, expr, val ] = checkParams(elem.fld, elem.expr, elem.val);
    return `${fld} ${expr} ${val}`;
  });

  return `(${arr.join(' ')})`;
};

const getJsbData = (info, type) => {
  const fields = [];
  if (info.fieldNodes && info.fieldNodes[0].selectionSet) {
    info.fieldNodes[0].selectionSet.selections.forEach((e) => {
      const field = type.getFields()[e.name.value];
      if (field && field.type.extensions && field.type.extensions.otk) {
        fields.push({
          field: e.name.value,
          ext: field.type.extensions.otk,
        });
      }
    });
  }
  const jsonb = fields.map(({ field }) => ({
    key: field,
    value: `a_${field}.jsb`,
  }));
  const joins = fields.map(({ field, ext }) => ({
    table: ext.tbl,
    alias: `a_${field}`,
    className: ext.class_name,
    jsbField: field,
    fieldKey: ext.keyF,
  }));

  return { jsonb, joins };
};

const getOrderSelector = (sort) => {
  let selector = 'd.date';
  let order = 'desc';

  if (sort) {
    if (sort.selector === '_id') selector = 'd.id';
    if (sort.selector === 'date') selector = 'd.date';
    else selector = `d.jsb->'${sort.selector}'`;

    if (sort.desc === 'false') order = '';
  }
  return { selector, order };
};

const createQuery = (opts, info, class_name, type) => {
  const { ref, branch, branches, limit, offset, sort, totalCount } = opts;
  const jfilt = opts.jfilt ? createFilt(opts.jfilt) : '';
  const { selector, order } = getOrderSelector(sort);
  const className = `doc.${class_name}`;
  const sep = separeted.find((el) => el === className);

  let fBranches = '';
  if (branches?.length > 0) {
    fBranches = ` and d.branch in (${branches.map((el) => `'${el}'`).join(',')})`;
  }
  const fBranch = branch ? ` and d.branch='${branch}'` : '';
  const fJfilt = jfilt ? ` and ${jfilt}` : '';
  const fLimit = limit ? ` LIMIT ${limit}` : '';
  const fOffset = offset ? ` OFFSET ${offset}` : '';
  const fRef = ref ? ` and d.ref='${ref}'` : '';
  const sepDoc = sep ? sep : 'doc';
  const sepClassname = sep ? '' : ` and d.class_name = '${className}'`;

  const { jsonb, joins } = getJsbData(info, type);

  const strSel = jsonb.map(({ key, value }) => `'${key}', ${value}`).join(',');
  const strJoin = joins.map((j) => (separeted.some((el) => el === j.className)
    ? ` LEFT JOIN ${j.table} ${j.alias}
     ON d.jsb->>'${j.jsbField}'=${j.alias}.${j.fieldKey} `
    : ` LEFT JOIN ${j.table} ${j.alias}
     ON ((d.jsb->>'${j.jsbField}') = ${j.alias}.${j.fieldKey}
    and ${j.alias}.class_name='${j.className}'
  )`)).join(' ');

  const qqTotalCount = `SELECT count(ref) totalcount,
  coalesce(sum(coalesce(cast(jsb->>'doc_amount' as numeric),0) 
  + coalesce(cast(jsb->>'amount' as numeric),0)),0) totalsum
  FROM  "${sepDoc}" d
  WHERE true and not d.jsb?'_deleted'
    ${sepClassname}${fJfilt}${fRef}${fBranches}${fBranch}`;

  const qq = `with d AS(
            SELECT d.jsb jsb, d.date date
            FROM "${sepDoc}" d 
            where true${fJfilt}${fBranches}${fBranch}${fRef}${sepClassname}
            ORDER BY ${selector} ${order}
            ${fLimit}${fOffset}
            )
            SELECT d.jsb||JSONB_BUILD_OBJECT(${strSel}) jsb FROM d ${strJoin}
            ORDER BY ${selector} ${order}
            `;
  if (totalCount) return qqTotalCount;
  return qq;
};

const createQueryCat = (opts, info, class_name, type) => {
  const {
    ref,
    refs,
    nameContain,
    limit,
    offset,
    lookup,
    totalCount,
    rls,
    currUserBranch,
  } = opts;
  const jfilt = opts.jfilt ? createFilt(opts.jfilt) : '';
  const className = `cat.${class_name}`;
  const sep = separeted.find((el) => el === className);
  const sepDoc = sep ? sep : 'cat';
  let rlsLimit = '';
  if (rls) {
    rlsLimit = `
      inner join (
        select distinct jsb->>'partner' as pref
        from "doc.buyers_order"
        where not jsb?'_deleted' and branch = '${currUserBranch}'
      ) dc on dc.pref=d.ref`;
  }

  const { jsonb, joins } = getJsbData(info, type);

  const strSel = jsonb.map(({ key, value }) => `'${key}', ${value}`).join(',');
  const strJoin = joins.map((j) => (separeted.some((el) => el === j.className)
    ? ` LEFT JOIN ${j.table} ${j.alias}
     ON d.jsb->>'${j.jsbField}'=${j.alias}.${j.fieldKey} `
    : ` LEFT JOIN ${j.table} ${j.alias}
     ON ((d.jsb->>'${j.jsbField}') = ${j.alias}.${j.fieldKey}
    and ${j.alias}.class_name='${j.className}'
  )`)).join(' ');

  let qq = '';
  if (lookup) {
    qq = `
      SELECT
        d.jsb||JSONB_BUILD_OBJECT(${strSel}) jsb,
        0 orderU,
        d.jsb->>'name' jname
      FROM "${sepDoc}" d ${strJoin} ${rlsLimit}
      WHERE
        not d.jsb?'_deleted'
        and d.class_name= '${className}'
        and d.ref = '${lookup}'
      UNION `;
  }

  qq += `
    SELECT s.jsb,s.orderU,s.jsb->>'name' jname
    FROM (
      SELECT d.jsb${strSel} jsb, 1 orderU
      FROM "${sepDoc}" d ${strJoin} ${rlsLimit}
      WHERE
        not d.jsb?'_deleted'
        and d.class_name = '${className}'
        ${jfilt ? `and ${jfilt}` : ''}
        ${ref ? `and d.ref='${ref}'` : ''}
        ${refs ? 'and d.ref = any ($1::text[])' : ''} 
        ${nameContain ? ` and d.jsb->>'name' ILIKE '%${nameContain}%' ` : ''}
        ORDER BY orderU, d.jsb->>'name'
        ${limit ? ` LIMIT ${limit}` : ''}
        ${offset ? ` OFFSET ${offset}` : ''}
      ) s
    ORDER BY orderU, jname`;

  const qqTotalCount = `
    SELECT count(ref) totalcount
    FROM "${sepDoc}" d ${rlsLimit}
    WHERE
      not d.jsb?'_deleted'
      and d.class_name= '${className}'
      ${jfilt ? `and ${jfilt}` : ''}
      ${ref ? `and d.ref='${ref}'` : ''}`;

  if (totalCount) return qqTotalCount;
  return qq;
};

const createQueryShed = (opts, info, class_name, type) => {
  const {
    ref,
    sort,
    limit,
    offset,
    lookup,
    totalCount,
    rls,
    currUserBranch,
    branch,
  } = opts;
  const jfilt = opts.jfilt ? createFilt(opts.jfilt) : '';
  const { selector, order } = getOrderSelector(sort);
  const className = `shed.${class_name}`;

  let rlsLimit = '';
  if (rls) {
    rlsLimit = `
      // inner join (
      //   select distinct jsb->>'partner' as pref
      //   from "doc.buyers_order"
      //   where branch = '${currUserBranch}'
      // ) dc on dc.pref=d.ref
      `;
  }

  const { jsonb, joins } = getJsbData(info, type);

  const strSel = jsonb.map(({ key, value }) => `'${key}', ${value}`).join(',');
  const strJoin = joins.map((j) => (separeted.some(el => el === j.className)
    ? ` LEFT JOIN ${j.table} ${j.alias}
      ON d.jsb->'${j.jsbField}'->>'ref' = ${j.alias}.${j.fieldKey}`
    : ` LEFT JOIN ${j.table} ${j.alias}
      ON ((d.jsb->'${j.jsbField}'->>'ref') = ${j.alias}.${j.fieldKey}
        and ${j.alias}.class_name='${j.className}')`
  )).join(' ');

  let qq = '';
  if (lookup) {
    qq = `
      SELECT
        d.jsb||JSONB_BUILD_OBJECT(${strSel}) jsb,
        0 orderU,
        d.jsb->>'name' jname
      FROM shed d ${strJoin} ${rlsLimit}
      WHERE
        not d.jsb?'_deleted'
        and d.class_name= '${className}'
        and d.ref = '${lookup}'
        ${branch ? `and d.branch='${branch}'` : ''}
      UNION `;
  }

  qq += ` with d AS(
    SELECT d.jsb jsb, d.jsb->>'date' date
    FROM shed d 
    where
      not d.jsb?'_deleted'
      and d.class_name = '${className}'
      ${jfilt ? `and ${jfilt}` : ''}
      ${ref ? `and d.ref='${ref}'` : ''}
      ${branch ? `and d.branch='${branch}'` : ''} 
    ORDER BY ${selector} ${order}
    ${limit ? ` LIMIT ${limit}` : ''} ${offset ? ` OFFSET ${offset}` : ''}
    )
    SELECT d.jsb||JSONB_BUILD_OBJECT(${strSel}) jsb FROM d
    ${strJoin}
    ORDER BY ${selector} ${order}
    `;

  const qqTotalCount = `
    SELECT count(ref) totalcount
    FROM shed d ${rlsLimit}
    WHERE
      not d.jsb?'_deleted'
      and d.class_name= '${className}'
      ${branch ? `and d.branch='${branch}'` : ''}
      ${jfilt ? `and ${jfilt}` : ''}
      ${ref ? `and d.ref='${ref}'` : ''}`;

  if (totalCount) return qqTotalCount;
  return qq;
};

const createQueryMessages = (opts) => {
  //, info, class_name, type) => {
  // const {
  //   ref,
  //   limit,
  //   offset,
  // } = opts;
  const jfilt = opts.jfilt ? ` and ${createFilt(opts.jfilt)}` : '';
  const br = `${opts.branch ? ' and branch=ANY ($1::varchar[])' : ''}`;
  const query = `
  with d as (    
      select branch, to_jsonb(d.*) jsb
      FROM new_notify d 
      where true ${br}
      )
      select branch, count(d.jsb), jsonb_agg (d.jsb) mes_array
        from d 
        where true ${jfilt}
        group by branch order by branch`;
  return query;
};

const createQueryTabular = (opts, info, class_name, type) => {
  const { id, tabular, limit } = opts;

  const className = `doc.${class_name}`;
  const sep = separeted.find((el) => el === className);
  const { jsonb, joins } = getJsbData(info, type);

  const strSel = jsonb.map(({ key, value }) => `'${key}', ${value}`).join(',');
  const strJoin = joins.map(j => (separeted.some((el) => el === j.className)
    ? `LEFT JOIN ${j.table} ${j.alias} 
    ON r.jsb->>'${j.jsbField}' = ${j.alias}.${j.fieldKey}`
    : `LEFT JOIN ${j.table} ${j.alias} ON (
      (r.jsb->>'${j.jsbField}') = ${j.alias}.${j.fieldKey}
      and ${j.alias}.class_name='${j.className}'
    )`)).join(' ');

  return sep
    ? `
  SELECT r.jsb||JSONB_BUILD_OBJECT(${strSel}) jsb
  FROM (
    select jsonb_array_elements(d.jsb->'${tabular}') jsb
    from "${sep}" d
    where
      not d.jsb?'_deleted'
      and d.id = '${id}'
  ) r
  ${strJoin}
  ${limit ? `LIMIT ${limit}` : ''}`
    : `SELECT r.jsb||JSONB_BUILD_OBJECT(${strSel}) jsb
   FROM (
    select jsonb_array_elements(d.jsb->'${tabular}') jsb
    from doc d
    where
      not d.jsb?'_deleted'
      and d.class_name= '${className}'
      and d.id = '${id}'
  ) r
  ${strJoin}
  ${limit ? `LIMIT ${limit}` : ''}`;
};

module.exports = {
  createQuery,
  createQueryTabular,
  createQueryCat,
  createQueryShed,
  createFilt,
  createQueryMessages,
};
