// Test setup file
// Global test configuration and utilities

// Increase timeout for longer operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});