const todoRepository = require('../repository/todo-repository');
const logger = require('../infra/logger');
const NotFoundError = require('../error/not-found');
const { sendMessage } = require('../infra/kafka');
const db = require('../infra/database');

const STATUS_OPEN = 'open';

async function getTodos(userId) {
  return todoRepository.listTodos(userId);
}

async function getTodo(id, userId) {
  if (id === 10) {
    throw new Error('Cannot connect to TODO database');
  }

  const todo = await todoRepository.getTodoById(id, userId);
  if (!todo) {
    throw new NotFoundError('0002', `Could not find todo item with id: ${id}`);
  }

  return todo;
}

async function createTodo(todo, userId) {
  const newTodo = { ...todo, status: STATUS_OPEN };

  // Idealy the transactions would happen on the repository level
  // Possibly move the state transition events there instead of service layer
  await db.transaction(async (trx) => {
    const savedTodo = await todoRepository.createTodo(newTodo, userId, trx);
    await sendMessage('sample-key', savedTodo);
  });

  return newTodo;
}

async function updateTodo(id, todoUpdate, userId) {
  const todo = await todoRepository.getTodoById(id, userId);
  if (!todo) {
    throw new NotFoundError('0002', `Could not find todo item with id: ${id}`);
  }

  logger.debug(`Todo to update: ${todo}`);

  let updatedTodo;
  await db.transaction(async (trx) => {
    updatedTodo = await todoRepository.updateTodo(id, todoUpdate, userId, trx);
    await sendMessage('sample-key', updatedTodo);
  });

  return updateTodo;
}

module.exports = {
  getTodo,
  getTodos,
  createTodo,
  updateTodo,
};
