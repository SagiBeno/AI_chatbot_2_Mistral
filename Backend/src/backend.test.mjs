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
  test('GET /messages', () => {
    const mockResults = [{ id: 1, thread_id: 1, role: 'user', message_content: 'Hello' }];
    const mockFields = [];
    connection.query.mockResolvedValue([mockResults, mockFields]);
    expect('TODO').toBe('TODO')
  });
});

describe('POST /messages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should insert a message with valid data', () => {
    const mockResult = { insertId: 1, affectedRows: 1 };
    connection.execute.mockResolvedValue([mockResult, []]);
    expect('TODO').toBe('TODO')
  });

  it('should return 400 for invalid data', () => {
    connection.execute.mockRejectedValue(new Error('Invalid data'));
    expect('TODO').toBe('TODO')
  });
});
