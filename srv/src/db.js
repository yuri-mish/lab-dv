'use strict';

const { Pool, Client } = require('pg');

const {
  createQuery,
  createQueryTabular,
  createQueryCat,
  createQueryShed,
  createFilt,
  createQueryMessages,
} = require('./queryBuilder');

const config = require('./config');
const { couchDoc } = require('./couch');

class DB {
  constructor() {
    this.pool = new Pool(config.db);
    this.poolSync = new Pool(config.db);
    this.docListener = new Client(config.db);
    this.docListener.connect();
    //    this.docListener.query('LISTEN changedoc');
    this.docListener.query('LISTEN changedoc');
    this.docListener.query('LISTEN reperrors');
    this.parentService = config.utp.parentNomService;
  }

  // sync

  async getDocVersion() {
    const query = 'select doc_ver from couchconfig where id = 1';
    const res = await this.poolSync.query(query, []);
    return res.rows[0].doc_ver;
  }

  async getShedVersion() {
    const query = 'select shed_ver from couchconfig where id = 1';
    const res = await this.poolSync.query(query, []);
    return res.rows[0].shed_ver;
  }

  async getCatVersion() {
    const query = 'select cat_ver from couchconfig where id = 1';
    const res = await this.poolSync.query(query, []);
    return res.rows[0].cat_ver;
  }

  updateDocVersion(version, cb) {
    const query = 'UPDATE couchconfig SET doc_ver = $1 where id=1';
    return this.poolSync.query(query, [ version ], cb);
  }

  updateShedVersion(version, cb) {
    const query = 'UPDATE couchconfig SET shed_ver = $1 where id=1';
    return this.poolSync.query(query, [ version ], cb);
  }

  updateCatVersion(version, cb) {
    const query = 'UPDATE couchconfig SET cat_ver = $1 where id=1';
    return this.poolSync.query(query, [ version ], cb);
  }

  insertDoc(records, cb) {
    const delQuery = 'DELETE FROM doc WHERE id IN ($1)';
    const query = `
      INSERT INTO doc (id, class_name, ref, jsb, date, branch)
      VALUES($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) do
      UPDATE SET
        class_name = EXCLUDED.class_name,
        ref = EXCLUDED.ref,
        jsb = EXCLUDED.jsb,
        date = EXCLUDED.date,
        branch = EXCLUDED.branch`;

    for (const rec of records) {
      if (rec.deleted) {
        this.poolSync.query(delQuery, [ rec.id ]);
        continue;
      }

      if (!(rec.doc && rec.doc._id && rec.doc.class_name)) return;

      let date = new Date('0001-01-01T00:00:00');
      try {
        date = new Date(rec.doc.date);
      } catch (e) {
        console.log('Failed to convert date:', JSON.stringify(rec.doc));
      }

      const params = [
        rec.doc._id,
        rec.doc.class_name,
        rec.doc._id.split('|')[1],
        rec.doc,
        date,
        rec.doc.department,
      ];

      this.poolSync.query(query, params, (err) => cb(err, rec));
    }
  }

  insertShed(records, cb) {
    let seq;
    const delQuery = 'DELETE FROM shed WHERE id IN ($1)';
    const query = `
      INSERT INTO shed (id, class_name, ref, jsb, date, branch)
      VALUES($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) do
      UPDATE SET
        class_name = EXCLUDED.class_name,
        ref = EXCLUDED.ref,
        jsb = EXCLUDED.jsb,
        date = EXCLUDED.date,
        branch = EXCLUDED.branch`;

    for (const rec of records) {
      if (rec.deleted) {
        this.poolSync.query(delQuery, [ rec.id ]);
        continue;
      }

      if (!(rec.doc && rec.doc._id && rec.doc.class_name)) continue;
      seq = rec.seq;

      let date = new Date('0001-01-01T00:00:00');
      try {
        date = new Date(rec.doc.date);
      } catch (e) {
        console.log('Failed to convert date:', JSON.stringify(rec.doc));
      }

      const params = [
        rec.doc._id,
        rec.doc.class_name,
        rec.doc._id.split('|')[1],
        rec.doc,
        date,
        rec.doc.department,
      ];

      this.poolSync.query(query, params, (err) => cb(err));
    }
    return seq;
  }

