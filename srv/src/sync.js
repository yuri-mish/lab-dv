'use strict';

const dbf = require('./db');
const { couchCat, couchDoc, couchShed } = require('./couch');

const docSync = async() => {
  const couch = couchDoc;
  const rev = await dbf.getDocVersion();
  console.log('doc sync from seq:', rev);

  let seq;
  couch.changesReader
    .start({ since: rev, includeDocs: true, wait: true })
    .on('batch', async(batch) => {
      dbf.insertDoc(batch, (err, rec) => {
        if (err) console.log('docSync error:', err);
        seq = rec.seq;
      });

      if (seq) {
        await dbf.updateDocVersion(seq, (err) => {
          if (err) console.log(err);
        });
      }

      couch.changesReader.resume();
    })
    .on('error', (e) => console.log('docError::', e));
};

const catSync = async() => {
  const couch = couchCat;
  const rev = await dbf.getCatVersion();
  console.log('cat from seq:', rev);

  let seq;
  couch.changesReader
    .start({ since: rev, includeDocs: true })
    .on('batch', (batch) => {
      dbf.insertCat(batch, (err, rec) => {
        if (err) console.log(err);
        seq = rec.seq;
      });

      if (seq) {
        dbf.updateCatVersion(seq, (err) => {
          if (err) console.log('catSync error:', err);
        });
      }
    })
    .on('error', (e) => console.log('catError::', e));
};

const shedSync = async() => {
  const couch = couchShed;
  const rev = await dbf.getShedVersion();
  console.log('shed sync from seq:', rev);

  let seq;
  couch.changesReader
    .start({ since: rev, includeDocs: true, wait: true })
    .on('batch', async(batch) => {
      seq = dbf.insertShed(batch, (err) => {
        if (err) console.log('shedSync error:', err);
      });
      if (seq) {
        await dbf.updateShedVersion(seq, (err) => {
          if (err) console.log(err);
        });
      }
      couch.changesReader.resume();
    })
    .on('error', (e) => console.log('docError::', e));
};

module.exports = { docSync, catSync, shedSync };
