import { Request, Response, NextFunction } from "express";
import { requestLogger } from "../../middleware/requestLogger";

// Mock the logger
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
  },
}));

import { logger } from "../../utils/logger";

// Mock express objects
const mockRequest = (method = "GET", url = "/test"): Partial<Request> => ({
  method,
  url,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.statusCode = 200;
  res.on = jest.fn();
  return res;
};

const mockNext = (): NextFunction => jest.fn();

describe("requestLogger middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Date.now mock
    jest.spyOn(Date, "now").mockRestore();
  });

  it("should log request details when response finishes", done => {
    const req = mockRequest("POST", "/api/test") as Request;
    const res = mockResponse() as Response;
    const next = mockNext();

    // Mock Date.now to control timing
    const startTime = 1000;
    const endTime = 1150;
    const mockDateNow = jest
      .spyOn(Date, "now")
      .mockReturnValueOnce(startTime)
      .mockReturnValueOnce(endTime);

    // Mock res.on to immediately trigger the 'finish' event
    res.on = jest.fn().mockImplementation((event, callback) => {
      if (event === "finish") {
        setImmediate(() => {
          res.statusCode = 201;
          callback();

          expect(logger.info).toHaveBeenCalledWith("Request processed", {
            method: "POST",
            url: "/api/test",
            status: 201,
            duration: "150ms",
          });

          mockDateNow.mockRestore();
          done();
        });
      }
      return res;
    });

    requestLogger(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should handle different HTTP methods and status codes", done => {
    const req = mockRequest("DELETE", "/api/users/123") as Request;
    const res = mockResponse() as Response;
    const next = mockNext();

    // Mock timing
    const mockDateNow = jest
      .spyOn(Date, "now")
      .mockReturnValueOnce(2000)
      .mockReturnValueOnce(2025);

    res.on = jest.fn().mockImplementation((event, callback) => {
      if (event === "finish") {
        setImmediate(() => {
          res.statusCode = 404;
          callback();

          expect(logger.info).toHaveBeenCalledWith("Request processed", {
            method: "DELETE",
            url: "/api/users/123",
            status: 404,
            duration: "25ms",
          });

          mockDateNow.mockRestore();
          done();
        });
      }
      return res;
    });

    requestLogger(req, res, next);
  });

  it("should handle very fast requests (0ms duration)", done => {
    const req = mockRequest("GET", "/health") as Request;
    const res = mockResponse() as Response;
    const next = mockNext();

    // Mock same timestamp for start and end
    const mockDateNow = jest.spyOn(Date, "now").mockReturnValue(5000);

    res.on = jest.fn().mockImplementation((event, callback) => {
      if (event === "finish") {
        setImmediate(() => {
          res.statusCode = 200;
          callback();

          expect(logger.info).toHaveBeenCalledWith("Request processed", {
            method: "GET",
            url: "/health",
            status: 200,
            duration: "0ms",
          });

          mockDateNow.mockRestore();
          done();
        });
      }
      return res;
    });

    requestLogger(req, res, next);
  });

  it("should handle requests with query parameters", done => {
    const req = mockRequest("GET", "/api/search?q=test&limit=10") as Request;
    const res = mockResponse() as Response;
    const next = mockNext();

    const mockDateNow = jest
      .spyOn(Date, "now")
      .mockReturnValueOnce(3000)
      .mockReturnValueOnce(3100);

    res.on = jest.fn().mockImplementation((event, callback) => {
      if (event === "finish") {
        setImmediate(() => {
          res.statusCode = 200;
          callback();

          expect(logger.info).toHaveBeenCalledWith("Request processed", {
            method: "GET",
            url: "/api/search?q=test&limit=10",
            status: 200,
            duration: "100ms",
          });

          mockDateNow.mockRestore();
          done();
        });
      }
      return res;
    });

    requestLogger(req, res, next);
  });
});
