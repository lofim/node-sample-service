const { Knex } = require('knex');
const config = require('../config');

const knex = Knex(config.database);

module.exports = knex;
