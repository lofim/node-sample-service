const request = require('supertest');
const app = require('./app');
const todoService = require('./service/todo-service');

// mock implementation detail
jest.mock('./service/todo-service');

describe('Fetch todo', () => {
  test('It should response the GET method', async () => {
    // given
    const expectedResponseBody = { description: 'Test Item', id: 11111 };
    todoService.getTodo.mockResolvedValue(expectedResponseBody);

    // when
    const response = await request(app).get('/api/v1/todos/1');

    // then
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedResponseBody);
  });
});

describe('Fetch todos', () => {
  test('It should return unauthorized when no token was provided', async () => {
    // given
    const expectedResponseBody = { status: 401, code: '0001', message: 'Could not verify JWT token' };
    todoService.getTodo.mockResolvedValue(expectedResponseBody);

    // when
    const response = await request(app).get('/api/v1/todos');

    // then
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(expectedResponseBody);
  });
});