  insertCat(records, cb) {
    const query = `
      INSERT INTO cat (id,class_name,ref,jsb)
      VALUES($1,$2,$3,$4)
      ON CONFLICT (id) do
      UPDATE SET
        class_name = EXCLUDED.class_name,
        ref=EXCLUDED.ref,
        jsb=EXCLUDED.jsb`;

    for (const rec of records) {
      if (!(rec.doc._id && rec.doc.class_name)) return;

      const params = [
        rec.doc._id,
        rec.doc.class_name,
        rec.doc._id.split('|')[1],
        rec.doc,
      ];

      this.poolSync.query(query, params, (err) => cb(err, rec));
    }
  }

  insertCar(records, cb) {
    const query = `
    INSERT INTO "cat.cars"  (id,class_name,ref,jsb) 
    VALUES($1,$2,$3,$4)
    ON CONFLICT (id) do
    UPDATE SET
      class_name = EXCLUDED.class_name,
      ref=EXCLUDED.ref,
      jsb=EXCLUDED.jsb
    WHERE "cat.cars".jsb->>'d_reg' <= EXCLUDED.jsb->>'d_reg' `;

    for (const rec of records) {
      if (!(rec.doc._id && rec.doc.class_name)) return;
      const params = [
        rec.doc._id,
        rec.doc.class_name,
        rec.doc._id.split('|')[1],
        rec.doc,
      ];
      this.poolSync.query(query, params, (err, result) => {
        if (result?.rowCount === 1) console.log(`car ${rec.doc._id} ins/upd by d_reg`);
        cb(err, rec);
      });
    }
  }

  // BlogMutationRootType

  async getJsbDocById(id) {
    const query = `
      SELECT d.jsb jsb
      FROM doc d
      WHERE d.id=$1`;

    return this.pool.query(query, [ id ]);
  }

  async getJsbCatById(id) {
    const query = `
      SELECT c.jsb jsb
      FROM cat c
      WHERE c.id=$1`;
    return this.pool.query(query, [ id ]);
  }

  async getJsbShedById(id) {
    const query = `
      SELECT c.jsb jsb
      FROM shed c
      WHERE c.id=$1`;
    return this.pool.query(query, [ id ]);
  }

  async updateJsbDoc(resDoc, branch) {
    const query = `
      UPDATE doc
      SET jsb=$1, date=$2, class_name=$3, branch=$4
      WHERE id=$5 and class_name=$3`;

    const params = [
      JSON.stringify(resDoc),
      new Date(resDoc.date),
      resDoc.doc._id.split('|')[0],
      branch,
      resDoc._id,
    ];

    return this.pool.query(query, params);
  }

  async updateJsbCat(resDoc) {
    const query = 'UPDATE cat SET jsb=$1 WHERE id=$2';

    const params = [ JSON.stringify(resDoc), resDoc._id ];

    return this.pool.query(query, params);
  }

  async updateJsbShed(resDoc) {
    const query = 'UPDATE shed SET jsb=$1, branch=$3 WHERE id=$2';

    const params = [ JSON.stringify(resDoc), resDoc._id, resDoc.department ];

    return this.pool.query(query, params);
  }

  async insertJsbDoc(id, resDoc, branch) {
    const query = `
      INSERT INTO doc (id, jsb, date, class_name, branch)
      VALUES($1,$2,$3,$4,$5)`;

    const params = [
      id,
      JSON.stringify(resDoc),
      new Date(resDoc.date),
      resDoc.doc._id.split('|')[0],
      branch,
    ];

    return this.pool.query(query, params);
  }

  async insertJsbCat(id, resDoc) {
    const query = `
      INSERT INTO cat (id, jsb, class_name, ref)
      VALUES($1, $2, $3, $4)`;

    const params = [
      id,
      JSON.stringify(resDoc),
      'cat.partners',
      id.split('|')[1],
    ];

    return this.pool.query(query, params);
  }

  async insertJsbShed(id, resDoc) {
    const query = `
      INSERT INTO shed (id, jsb, ref, date, branch,class_name)
      VALUES($1, $2, $3, $4, $5,$6)`;

    const params = [
      id,
      JSON.stringify(resDoc),
      id.split('|')[1],
      new Date(resDoc.date),
      resDoc.department,
      id.split('|')[0],
    ];

    return this.pool.query(query, params);
  }

  async getKey(resource, organization) {
    const query = `select r.keys from(
      select jsonb_array_elements(jsb->'access_keys') keys from cat
      where class_name IN ('cat.organizations') AND ref = $2
      ) r
      where r.keys->>'resource'= $1`;
    const params = [ resource, organization ];

    return this.pool.query(query, params);
  }

