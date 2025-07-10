import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateRequest } from "../../middleware/validateRequest";

// Mock express objects
const mockRequest = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any = {}
): Partial<Request> => ({
  body,
  query,
  params,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = (): NextFunction => jest.fn();

describe("validateRequest middleware", () => {
  describe("with valid schema", () => {
    const schema = z.object({
      body: z.object({
        name: z.string().min(1),
        age: z.number().min(0),
      }),
      query: z.object({
        sort: z.string().optional(),
      }),
      params: z.object({
        id: z.string(),
      }),
    });

    it("should call next() when validation passes", async () => {
      const req = mockRequest(
        { name: "John", age: 25 },
        { sort: "asc" },
        { id: "123" }
      ) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      const middleware = validateRequest(schema);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 when body validation fails", async () => {
      const req = mockRequest(
        { name: "", age: -1 }, // Invalid body
        { sort: "asc" },
        { id: "123" }
      ) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      const middleware = validateRequest(schema);
      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: expect.arrayContaining([
          expect.objectContaining({
            field: expect.stringContaining("body"),
            message: expect.any(String),
          }),
        ]),
      });
    });

    it("should return validation errors for multiple fields", async () => {
      const req = mockRequest(
        { name: "", age: -1 }, // Multiple validation errors
        {},
        { id: "123" }
      ) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      const middleware = validateRequest(schema);
      await middleware(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.arrayContaining([
            expect.objectContaining({
              field: "body.name",
              message: expect.stringContaining(
                "String must contain at least 1 character"
              ),
            }),
            expect.objectContaining({
              field: "body.age",
              message: expect.stringContaining(
                "Number must be greater than or equal to 0"
              ),
            }),
          ]),
        })
      );
    });
  });

  describe("with signature verification schema", () => {
    const signatureSchema = z.object({
      body: z.object({
        message: z.string().min(1, "Message is required"),
        signature: z
          .string()
          .regex(/^0x[a-fA-F0-9]+$/, "Invalid signature format"),
      }),
    });

    it("should validate correct signature request", async () => {
      const req = mockRequest({
        message: "Hello world",
        signature: "0x1234567890abcdef",
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      const middleware = validateRequest(signatureSchema);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should reject empty message", async () => {
      const req = mockRequest({
        message: "",
        signature: "0x1234567890abcdef",
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      const middleware = validateRequest(signatureSchema);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.arrayContaining([
            expect.objectContaining({
              field: "body.message",
              message: "Message is required",
            }),
          ]),
        })
      );
    });

    it("should reject invalid signature format", async () => {
      const req = mockRequest({
        message: "Hello world",
        signature: "invalid-signature",
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      const middleware = validateRequest(signatureSchema);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.arrayContaining([
            expect.objectContaining({
              field: "body.signature",
              message: "Invalid signature format",
            }),
          ]),
        })
      );
    });

    it("should handle non-ZodError exceptions", async () => {
      const req = mockRequest({
        message: "Hello world",
        signature: "0x1234567890abcdef",
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      // Mock parseAsync to throw a non-ZodError
      const originalParseAsync = signatureSchema.parseAsync;
      signatureSchema.parseAsync = jest
        .fn()
        .mockRejectedValue(new Error("Unexpected error"));

      const middleware = validateRequest(signatureSchema);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));

      // Restore original method
      signatureSchema.parseAsync = originalParseAsync;
    });
  });
});
