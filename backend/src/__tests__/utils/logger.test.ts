const mockCreateLogger = jest.fn();
const mockTransports = {
  Console: jest.fn(),
};
const mockFormat = {
  colorize: jest.fn(() => "colorize"),
  timestamp: jest.fn(() => "timestamp"),
  printf: jest.fn(() => "printf"),
  combine: jest.fn((...args) => `combine(${args.join(",")})`),
  json: jest.fn(() => "json"),
};

jest.mock("winston", () => ({
  createLogger: mockCreateLogger,
  transports: mockTransports,
  format: mockFormat,
}));

// Mock config to test different environments
jest.mock("../../config/config", () => ({
  config: {
    logLevel: "info",
    nodeEnv: "development",
  },
}));

describe("Logger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should create logger with development format in development environment", () => {
    // Mock config for development
    jest.doMock("../../config/config", () => ({
      config: {
        logLevel: "debug",
        nodeEnv: "development",
      },
    }));

    require("../../utils/logger");

    expect(mockCreateLogger).toHaveBeenCalledWith({
      level: "debug",
      format: "combine(colorize,timestamp,printf)",
      transports: [expect.any(mockTransports.Console)],
    });
  });

  it("should create logger with production format in production environment", () => {
    // Mock config for production
    jest.doMock("../../config/config", () => ({
      config: {
        logLevel: "warn",
        nodeEnv: "production",
      },
    }));

    require("../../utils/logger");

    expect(mockCreateLogger).toHaveBeenCalledWith({
      level: "warn",
      format: "combine(timestamp,json)",
      transports: [expect.any(mockTransports.Console)],
    });
  });

  it("should use development format for non-production environments", () => {
    // Mock config for test environment
    jest.doMock("../../config/config", () => ({
      config: {
        logLevel: "error",
        nodeEnv: "test",
      },
    }));

    require("../../utils/logger");

    expect(mockCreateLogger).toHaveBeenCalledWith({
      level: "error",
      format: "combine(colorize,timestamp,printf)",
      transports: [expect.any(mockTransports.Console)],
    });
  });

  it("should create winston.transports.Console instance", () => {
    require("../../utils/logger");

    expect(mockTransports.Console).toHaveBeenCalled();
  });

  it("should call winston format methods correctly", () => {
    require("../../utils/logger");

    expect(mockFormat.colorize).toHaveBeenCalled();
    expect(mockFormat.timestamp).toHaveBeenCalled();
    expect(mockFormat.printf).toHaveBeenCalled();
    expect(mockFormat.combine).toHaveBeenCalled();
  });

  it("should export the created logger instance", () => {
    const mockLoggerInstance = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockCreateLogger.mockReturnValue(mockLoggerInstance);

    const { logger } = require("../../utils/logger");

    expect(logger).toBe(mockLoggerInstance);
  });
});
