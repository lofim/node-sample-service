'use strict';

const BaseError = require("./base");

class UnathorizedError extends BaseError {
    constructor(code, message, error) {
        super(code, message, 401, error);
    }
}

module.exports = UnathorizedError;
