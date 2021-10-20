import request from 'supertest';
import { createApp } from './app';
import { createRouter } from './todo-resource';

import fs from 'fs/promises';
import path from 'path';
import { TodoUseCase } from '../../domain/usecases/todo-usecase';

describe('Application', () => {
    test('It should response with API spec', async () => {
        // given
        const expectedResponseBody = (await fs.readFile(path.join(__dirname, '../../../api/api.yml'))).toString();
        const app = null;
        // when
        const response = await request(app).get('/spec');

        // then
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual(expectedResponseBody);
    });
});

describe('Fetch todos', () => {
    test('It should return unauthorized when no token was provided', async () => {
        // given
        const todoRepositoryMock = jest.mock
        const todoUseCase = new TodoUseCase(todoRepositoryMock);
        const todoRouter = createRouter(todoUseCase);
        const app = createApp(todoRouter);
        const expectedResponseBody = { status: 401, code: '0010', message: 'Authorization header required' };

        // when
        const response = await request(app)
            .get('/v1/todos');

        // then
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual(expectedResponseBody);
    });
});
