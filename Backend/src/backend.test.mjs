/** backend.test.mjs */
import { expect, vi, describe, test, beforeEach, it } from 'vitest';
import request from 'supertest';
import { app, port, connection } from './server.mjs';

// Mock the database connection with the correct default export
vi.mock('mysql2/promise', () => {
  const mockConnection = { 
    query: vi.fn(),
    execute: vi.fn()
  };
  return {
    default: {
      createConnection: vi.fn().mockResolvedValue(mockConnection)
    }
  };
});

describe('Server connections', () => {
  test('backend port', () => {
    expect(port).toBe(3333)
  });

  test('MySQL connection', () => {
    expect(connection).toBeDefined();
    expect(connection.execute).toBeDefined();
  });

  test('app', () => {
    expect(app).toBeDefined();
  });
});

describe('Raw test endpoints', () => {
  test('GET /messages', async () => {
    const mockResults = [{ id: 1, thread_id: 1, role: 'user', message_content: 'Hello' }];
    const mockFields = [];
    connection.execute.mockResolvedValue([mockResults, mockFields]);

    const response = await request(app).get('/messages');

    expect(response.status).toBe(200);
    expect(response.body.results).toEqual(mockResults);
    expect(response.body.fields).toEqual(mockFields);
  });

  test('should return 404 for unknown route', async () => {
    const response = await request(app).get('/unknown-route');
  });
});

describe('POST /messages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should insert a message with valid data', async () => {
    const mockResult = { insertId: 1, affectedRows: 1 };
    const mockFields = [];

    connection.execute.mockResolvedValue([mockResult, []]);
    
    const response = await request(app)
      .post('/messages')
      .send({
        role: 'user',
        content: 'Hello world'
      });

    expect(response.status).toBe(201);
    expect(response.body.result).toEqual(mockResult);
  });

  it('should return 400 when content is missing', async () => {
    const response = await request(app)
      .post('/messages')
      .send({
        role: 'user'
      })
  });

  it('should return 400 when role is missing', async () => {
    const response = await request(app)
      .post('/messages')
      .send({
        content: 'Hello world'
      })
  });
});
