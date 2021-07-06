// Instrumentation needs to be registered before everything else
require('./infra/tracing');

const http = require('http');
const { createTerminus } = require('@godaddy/terminus');
const { shutdownConfig } = require('./infra/shutdown');

const app = require('./app');
const config = require('./config');
const logger = require('./infra/logger');
const kafka = require('./infra/kafka');
const db = require('./infra/database');

async function initService() {
  logger.info('Initializing application...');
  const server = http.createServer(app);

  logger.info('Running database migrations...');
  await db.migrate.up(config.database);

  logger.info('Initializing kafka client...');
  await kafka.init();

  logger.info('Configuring graceful shutdown...');
  createTerminus(server, shutdownConfig);

  logger.info('Starting http server...');
  server.listen(config.server.port, () => logger.info('Server listening on port: %d', config.server.port));
}

initService()
  .catch((e) => logger.error(`Service error: ${e}`));
