const pino = require('pino');
const config = require('../config');

const logger = pino(config.logger);

module.exports = logger;
