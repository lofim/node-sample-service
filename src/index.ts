// Instrumentation needs to be registered before everything else
require('./infra/tracing');

import http from 'http';
import { createTerminus } from '@godaddy/terminus';
import { shutdownConfig } from './infrastructure/rest/shutdown';

import config from './config';

import logger from './infrastructure/logger';
import db from './infrastructure/database/sql-client';
import * as kafka from './infrastructure/event/kafka-client';

import { createApp } from './infrastructure/rest/app';
import { createRouter } from './infrastructure/rest/todo-resource';

import { TodoUseCase } from './domain/usecases/todo-usecase';
import { TodoRepository } from './infrastructure/database/todo-repository';

async function initService() {
    const todoRepository = new TodoRepository(db);
    const todoUsecase = new TodoUseCase(todoRepository);
    const todoRouter = createRouter(todoUsecase);

    logger.info('Initializing application...');
    const app = createApp(todoRouter);
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
