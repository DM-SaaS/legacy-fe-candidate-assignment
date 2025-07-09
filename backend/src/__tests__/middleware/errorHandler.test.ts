import { Request, Response, NextFunction } from "express";
import { AppError, errorHandler } from "../../middleware/errorHandler";

// Mock the logger
jest.mock("../../utils/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

// Mock express objects
const mockRequest = (): Partial<Request> => ({
  url: "/test",
  method: "GET",
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.headersSent = false;
  return res;
};

const mockNext = (): NextFunction => jest.fn();

describe("errorHandler middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("AppError", () => {
    it("should create AppError with default values", () => {
      const error = new AppError("Test error");

      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe("INTERNAL_ERROR");
      expect(error.isOperational).toBe(true);
    });

    it("should create AppError with custom values", () => {
      const error = new AppError("Custom error", 400, "CUSTOM_ERROR", false);

      expect(error.message).toBe("Custom error");
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe("CUSTOM_ERROR");
      expect(error.isOperational).toBe(false);
    });
  });

  describe("errorHandler function", () => {
    it("should handle AppError correctly", () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;
      const next = mockNext();
      const error = new AppError("Validation failed", 400, "VALIDATION_ERROR");

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
      });
    });

    it("should handle generic Error as 500", () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;
      const next = mockNext();
      const error = new Error("Something went wrong");

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        statusCode: 500,
      });
    });

    it("should call next if headers already sent", () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;
      res.headersSent = true;
      const next = mockNext();
      const error = new Error("Test error");

      errorHandler(error, req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should log error details", () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;
      const next = mockNext();
      const error = new Error("Test error with stack");
      error.stack = "Error: Test error\n    at test";

      errorHandler(error, req, res, next);

      const { logger } = require("../../utils/logger");
      expect(logger.error).toHaveBeenCalledWith("Error handler triggered", {
        error: "Test error with stack",
        stack: "Error: Test error\n    at test",
        url: "/test",
        method: "GET",
      });
    });

    it("should handle AppError with custom status codes", () => {
      const testCases = [
        { statusCode: 400, code: "BAD_REQUEST" },
        { statusCode: 401, code: "UNAUTHORIZED" },
        { statusCode: 403, code: "FORBIDDEN" },
        { statusCode: 404, code: "NOT_FOUND" },
        { statusCode: 422, code: "UNPROCESSABLE_ENTITY" },
      ];

      testCases.forEach(({ statusCode, code }) => {
        const req = mockRequest() as Request;
        const res = mockResponse() as Response;
        const next = mockNext();
        const error = new AppError("Test error", statusCode, code);

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(statusCode);
        expect(res.json).toHaveBeenCalledWith({
          error: "Test error",
          code,
          statusCode,
        });
      });
    });
  });
});
