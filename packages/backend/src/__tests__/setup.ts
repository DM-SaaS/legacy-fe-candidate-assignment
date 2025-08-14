import { jest } from '@jest/globals';

global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.CORS_ORIGIN = 'http://localhost:5173';

describe('Test Setup', () => {
  it('has test environment set up', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
}); 