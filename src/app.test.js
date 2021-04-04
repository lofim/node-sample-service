const request = require('supertest');
const app = require('./app');
const todoService = require('./service/todo-service');
const validateJwt = require('./infra/jwt-auth');

// mock implementation detail
jest.mock('./service/todo-service');
jest.mock('./infra/jwt-auth');

describe('Fetch todo', () => {
  test('It should response the GET method', async () => {
    // given
    const expectedResponseBody = { description: 'Test Item', id: 11111, status: 'open' };
    todoService.getTodo.mockResolvedValue(expectedResponseBody);
    validateJwt.mockImplementation((req, res, next) => {
      req.user = { sub: 'test-user-id' };
      next();
    });

    // when
    const response = await request(app)
      .get('/v1/todos/1')
      .set('Authorization', 'Bearer test');

    // then
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedResponseBody);
  });
});

describe('Fetch todos', () => {
  test('It should return unauthorized when no token was provided', async () => {
    // given
    const expectedResponseBody = { status: 401, code: '0010', message: 'Authorization header required' };
    todoService.getTodo.mockResolvedValue(expectedResponseBody);

    // when
    const response = await request(app)
      .get('/v1/todos');

    // then
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(expectedResponseBody);
  });
});
