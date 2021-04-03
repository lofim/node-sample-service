const axios = require('axios');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const config = require('../config');

const validateJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 2,
    jwksUri: config.auth.jwt.jwksUri,
    fetcher: async (uri) => (await axios.get(uri)).data,
  }),
  // TODO:
  // audience: audience,
  // issuer: issuer,
  algorithms: [config.auth.jwt.algorithm],
});

module.exports = validateJwt;
