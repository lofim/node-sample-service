import axios from 'axios';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import config from '../../config';

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

export default validateJwt;
