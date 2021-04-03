const http = require('http');

const { createTerminus } = require('@godaddy/terminus');
const { shutdownConfig } = require('./infra/shutdown');
const kafka = require('./infra/kafka');

const app = require('./app');
const config = require('./config');
const logger = require('./infra/logger');

async function initService() {
  // HTTP server
  const server = http.createServer(app);

  // Connect Kafka client producer & consumer
  await kafka.init();

  // Graceful shutdown
  createTerminus(server, shutdownConfig);

  // Start server
  server.listen(config.server.port, () => logger.info('Server listening on port: %d', config.server.port));
}

initService()
  .catch((e) => logger.error(`Service error: ${e}`));