  // BuyersOrderType

  async getBuyersOrder(args, info, type, limit) {
    const options = {
      id: args._id,
      tabular: 'services',
      limit: limit,
    };

    const query = createQueryTabular(options, info, 'buyers_order', type);

    console.log(query);

    return this.pool.query(query, []);
  }

  async getPriceOrder(args, info, type, limit) {
    const options = {
      id: args._id,
      tabular: 'goods',
      limit: limit,
    };

    const query = createQueryTabular(options, info, 'priceorder', type);

    console.log(query);

    return this.pool.query(query, []);
  }

  async getPurchaseOrder(args, info, type, limit) {
    const options = {
      id: args._id,
      tabular: 'goods',
      limit: limit,
    };
    const query = createQueryTabular(options, info, 'purchase_order', type);
    console.log(query);
    return this.pool.query(query, []);
  }

  async getBlanks(args, info, type, limit) {
    const options = {
      id: args._id,
      tabular: 'lines',
      limit: limit,
    };
    const query = createQueryTabular(options, info, 'blankorder', type);
    console.log(query);
    return this.pool.query(query, []);
  }

  //  ////////////////////////////////////////////////////////////////////////////////
  async getVers() {
    const query = 'select vers from couchconfig';
    return this.pool.query(query, []);
  }

  //  ////////////////////////////////////////////////////////////////////////////////

  createBranchOptions(args, options, currUser) {
    let branch = currUser && !currUser.isAdmin ? currUser.branch : '';
    let branches = [];
    if (currUser.branches && !args.branches) {
      branches = currUser.branches.map((el) => el.ref);
    } else if (args?.branches) {
      if (args.branches[0] === '*') {
        if (currUser.branches) {
          branches = currUser.branches.map((el) => el.ref);
        }
      } else {
        branches = args.branches;
      }
    }
    if (branches.length > 0) branch = '';
    return { ...options, branch, branches };
  }

  // BlogQueryRootType
  async getBuyersOrderList(args, info, type, currUser) {
    let options = {
      jfilt: args.jfilt,
      ref: args.ref,
      limit: args.limit,
      offset: args.offset,
      sort: args.sort,
      totalCount: args.totalCount,
    };

    options = this.createBranchOptions(args, options, currUser);
    const query = createQuery(options, info, 'buyers_order', type);

    console.log(query);

    return this.pool.query(query, []);
  }

  async getLabReportList(args, info, type, currUser) {
    let options = {
      jfilt: args.jfilt,
      ref: args.ref,
      //branch: currUser && !currUser.isAdmin ? currUser.branch : '',
      limit: args.limit,
      offset: args.offset,
      sort: args.sort,
      totalCount: args.totalCount,
    };
    options = this.createBranchOptions(args, options, currUser);
    const query = createQuery(options, info, 'lab_report', type);

    console.log(query);

    return this.pool.query(query, []);
  }

