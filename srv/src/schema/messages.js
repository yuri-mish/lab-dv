'use strict';

const dbf = require('../db');
const pubsub = require('./pubsub');

const msgsArray = [ { text: 'Вітаю' } ];

let problemsLabReportsArray = [ ];
//let problemsLabReportsArray = [ { branch: '2271c167-e82e-11ea-811a-00155da29310', count: 0 } ];

const checkLabReports = () => {

  dbf.getLabReportsInfo().then((dbres) => {

    let rows = [];
    if (dbres && dbres.rowCount) rows = dbres.rows;

    problemsLabReportsArray.forEach((arrElement) => {
      const inDbRes = rows.find((el) => el.branch === arrElement.branch);
      if (inDbRes) {
        inDbRes.prev = arrElement.count;
      } else {
        rows.push({ ...arrElement, count: 0, prev: arrElement.count });
      }
    });
    rows.forEach((row) => {
      if (row.count !== row.prev) {
        pubsub.publish('HEADMESSAGE', {
          branch: row.branch,
          labReportHasError: { count: row.count, prev: row.prev }
        });
      }
    });

    problemsLabReportsArray = [ ...rows ];
  });
};

const getState = async(user) => {
  const userMessage = [];
  const resVers = await dbf.getVers();
  const vers = resVers.rows[0].vers;
  const msg = {
    branch: user.branch,
    minVers: vers,
  };
  // *******************
  msgsArray.forEach(( el ) => {
    if ( (!el.branch) || (el.branch === user.branch)) {
      userMessage.push(el);
    }
  });
  if (userMessage.length > 0) msg.message = userMessage;
  // *******************
  const inDbRes = problemsLabReportsArray.find((el) => el.branch === user.branch);
  if (inDbRes) {
    msg.labReportHasError = { count: inDbRes.count, prev: inDbRes.prev };
  }
  pubsub.publish('HEADMESSAGE', msg);
};

module.exports = { checkLabReports, getState };
