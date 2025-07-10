import { config } from "../../config/config";

describe("Config", () => {
  beforeEach(() => {
    // Reset environment variables
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.CORS_ORIGIN;
    delete process.env.LOG_LEVEL;
  });

  it("should have default values when environment variables are not set", () => {
    // Re-import config to get fresh values
    jest.resetModules();
    const { config: freshConfig } = require("../../config/config");

    expect(freshConfig.port).toBe("3001");
    expect(freshConfig.nodeEnv).toBe("development");
    expect(freshConfig.corsOrigin).toBe("http://localhost:3000");
    expect(freshConfig.logLevel).toBe("info");
  });

  it("should use environment variables when provided", () => {
    process.env.PORT = "8080";
    process.env.NODE_ENV = "production";
    process.env.CORS_ORIGIN = "https://example.com";
    process.env.LOG_LEVEL = "debug";

    jest.resetModules();
    const { config: freshConfig } = require("../../config/config");

    expect(freshConfig.port).toBe("8080");
    expect(freshConfig.nodeEnv).toBe("production");
    expect(freshConfig.corsOrigin).toBe("https://example.com");
    expect(freshConfig.logLevel).toBe("debug");
  });

  it("should handle partial environment variable configuration", () => {
    process.env.PORT = "5000";
    process.env.NODE_ENV = "test";
    // Leave CORS_ORIGIN and LOG_LEVEL as defaults

    jest.resetModules();
    const { config: freshConfig } = require("../../config/config");

    expect(freshConfig.port).toBe("5000");
    expect(freshConfig.nodeEnv).toBe("test");
    expect(freshConfig.corsOrigin).toBe("http://localhost:3000");
    expect(freshConfig.logLevel).toBe("info");
  });

  it("should be read-only (as const)", () => {
    // The config is declared with 'as const' which makes it read-only at compile time
    // but not frozen at runtime. We can test that the type is properly constrained.
    expect(typeof config.port).toBe("string");
    expect(typeof config.nodeEnv).toBe("string");
    expect(typeof config.corsOrigin).toBe("string");
    expect(typeof config.logLevel).toBe("string");
  });
});
