import validateJwt from './jwt-auth';
import { TodoUseCasePort } from '../../domain/ports/primary';
import logger from '../logger';
import { NextFunction, Request, Response, Router } from 'express';

// TODO: move these or find approriate type
interface AuthorizedUser {
    sub: string
}

interface AuthorizedRequest extends Request {
    user: AuthorizedUser
}

export function createRouter(todoUseCase: TodoUseCasePort): Router {
    const router = require('express').Router();

    router.get('/todos', validateJwt, async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        try {
            // Do payload validation here or on the domain object?
            const { body } = req;
            const userId = req.user.sub;
            logger.debug('UserId: %o, body: %o', userId, body);

            const result = await todoUseCase.getTodos(userId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    router.get('/todos/:id', validateJwt, async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userId = req.user.sub;
            const result = await todoUseCase.getTodo(parseInt(id, 10), userId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    router.post('/todos', validateJwt, async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        try {
            const { body } = req;
            const userId = req.user.sub;

            const result = await todoUseCase.createTodo(body, userId);
            res.status(201);
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    router.put('/todos/:id', validateJwt, async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { body } = req;
            const userId = req.user.sub;

            const result = await todoUseCase.updateTodo(parseInt(id, 10), body, userId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    return router;
}
