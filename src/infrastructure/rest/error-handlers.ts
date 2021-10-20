const JwtUnauthorizedError = require('express-jwt').UnauthorizedError;

import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'express-openapi-validator/dist/framework/types';
import logger from '../logger';

import { BaseError, UnauthorizedError } from '../../domain/error';

/**
 * Converts openapi-validator `HttpError` into application error.
 *
 * TODO: Termporarily use library internals to reduce the boilerplate.
 * Handle each `HttpError` separatelly with different `code`s.
 */
export function openapiValidatorErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        throw new BaseError('0010', err.message, err.status, err);
    }

    next(err);
}

/**
 * Converts Jwt authorization error into application error.
 */
export function authorizationErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof JwtUnauthorizedError) {
        throw new UnauthorizedError('0001', 'Could not verify JWT token', err);
    }

    next(err);
}

/**
 * Handler for application defined errors.
 * Resolves the application error into common error response format.
 */
export function baseErrorResolver(err: BaseError, req: Request, res: Response, next: NextFunction) {
    logger.error('BaseError caught: %s', err.stack);

    if (err instanceof BaseError) {
        res.status(err.status);
        return res.json({
            code: err.code,
            status: err.status,
            message: err.message,
        });
    }

    return next(err);
}

/**
 * Resolves the non application errors
 */
export function unexpectedErrorResolver(err: Error, req: Request, res: Response) {
    logger.error('Unexptected error caught: %s', err.stack);

    res.status(500);
    res.json({
        code: '0000',
        status: 500,
        message: 'Unexpected error occured!',
    });
}