  async getPurchaseOrderList(args, info, type, currUser) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      branch: currUser && !currUser.isAdmin ? currUser.branch : '',
      limit: args.limit,
      offset: args.offset,
      sort: args.sort,
      totalCount: args.totalCount,
    };

    const query = createQuery(options, info, 'purchase_order', type);
    console.log(query);
    return this.pool.query(query, []);
  }

  async getBlanksList(args, info, type, currUser) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      branch: currUser && !currUser.isAdmin ? currUser.branch : '',
      limit: args.limit,
      offset: args.offset,
      sort: args.sort,
      totalCount: args.totalCount,
    };

    const query = createQuery(options, info, 'blankorder', type);
    console.log(query);
    return this.pool.query(query, []);
  }

  async getPriceOrderList(args, info, type, currUser) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      branch: currUser && !currUser.isAdmin ? currUser.branch : '',
      limit: args.limit,
      offset: args.offset,
      sort: args.sort,
      totalCount: args.totalCount,
    };

    const query = createQuery(options, info, 'priceorder', type);
    console.log(query);
    return this.pool.query(query, []);
  }

  async getServiceSellingList(args, info, type, currUser) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      branch: currUser && !currUser.isAdmin ? currUser.branch : '',
      limit: args.limit,
      offset: args.offset,
      sort: args.sort,
      totalCount: args.totalCount,
    };

    const query = createQuery(options, info, 'servise_selling', type);

    console.log(query);

    return this.pool.query(query, []);
  }

  async getEPOTK(args, info, type, currUser) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      branch: currUser && !currUser.isAdmin ? currUser.branch : '',
      limit: args.limit,
      offset: args.offset,
      sort: args.sort,
      totalCount: args.totalCount,
    };

    const query = createQuery(options, info, 'ep', type);

    console.log(query);

    return this.pool.query(query, []);
  }

  async getAssurance(args, info, type, currUser) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      branch: currUser && !currUser.isAdmin ? currUser.branch : '',
      limit: args.limit,
      offset: args.offset,
      sort: args.sort,
      totalCount: args.totalCount,
    };

    const query = createQuery(options, info, 'assurance', type);

    console.log(query);

    return this.pool.query(query, []);
  }

  async getPartners(args, info, type, currUser) {
    let noRls = false;
    if (args.jfilt) {
      for (const filter of args.jfilt) {
        if (
          (filter && filter.fld === 'edrpou' && filter.val.length > 3) ||
          (filter && filter.fld === 'phones' && filter.val.length > 5)
        ) {
          noRls = true;
          break;
        }
      }
    }

    if (args.ref) noRls = true;

    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      nameContain: args.nameContain,
      limit: args.limit,
      offset: args.offset,
      lookup: args.lookup ? args.lookup.trim() : '',
      totalCount: args.totalCount,
      rls: !noRls,
      currUserBranch: currUser.branch,
    };

    const query = createQueryCat(options, info, 'partners', type);

    console.log('===', query);

    return this.pool.query(query, []);
  }

  async getPartnerByEdrpou(edrpou) {
    const query = `
    select
      ref
    from cat
    where 
      class_name='cat.partners'
      and jsb->>'edrpou'='${edrpou}'
    `;

    return this.pool.query(query, []);
  }

  async getPartnerByPhoneNumber(phoneNumber) {
    const query = `
    select
      ref
    from cat
    where 
      class_name='cat.partners'
      and jsb->>'phones'='${phoneNumber}'
    `;

    return this.pool.query(query, []);
  }

  async getNoms(args, info, type) {
    //фильтр по группе Услуги ОТК
    if (args && args.options && args.options.selectServices) {
      const addF = { fld: 'parent', expr: '=', val: this.parentService };
      if (args.jfilt) {
        args.jfilt.push({ c: 'and' });
        args.jfilt.push(addF);
      } else {
        args.jfilt = [ addF ];
      }
    }
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      nameContain: args.nameContain,
      limit: args.limit,
      offset: args.offset,
      lookup: args.lookup ? args.lookup.trim() : '',
      totalCount: args.totalCount,
    };

    const query = createQueryCat(options, info, 'nom', type);

    console.log(query);

    return this.pool.query(query, []);
  }

  async getSched(args, info, type, currUser) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      nameContain: args.nameContain,
      limit: args.limit,
      offset: args.offset,
      lookup: args.lookup ? args.lookup.trim() : '',
      totalCount: args.totalCount,
      branch: currUser && !currUser.isAdmin ? currUser.branch : '',
    };
    const query = createQueryShed(options, info, 'appoint', type);
    return this.pool.query(query, []);
  }

  async getMessages(args, info, type, currUser) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      nameContain: args.nameContain,
      limit: args.limit,
      offset: args.offset,
      lookup: args.lookup ? args.lookup.trim() : '',
      totalCount: args.totalCount,
      branch: currUser && !currUser.isAdmin ? currUser.branch : undefined,
    };
    const query = createQueryMessages(options); //, info, 'messages', type);
    const params = [];
    if (options?.branch) {
      if (Array.isArray(options?.branch)) {
        params.push(options.branch);
      } else {
        params.push([ options.branch ]);
      }
    }
    return this.pool.query(query, params);
  }

  async removeMessages(ids) {
    if (!ids) return;
    const query = 'delete from new_notify where id = any ($1::uuid[])';
    this.pool.query(query, [ ids ]);
  }

  async getProjs(args, info, type) {
    const addF = { fld: 'isvisible', expr: '=', val: true };
    if (args.jfilt) {
      args.jfilt.push({ c: 'and' });
      args.jfilt.push(addF);
    } else {
      args.jfilt = [ addF ];
    }

    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      limit: args.limit,
      offset: args.offset,
      lookup: args.lookup ? args.lookup.trim() : '',
      totalCount: args.totalCount,
    };

    const query = createQueryCat(options, info, 'proj', type);
    return this.pool.query(query, []);
  }

  async getKindes(_, info, type) {
    const query = createQueryCat({}, info, 'pay_kindes', type);
    return this.pool.query(query, []);
  }

  async getPrices(date, priceType, nomRef) {
    //console.log('priceType:', priceType);
    const query = `
    with datenom AS (
      select distinct max(d.date) maxdate, nom
      from "doc.nom_prices_setup" d  
      where
        d.date <= $1
        and d.price_type = $2  ${nomRef ? ` and nom = '${nomRef}'` : ''}
        group by d.nom
    )
    select
      datenom.maxdate date,
      datenom.nom nom,
      prc.price price,
      curr.currency currency,
      curr.vat_included vat_included
    from datenom
    left join (
      select d.date "date" , d.price , d.nom  
      from "doc.nom_prices_setup" d
      where
        d.date <= $1
        and d.price_type = $2
    ) prc on datenom.maxdate = prc.date and datenom.nom = prc.nom
    left join (
      select
        c.jsb->>'price_currency' currency,
        c.jsb->>'vat_price_included' vat_included
      from cat c
      where c.class_name='cat.nom_prices_types' and c.ref=$2
    ) curr on true`;

    console.log(query);

    return this.pool.query(query, [ date, priceType ]);
  }

  async getBranch(args, info, context) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      refs: args?.refs,
      nameContain: args.nameContain,
      limit: args?.limit,
      offset: args.offset,
      lookup: args.lookup ? args.lookup.trim() : '',
      totalCount: args.totalCount,
    };
    if (!args.ref && !args.refs) {
      options.jfilt = [ { fld: 'ref', expr: '=', val: context.currUser.branch } ];
    }

    const params = [];
    if (args?.refs) params.push(args.refs);
    const query = createQueryCat(options, info, 'branches');
    return this.pool.query(query, params);
  }

  async getCar(args, info) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      refs: args?.refs,
      nameContain: args.nameContain,
      limit: args?.limit,
      offset: args.offset,
      lookup: args.lookup ? args.lookup.trim() : '',
      totalCount: args.totalCount,
    };

    const params = [];
    const query = createQueryCat(options, info, 'cars');
    return this.pool.query(query, params);
  }

  async getCar_brand(args, info) {
    const options = {
      jfilt: args.jfilt,
      ref: args.ref,
      refs: args?.refs,
      nameContain: args.nameContain,
      limit: args?.limit,
      offset: args.offset,
      lookup: args.lookup ? args.lookup.trim() : '',
      totalCount: args.totalCount,
    };

    const params = [];
    const query = createQueryCat(options, info, 'car_brand');
    return this.pool.query(query, params);
  }

  async getLabReportsInfo() {
    const params = [];
    const query = `
      select branch, cast(count(branch) AS INTEGER) count from doc d 
      where d.class_name ='doc.lab_report' and d.jsb->>'has_error'='true'
      group by branch`;
    return this.pool.query(query, params).catch((e) => {
      console.log('getLabReportsInfo => error reading pg', e);
    });
  }

  async getLabs() {
    const query = `
    select specs.acl_obj lab
    from 
      cat, jsonb_to_recordset(cat.jsb->'departments') as specs(acl_obj json) 
    where class_name ='cat.branches'`;

    return this.pool.query(query, []).catch((e) => {
      console.log('getLabs => error reading pg', e);
    });
  }

  async get_config(part) {
    const query = `
    select jsb 
    from 
      config  
    where id  ='${part}'`;
    const res = await this.poolSync.query(query, []);
    let resp = {};
    if (res.rows.length > 0) resp = res.rows[0].jsb;
    return resp;
  }

  async getLab(labNumbers, jfiltParam) {
    const jfilt = jfiltParam ? createFilt(jfiltParam) : '';
    const params = [];
    let query = `
    select d.jsb||jsonb_build_object('pay_systems', org.keys) lab
    from cat d left join (
    	select ref, b.jsb->'access_keys' keys 
    	from cat b where b.class_name = 'cat.organizations'
    ) org on d.jsb->>'organization' = org.ref
    where class_name = 'cat.labs'
    ${jfilt ? `and ${jfilt}` : ''}`;
    // ===
    if (labNumbers) {
      query += `
        and cast(d.jsb->>'lab_number' as INTEGER) = ANY ($1::int[])
      `;
      params.push(labNumbers);
    }
    return this.pool.query(query, params).then((res) => {
      const labs = res.rows.map((row) => {
        const lab = row.lab;
        if (lab.pay_systems) {
          lab.pay_systems = lab.pay_systems.map((ps) => {
            delete ps.public;
            delete ps.private;
            return ps;
          });
        }
        return lab;
      });

      return labs;
    });
  }

  async getJsbCatByBranch(branch, branches) {
    const params = [];
    params.push(branch);
    if (branches) params.push(branches);
    const query = `
      SELECT distinct d.jsb jsb, ref FROM cat d 
      WHERE 
      (d.ref=$1${branches ? ' or d.ref = any($2::text[])' : ''})
      and d.class_name='cat.branches'`;

    return this.pool.query(query, params);
  }

  async getConfig() {
    const query = 'select doc_ver,cat_ver,vers from couchconfig where id = 1';
    const res = await this.poolSync.query(query, []);
    return res.rows[0];
  }

  async updateVersion(vers) {
    const query = 'UPDATE couchconfig SET vers=$1 WHERE id=1';

    const params = [ vers ];
    return this.pool.query(query, params);
  }

  async checkSubContract({ partner, date, gos_code }, organization) {
    const gosFilt = gos_code
      ? `
      and jsb->'vehicles' @> 
      (jsonb'[]'||jsonb_build_object('search_field', $4::varchar))::jsonb`
      : '';
    const query = `with d as (select id, jsonb_array_elements(jsb->'contracts') cont  from cat 
      where class_name = 'cat.contracts_g'
        and  $2 between jsb->>'date' and jsb->>'validity' ${gosFilt}
        and jsb->>'partner' = $3)
      select d.*, e.cont contb from d
        left join d as e on	e.cont->>'partner'= $3
      where  d.cont->>'organization'=$1`;
    console.log(query);
    const params = [ organization, date, partner ];
    if (gos_code) params.push(gos_code);
    const ret = await this.pool.query(query, params);
    return ret?.rows[0];
  }

  async getNewDocNumber(className, org, manPrefix) {
    let docNumber = 1;

    let query =
      'SELECT numb FROM doc_number WHERE class_name=$1 AND organization=$2';
    let params = [ className, org ];
    const resSelect = await this.pool.query(query, params);
    if (resSelect.rows.length === 0) {
      query = `INSERT INTO doc_number (class_name, organization, numb)
       VALUES($1, $2, $3)`;
      params = [ className, org, 1 ];
      this.pool.query(query, params);
    } else {
      docNumber = resSelect.rows[0].numb + 1;
      query =
        'UPDATE doc_number SET numb=$3 WHERE class_name=$1 AND organization=$2';
      params = [ className, org, docNumber ];
      this.pool.query(query, params);
    }

    let prefix;
    if (manPrefix) {
      prefix = `${manPrefix}-`;
      let textNum = docNumber.toString();
      while (textNum.length < 11) {
        textNum = `0${textNum}`;
      }
      docNumber = textNum;
    } else {
      query = `SELECT jsb->>'prefix' prefix FROM cat 
              WHERE class_name='cat.organizations' AND ref=$1`;
      params = [ org ];
      const resPref = await this.pool.query(query, params);
      prefix =
        resPref.rows && resPref.rows.length > 0
          ? `${resPref.rows[0].prefix}-`
          : '';
    }
    return `${prefix}${docNumber}`;
  }

  async getPaymentConfig(organization, paymentType) {
    /* eslint-disable max-len */
    const query = `select 
      b.ref, 
      jsonb_path_query_array(b.jsb->'access_keys', '$[*] ? (@.resource == "${paymentType}")') keys
    from cat b where
      b.class_name ='cat.organizations' and b.ref = '${organization}'`;
    /* eslint-enable max-len */
    const res = await this.poolSync.query(query, []);
    return res.rows[0];
  }

  updateStatus(docid, status) {
    this.getJsbDocById(docid).then((res) => {
      const jsb = res.rows[0].jsb;
      jsb.status = status;
      //    console.log(jsb);
      couchDoc.insert(jsb);
    });
  }

  static create() {
    return new DB();
  }
}

const instance = DB.create();
module.exports = instance;
