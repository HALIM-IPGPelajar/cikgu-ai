'use strict';
/**
 * CIKGU AI – start.js
 * Entry point: starts Express web server + Telegram bot child process.
 * Run with: node start.js  OR  npm start
 */

// Catch unexpected crashes so one error can't kill the whole process
process.on('uncaughtException',  err => console.error('[uncaughtException]', err.message));
process.on('unhandledRejection', err => console.error('[unhandledRejection]', err && err.message ? err.message : err));

require('./server.js');
