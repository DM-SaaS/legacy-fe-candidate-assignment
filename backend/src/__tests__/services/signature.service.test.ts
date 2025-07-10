import { SignatureService } from "../../services/signature.service";
import { ethers } from "ethers";

// Mock the logger to avoid console output during tests
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("SignatureService", () => {
  let signatureService: SignatureService;
  let wallet: ethers.HDNodeWallet;

  beforeEach(() => {
    signatureService = new SignatureService();
    // Create a test wallet for signing messages
    wallet = ethers.Wallet.createRandom();
  });

  describe("verifySignature", () => {
    it("should verify a valid signature and return correct signer address", async () => {
      const message = "Hello, this is a test message";
      const signature = await wallet.signMessage(message);

      const result = await signatureService.verifySignature({
        message,
        signature,
      });

      expect(result.isValid).toBe(true);
      expect(result.signer).toBe(wallet.address);
      expect(result.originalMessage).toBe(message);
      expect(result.timestamp).toBeGreaterThan(0);
      expect(typeof result.timestamp).toBe("number");
    });

    it("should handle invalid signature format gracefully", async () => {
      const message = "Hello, this is a test message";
      const invalidSignature = "invalid-signature";

      const result = await signatureService.verifySignature({
        message,
        signature: invalidSignature,
      });

      expect(result.isValid).toBe(false);
      expect(result.signer).toBe("");
      expect(result.originalMessage).toBe(message);
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("should handle malformed hex signature", async () => {
      const message = "Hello, this is a test message";
      const malformedSignature = "0xinvalid";

      const result = await signatureService.verifySignature({
        message,
        signature: malformedSignature,
      });

      expect(result.isValid).toBe(false);
      expect(result.signer).toBe("");
      expect(result.originalMessage).toBe(message);
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it("should handle empty message", async () => {
      const message = "";
      const signature = await wallet.signMessage(message);

      const result = await signatureService.verifySignature({
        message,
        signature,
      });

      expect(result.isValid).toBe(true);
      expect(result.signer).toBe(wallet.address);
      expect(result.originalMessage).toBe(message);
    });

    it("should handle long messages", async () => {
      const message = "A".repeat(1000); // Very long message
      const signature = await wallet.signMessage(message);

      const result = await signatureService.verifySignature({
        message,
        signature,
      });

      expect(result.isValid).toBe(true);
      expect(result.signer).toBe(wallet.address);
      expect(result.originalMessage).toBe(message);
    });

    it("should handle signature for different message (invalid)", async () => {
      const originalMessage = "Original message";
      const differentMessage = "Different message";
      const signature = await wallet.signMessage(originalMessage);

      const result = await signatureService.verifySignature({
        message: differentMessage,
        signature,
      });

      // ethers.verifyMessage will recover an address, but it won't be our wallet's address
      // when the message doesn't match what was originally signed
      expect(result.isValid).toBe(true); // The signature is technically valid
      expect(result.signer).not.toBe(wallet.address); // But the signer won't match
      expect(result.originalMessage).toBe(differentMessage);
    });

    it("should handle valid signature with special characters", async () => {
      const message =
        "Message with special chars: !@#$%^&*()_+-={}[]|\\:\";'<>?,./";
      const signature = await wallet.signMessage(message);

      const result = await signatureService.verifySignature({
        message,
        signature,
      });

      expect(result.isValid).toBe(true);
      expect(result.signer).toBe(wallet.address);
      expect(result.originalMessage).toBe(message);
    });

    it("should handle unicode messages", async () => {
      const message = "Unicode message: 🚀 测试 العربية";
      const signature = await wallet.signMessage(message);

      const result = await signatureService.verifySignature({
        message,
        signature,
      });

      expect(result.isValid).toBe(true);
      expect(result.signer).toBe(wallet.address);
      expect(result.originalMessage).toBe(message);
    });
  });
});
