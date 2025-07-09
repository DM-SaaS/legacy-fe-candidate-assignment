import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./config";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dynamic Wallet Backend API",
      version: "1.0.0",
      description:
        "Backend API for Dynamic Wallet application with signature verification functionality",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url:
          config.nodeEnv === "production"
            ? "https://your-production-domain.com"
            : `http://localhost:${config.port}`,
        description:
          config.nodeEnv === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      schemas: {
        SignatureVerificationRequest: {
          type: "object",
          required: ["message", "signature"],
          properties: {
            message: {
              type: "string",
              description: "The original message that was signed",
              example: "Hello, this is a test message",
            },
            signature: {
              type: "string",
              pattern: "^0x[a-fA-F0-9]+$",
              description: "The cryptographic signature in hexadecimal format",
              example: "0x1234567890abcdef...",
            },
          },
        },
        SignatureVerificationResponse: {
          type: "object",
          properties: {
            isValid: {
              type: "boolean",
              description: "Whether the signature is valid",
              example: true,
            },
            signer: {
              type: "string",
              description: "The recovered wallet address of the signer",
              example: "0x742d35Cc6634C0532925a3b8D1234567890abcdef",
            },
            originalMessage: {
              type: "string",
              description: "The original message that was verified",
              example: "Hello, this is a test message",
            },
            timestamp: {
              type: "number",
              description: "Unix timestamp when verification was performed",
              example: 1703097600000,
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Server status",
              example: "ok",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Current server timestamp",
              example: "2023-12-20T15:30:00.000Z",
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Validation failed",
            },
            code: {
              type: "string",
              example: "VALIDATION_ERROR",
            },
            statusCode: {
              type: "number",
              example: 400,
            },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "body.message",
                  },
                  message: {
                    type: "string",
                    example: "Message is required",
                  },
                },
              },
            },
          },
        },
        ServerError: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Internal server error",
            },
            code: {
              type: "string",
              example: "INTERNAL_ERROR",
            },
            statusCode: {
              type: "number",
              example: 500,
            },
          },
        },
      },
      responses: {
        ValidationError: {
          description: "Validation Error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationError",
              },
            },
          },
        },
        ServerError: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ServerError",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Signature",
        description: "Cryptographic signature verification",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

export const specs = swaggerJsdoc(options);
