import request from "supertest";
import express from "express";
import { ethers } from "ethers";
import signatureRoutes from "../../routes/signature.routes";

// Mock the logger
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the signature service
jest.mock("../../services/signature.service", () => ({
  signatureService: {
    verifySignature: jest.fn(),
  },
}));

import { signatureService } from "../../services/signature.service";

describe("Signature Routes", () => {
  let app: express.Application;
  let wallet: ethers.HDNodeWallet;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api", signatureRoutes);

    wallet = ethers.Wallet.createRandom();
    jest.clearAllMocks();
  });

  describe("POST /api/verify-signature", () => {
    it("should verify valid signature successfully", async () => {
      const message = "Hello, test message";
      const signature = await wallet.signMessage(message);

      const mockResult = {
        isValid: true,
        signer: wallet.address,
        originalMessage: message,
        timestamp: Date.now(),
      };

      (signatureService.verifySignature as jest.Mock).mockResolvedValue(
        mockResult
      );

      const response = await request(app)
        .post("/api/verify-signature")
        .send({ message, signature })
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(signatureService.verifySignature).toHaveBeenCalledWith({
        message,
        signature,
      });
    });

    it("should return validation error for missing message", async () => {
      const response = await request(app)
        .post("/api/verify-signature")
        .send({ signature: "0x1234567890abcdef" })
        .expect(400);

      expect(response.body).toEqual({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: expect.arrayContaining([
          expect.objectContaining({
            field: "body.message",
            message: expect.stringMatching(/required/i),
          }),
        ]),
      });
    });

    it("should return validation error for missing signature", async () => {
      const response = await request(app)
        .post("/api/verify-signature")
        .send({ message: "Hello world" })
        .expect(400);

      expect(response.body).toEqual({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: expect.arrayContaining([
          expect.objectContaining({
            field: "body.signature",
            message: expect.any(String),
          }),
        ]),
      });
    });

    it("should return validation error for empty message", async () => {
      const response = await request(app)
        .post("/api/verify-signature")
        .send({ message: "", signature: "0x1234567890abcdef" })
        .expect(400);

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "body.message",
            message: expect.stringMatching(/required/i),
          }),
        ])
      );
    });

    it("should return validation error for invalid signature format", async () => {
      const response = await request(app)
        .post("/api/verify-signature")
        .send({ message: "Hello world", signature: "invalid-signature" })
        .expect(400);

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "body.signature",
            message: "Invalid signature format",
          }),
        ])
      );
    });

    it("should handle service errors gracefully", async () => {
      const message = "Hello world";
      const signature = "0x1234567890abcdef";

      (signatureService.verifySignature as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      // We don't expect a specific status here because it depends on error handling
      await request(app)
        .post("/api/verify-signature")
        .send({ message, signature });

      expect(signatureService.verifySignature).toHaveBeenCalledWith({
        message,
        signature,
      });
    });

    it("should validate signature format with correct hex pattern", async () => {
      const validSignatures = [
        "0x1234567890abcdef",
        "0xABCDEF1234567890",
        "0x0000000000000000",
        "0xffffffffffffffff",
      ];

      for (const signature of validSignatures) {
        const mockResult = {
          isValid: true,
          signer: wallet.address,
          originalMessage: "test",
          timestamp: Date.now(),
        };

        (signatureService.verifySignature as jest.Mock).mockResolvedValue(
          mockResult
        );

        await request(app)
          .post("/api/verify-signature")
          .send({ message: "test", signature })
          .expect(200);
      }
    });

    it("should reject invalid signature formats", async () => {
      const invalidSignatures = [
        "invalid-signature",
        "1234567890abcdef", // Missing 0x prefix
        "0xGHIJKL", // Invalid hex characters
        "0x", // Empty hex
        "", // Empty string
      ];

      for (const signature of invalidSignatures) {
        await request(app)
          .post("/api/verify-signature")
          .send({ message: "test", signature })
          .expect(400);
      }
    });

    it("should handle various message types", async () => {
      const messages = [
        "Simple message",
        "Message with special chars: !@#$%^&*()",
        "🚀 Unicode message 测试",
        "Very long message: " + "A".repeat(1000),
        "123456789",
        "true",
      ];

      const mockResult = {
        isValid: true,
        signer: wallet.address,
        originalMessage: "",
        timestamp: Date.now(),
      };

      for (const message of messages) {
        (signatureService.verifySignature as jest.Mock).mockResolvedValue({
          ...mockResult,
          originalMessage: message,
        });

        const signature = "0x1234567890abcdef";

        const response = await request(app)
          .post("/api/verify-signature")
          .send({ message, signature })
          .expect(200);

        expect(response.body.originalMessage).toBe(message);
      }
    });
  });
});
