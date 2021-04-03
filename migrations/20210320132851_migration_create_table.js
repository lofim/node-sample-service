exports.up = function (knex) {
  return knex.schema
    .createTable('todos', (table) => {
      table.increments().primary();
      table.string('status', 255).notNullable();
      table.string('description', 255).notNullable();
      table.string('user_id', 36).notNullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('todos');
};
