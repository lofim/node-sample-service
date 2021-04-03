# Sample node service

This repository intends to host a template of a NodeJS (micro)service.
It demonstrates various areas often encountered in development of distributes systems (see features section below).
This service follows the [12factor](https://12factor.net/) methodology.

## Features

- [-] Unit testing using [jest](https://jestjs.io/docs/getting-started) (drafted)

- [x] Configuration via environment vars
- [x] Error handling
- [x] Authentication (middleware JWT, oauth2)
- [x] Database layer - [knex.js](https://knexjs.org/) (SQL)
- [x] Database migrations
- [x] Payload validation [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator)
- [x] Service graceful shutdown
- [x] Service health probe
- [x] Service readiness probe (unable to test kafka producer & db health)
- [x] Kafka client (consumer is missing event handling)
- [ ] [Distributed tracing](https://opentelemetry.io/docs/js/getting_started/nodejs/)

## Nice to have

- [x] Docker-compose + depdendencies for local development
- [x] Eslint config
- [x] [Expose the Openapi spec](https://github.com/cdimascio/express-openapi-validator#example-express-api-server)
- [ ] Run database migrations on service init
- [ ] Use operation handlers in Openapi-validator
- [ ] Use "Problem Details" standard for API error responses (https://tools.ietf.org/html/rfc7807)
- [ ] Http client usage (axios)
- [ ] [Circuit Breaker] example (https://github.com/nodeshift/opossum)

## Tool stack

- Express web framework
- Express openapi validator
- Oauth2 JWT token validation
- Pino logger
- Knex SQL query builder (pg client)
- Axios rest client
- KafkaJS
- Jest test framework + Supertest

## Build docker image

```bash
# In repository root
docker build -f docker/Dockerfile -t node-service .
```

## Run the application locally with dependencies in Docker

```bash
# In repository root
# Start the dependencies
docker-compose -f docker/dependencies -d

# Start the service
npm start
```

## Run the application and dependencies in Docker

```bash
# In repository root
# Start the app and dependencies (database, keycloak) using single command
docker-compose -f docker/dependencies.yml -f docker/service.yml up
```

## Get access token for test.user

```bash
curl --request POST \
  --url http://localhost:8082/auth/realms/Sample/protocol/openid-connect/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data client_id=application \
  --data grant_type=password \
  --data username=test.user \
  --data password=test
```

## Call protected endpoint on the sample service

```bash
curl --request GET \
  --url http://localhost:8080/api/v1/todos \
  --header 'Authorization: Bearer <access_token_from_previous_command_result>'
```

## Run database migrations

```bash
# From project root run
npx knex migrate:latest

# To destroy
npx knex migrate:down
```
