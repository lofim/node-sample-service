import bodyParser from 'body-parser';
import compression from 'compression';
import express, { Application, Router } from 'express';
import expressPino from 'express-pino-logger';
import helmet from 'helmet';
import * as OpenapiValidator from 'express-openapi-validator';
import path from 'path';

import config from '../../config';
import logger from '../logger';

import {
    authorizationErrorHandler,
    baseErrorResolver,
    openapiValidatorErrorHandler,
    unexpectedErrorResolver
} from './error-handlers';

export function createApp(todoRouter: Router): Application {
    const app = express();
    app.use(compression());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(expressPino({ logger }));

    app.use(OpenapiValidator.middleware(config.openapi.validator));

    // Expose the openapi spec
    const spec = path.join(__dirname, '..', '..', '..', 'api', 'api.yml');
    app.use('/spec', express.static(spec));

    // Routing
    app.use('/v1', todoRouter);

    // Error handlers are the last middleware
    app.use(openapiValidatorErrorHandler);
    app.use(authorizationErrorHandler);
    app.use(baseErrorResolver);
    app.use(unexpectedErrorResolver);

    return app;
}
