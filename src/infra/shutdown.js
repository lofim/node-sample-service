const logger = require('./logger');
const config = require('../config');
const kafka = require('./kafka');
const db = require('./database');

/**
 * Close all connections after server received SIGINT/SIGTERM.
 */
async function onSignal() {
  logger.info('Server is starting cleanup');
  return Promise.all([
    kafka.destroy(),
    db.destroy(),
  ]);
}

/**
 * Given the readiness probes run every 5 second
 * may be worth using a bigger number so you won't
 * run into any race conditions
 */
async function beforeShutdown() {
  logger.info('Waiting for connections to complete work');
  return new Promise((resolve) => {
    setTimeout(resolve, config.server.beforeShutdownTimeoutMs);
  });
}

function onShutdown() {
  logger.info('Cleanup finished, server is shutting down');
}

/**
 *  Health is here to indicate the container is not in an invalid state.
 */
async function healthCheck() {
  // Health check should always return if the server is up
}

/**
 * Readiness check is here to indicate service is ready to handle requests.
 * K8s will not route traffic towards the container if not ready.
 */
async function readyCheck() {
  // Check if all essential dependencies are available

  // There is no way of checking the status of a kafka producer connection
  // maybe send a healthcheck event to kafka whether it succeeds?

  // Database client is connected
  // Do a select query in DB to check if it's up?
}

const shutdownConfig = {
  healthChecks: {
    // a function returning a promise indicating service health,
    '/health': healthCheck,
    '/readiness': readyCheck,
    // [optional = false] use object returned from /health verbatim in response
    verbatim: true,
  },
  // [optional] whether given health checks routes are case insensitive (defaults to false)
  caseInsensitive: false,
  // cleanup options
  // [optional = 1000] number of milliseconds before forceful exiting
  timeout: config.server.shutdownTimeoutMs,
  signals: ['SIGINT', 'SIGTERM'],
  // [optional] called before the HTTP server starts its shutdown
  beforeShutdown,
  // [optional] cleanup function, returning a promise (used to be onSigterm)
  onSignal,
  // [optional] called right before exiting
  onShutdown,
};

module.exports = {
  shutdownConfig,
};
