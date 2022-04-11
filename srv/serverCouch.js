'use strict';

const { docSync, catSync, shedSync } = require('./src/sync');

(async() => {
  docSync();
  catSync();
  shedSync();

  process.on('SIGTERM', () => {
    console.info(
      'Got SIGTERM. Graceful shutdown start at',
      new Date().toISOString()
    );
    global.processIsGoingDown = true;
    process.exit();
  });
})();
