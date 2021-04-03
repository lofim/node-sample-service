const db = require('../infra/database');

const todoAttributes = ['id', 'status', 'description'];
const tableName = 'todos';

async function listTodos(userId) {
  return db(tableName)
    .select(todoAttributes)
    .where({ user_id: userId });
}

async function getTodoById(id, userId) {
  const todos = await db(tableName)
    .select(todoAttributes)
    .where({ id, user_id: userId });

  return todos[0];
}

async function createTodo(todo, userId, trx) {
  const todos = await db(tableName)
    .returning(todoAttributes)
    .transacting(trx)
    .insert({
      status: todo.status,
      description: todo.description,
      user_id: userId,
      created_at: db.fn.now(),
    });

  return todos[0];
}

async function updateTodo(id, todo, userId, trx) {
  const { description, status } = todo;

  const todos = await db(tableName)
    .returning(todoAttributes)
    .transacting(trx)
    .update({
      description,
      status,
      updated_at: db.fn.now(),
    })
    .where({ id, user_id: userId });

  return todos[0];
}

module.exports = {
  listTodos,
  getTodoById,
  createTodo,
  updateTodo,
};
