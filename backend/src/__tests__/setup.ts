// Global test setup
import { jest } from "@jest/globals";

// Mock console methods to avoid noise in tests
const originalConsole = global.console;

beforeAll(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  global.console = originalConsole;
});

// Set timezone to UTC for consistent date testing
process.env.TZ = "UTC";
