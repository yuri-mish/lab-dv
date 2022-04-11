'use strict';
const config = require('../config');
const dayjs = require('dayjs');
const dbf = require('../db');
const Client = require('ssh2-sftp-client');
const { couchDoc } = require('../couch');
const { sendSMS } = require('../utils');
const { v4: uuid_v4 } = require('uuid');
const { errors, ErrorWithCode } = require('../../errors');

const easyPayTerminalReportCreate = async(branch) => {
  const fBranch = branch ? ` and branch = '${branch}'` : '';
  const query = `select 
  d.branch, 
  d.jsb->>'organization' organization,
  d.id as ref, 
  d.number_doc as number, 
  d.jsb->>'doc_amount' as sum, 
  COALESCE(projects.jsb->>'id', 'otk') as doctype, 
  partners.jsb->>'name' as payer,
  d.jsb as jsb,
  labs.jsb->>'lab_number' as lab_number,
  labs.jsb->'contacts'->>'phone_corp' as lab_phone,
  org.jsb->>'edrpou' as edrpou,
  c.jsb->>'name' as pay_kind
from "doc.buyers_order" d
left join cat projects on
  projects.class_name ='cat.proj'
  and d.jsb->>'proj' = projects.ref
left join cat labs 
  on labs.class_name = 'cat.labs'
  and d.branch = labs.ref
left join cat org 
  on org.class_name = 'cat.organizations'
  and d.jsb->>'organization' = org.ref	
left join cat partners on
  partners.class_name ='cat.partners'
  and d.jsb->>'partner' = partners.ref
inner join cat c on
  c.class_name = 'cat.pay_kindes'
  and c.jsb->>'pay_form' = 'Терминал'
  and c.ref = d.jsb->>'pay_kind'
where  true
	${fBranch} 
    and d."date" > $1 
	and not d.jsb->'ext_json'?'EasyPaySent'
order by d.branch, d."date"`;

  const params = [ dayjs().subtract(45, 'day').format('YYYYMMDD') ];

  //console.log(query);

  const respOrders = await dbf.poolSync.query(query, params);
  if (respOrders.rows.length < 1) {
    return { empty: true };
  }

  const uniqBranches = [ ...new Set(respOrders.rows.map((item) => item.branch)) ];

  const retValue = [];

  uniqBranches.forEach((_branch) => {
    const filtOrders = respOrders.rows.filter((row) => row.branch === _branch);
    const lab = filtOrders[0].lab_number;
    const number = `${lab}-${dayjs().format('YYYYMMDDHHmmss')}`;
    const edrpou = filtOrders[0].edrpou;
    const code = Math.random().toString(10).substring(2, 7).toLocaleUpperCase();
    const date = dayjs().toISOString();
    const orders = filtOrders.map((row) => ({
      number: row.number,
      sum:
        row.pay_kind === 'Т300'
          ? row.jsb.services.reduce(
            (total, row) => total + (row.quantity * 300),
            0
          )
          : Number(row.sum),
      purpose: 'за послуги',
      payer: row.payer,
      doctype: row.doctype || 'otk',
      ref: row.ref,
      pay_kind: row.pay_kind,
    }));
    const amount = orders.reduce((total, row) => total + Number(row.sum), 0);
    retValue.push({
      report: {
        lab,
        number,
        edrpou,
        code,
        date,
        amount,
        orders,
      },
      lab_phone: filtOrders[0]?.lab_phone,
      branch
    });
  });

  //используем так , поскольку клиент sftp не поддерживает мултиконнектность
  const client = new Client();
  await connectSFTP(client).catch((err) => {
    console.log('err sftp connect:', err);
    return { err: { code: err.code, message: err.message } };
  });

  const dirName = 'Loader';
  //const dirName = 'Test';
  await Promise.all(retValue.map(async(pack) => {
    const report = pack.report;
    await sendFileEasyPay({
      sftp: client,
      dir: dirName,
      fileName: report.number,
      data: report,
      branch
    }).then((res) => {
      if (!res?.err) {
        report.orders.forEach(async(orderRow) => {
        //mofify sended docs
          const res = await dbf.getJsbDocById(orderRow.ref);
          const order = res.rows[0].jsb;
          order.ext_json.EasyPaySent = true;
          couchDoc.insert(order);
        });
        if (pack.lab_phone) {
          if (dirName !== 'Test') {
            sendSMS(`easyPay code: ${report.code}`, [ pack.lab_phone ])
              .then((resp) => console.log(resp))
              .catch(() => new ErrorWithCode(errors.SMS_ERROR));
          }
        }
      }
    });
  }));

  await endSFTP(client);
  return {
    retValue,
  };
};

const connectSFTP = (sftp) => sftp.connect({
  host: config.easypay.sftpHost,
  port: config.easypay.sftpPort,
  username: config.easypay.sftpLogin,
  password: config.easypay.sftpPassw,
});

const endSFTP = async(sftp) => sftp.end();

const sendFileEasyPay = async({ sftp, dir, fileName, data, branch }) => {

  const report = data;
  const dirName = dir === undefined ? 'Loader' : dir;
  // eslint-disable-next-line new-cap
  const buf = new Buffer.from(JSON.stringify(report));
  const fullPath = `${dirName}/${fileName}.json`;

  const class_name = 'doc.easypay';
  couchDoc.insert({
    _id: `${class_name}|${uuid_v4()}`,
    class_name,
    date: dayjs().format(),
    log: 'sendFile',
    fullPath,
    jsb: report,
    department: branch
  });

  const rValue = await sftp.put(buf, fullPath).catch((err) => {
    console.log('error sftp PUT:', err);
    return { err: { code: err.code, message: err.message } };
  });

  return rValue;
};

module.exports = {
  easyPayTerminalReportCreate,
  sendFileEasyPay,
  connectSFTP,
  endSFTP,
};
