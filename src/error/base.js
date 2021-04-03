class BaseError extends Error {
  constructor(code, message, status = 500, error) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;

    if (error) {
      this.stack = `${this.stack
      }\n\nNested stack: ${error.stack}`;
    }
  }
}

module.exports = BaseError;
