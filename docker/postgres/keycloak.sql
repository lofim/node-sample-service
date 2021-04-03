CREATE USER keycloak;
ALTER ROLE keycloak WITH PASSWORD 'password';

CREATE DATABASE keycloak;

GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;
