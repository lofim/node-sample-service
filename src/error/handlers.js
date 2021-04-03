'use strict';

const logger = require('../infra/logger');
const BaseError = require('./base');
const JwtUnauthorizedError = require('express-jwt').UnauthorizedError;
const UnauthorizedError = require('./unauthorized');
const { HttpError } = require('express-openapi-validator/dist/framework/types');

/**
 * Converts openapi-validator `HttpError` into application error.
 * 
 * TODO: Termporarily use library internals to reduce the boilerplate.
 * Handle each `HttpError` separatelly with different `code`s.
 */
function openapiValidatorErrorHandler(err, req, res, next) {
    if (err instanceof HttpError) {
        throw new BaseError('0010', err.message, err.status, err);
    }

    next(err);
}

/**
 * Converts Jwt authorization error into application error.
 */
function authorizationErrorHandler(err, req, res, next) {
    if (err instanceof JwtUnauthorizedError) {
        throw new UnauthorizedError('0001', 'Could not verify JWT token', err);
    }

    next(err);
}

/**
 * Handler for application defined errors.
 * Resolves the application error into common error response format.
 */
function baseErrorResolver(err, req, res, next) {
    logger.error('BaseError caught: %s', err.stack);

    if (err instanceof BaseError) {
        res.status(err.status);
        return res.json({
            code: err.code,
            status: err.status,
            message: err.message
        });
    }

    next(err);
}

/**
 * Resolves the non application errors
 */
function unexpectedErrorResolver(err, req, res, next) {
    logger.error('Unexptected error caught: %s', err.stack);

    res.status(500);
    res.json({
        code: '0000',
        status: 500,
        message: 'Unexpected error occured!'
    });
}

module.exports = {
    openapiValidatorErrorHandler,
    authorizationErrorHandler,
    baseErrorResolver,
    unexpectedErrorResolver
};
