'use strict';

module.exports = {
    logger: {
        level: process.env.LOGGER_LEVEL || 'debug',
        prettyPrint: !(process.env.LOG_JSON === 'true')
    },
    server: {
        port: parseInt(process.env.PORT, 10) || 8080,
        shutdownTimeoutMs: process.env.SHUTDOWN_TIMEOUT_MS || 1000,
        beforeShutdownTimeoutMs: process.env.BEFORE_SHUTDOWN_TIMEOUT_MS || 0,
    },
    auth: {
        jwt: {
            algorithm: 'RS256',
            jwksUri: process.env.JWKS_URI || 'http://localhost:8082/auth/realms/Sample/protocol/openid-connect/certs',
            issuer: process.env.JWT_ISSUER || 'issuer',
        }
    },
    database: {
        client: process.env.DB_CLIENT || 'pg',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'svc',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_DATABASE || 'svc'
        },
        pool: {
            min: parseInt(process.env.DB_POOL_MIN) || 0,
            max: parseInt(process.env.DB_POOL_MAX) || 7 
        }
    },
    kafka: {
        clientId: process.env.KAFKA_CLIENT_ID || 'sample-microservice',
        brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
        topic: process.env.KAFKA_TOPIC || 'default-topic',
        groupId: process.env.KAFKA_GROUP_ID || 'default-group-id'
    },
    openapi: {
        validator: {
            apiSpec: './api/api.yml',
            validateResponses: true
        }
    }
};
