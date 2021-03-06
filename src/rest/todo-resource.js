const router = require('express').Router();

const validateJwt = require('../infra/jwt-auth');
const todoService = require('../service/todo-service');
const logger = require('../infra/logger');

router.get('/todos', validateJwt, async (req, res, next) => {
  try {
    // Do payload validation here or on the domain object?
    const { body } = req;
    const userId = req.user.sub;
    logger.debug('UserId: %o, body: %o', userId, body);

    const result = await todoService.getTodos(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/todos/:id', validateJwt, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    const result = await todoService.getTodo(id, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/todos', validateJwt, async (req, res, next) => {
  try {
    const { body } = req;
    const userId = req.user.sub;

    const result = await todoService.createTodo(body, userId);
    res.status(201);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/todos/:id', validateJwt, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const userId = req.user.sub;

    const result = await todoService.updateTodo(id, body, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
