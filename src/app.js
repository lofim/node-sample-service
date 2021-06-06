const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const expressPino = require('express-pino-logger');
const bodyParser = require('body-parser');
const OpenapiValidator = require('express-openapi-validator');
const path = require('path');

const config = require('./config');
const logger = require('./infra/logger');
const todoResource = require('./rest/todo-resource');

const {
  baseErrorResolver,
  authorizationErrorHandler,
  openapiValidatorErrorHandler,
  unexpectedErrorResolver,
} = require('./error/handlers');

// Server config
const app = express();
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(expressPino({ logger }));

app.use(OpenapiValidator.middleware(config.openapi.validator));

// Expose the openapi spec
const spec = path.join(__dirname, '..', 'api', 'api.yml');
app.use('/spec', express.static(spec));

// Routing
app.use('/v1', todoResource);

// Error handlers are the last middleware
app.use(openapiValidatorErrorHandler);
app.use(authorizationErrorHandler);
app.use(baseErrorResolver);
app.use(unexpectedErrorResolver);

module.exports = app;
