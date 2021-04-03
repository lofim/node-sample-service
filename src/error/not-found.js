'use strict';

const BaseError = require("./base");

class NotFoundError extends BaseError {
    constructor(code, message, error) {
        super(code, message, 404, error);
    }
}

module.exports = NotFoundError;
