import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IAM Authentication & Authorization API",
      version: "1.0.0",
      description:
        "Interactive API documentation for IAM authentication flows, token refresh, and session management.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your access token retrieved from /auth/login or /auth/refresh",
        },
      },
      schemas: {
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePassword123!",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePassword123!",
            },
          },
        },
        ForgotPasswordInput: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
          },
        },
        ResetPasswordInput: {
          type: "object",
          required: ["password"],
          properties: {
            password: {
              type: "string",
              format: "password",
              example: "NewSecurePassword123!",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            refreshToken: {
              type: "string",
              example: "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...",
            },
            user: {
              type: "object",
              properties: {
                id: { type: "string", example: "usr_12345" },
                email: { type: "string", example: "john@example.com" },
              },
            },
          },
        },
        MessageResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: {
              type: "string",
              example: "Invalid credentials or unauthorized",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
