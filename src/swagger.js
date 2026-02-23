import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const setupSwagger = (app) => {
  const baseUrl =
    process.env.BASE_URL ||
    `http://localhost:${process.env.PORT || 3000}`;

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Comments API",
        version: "1.0.0",
        description: "SPA Comments Application API",
      },
      servers: [
        {
          url: baseUrl,
        },
      ],

      components: {
        schemas: {
          ErrorResponse: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Validation error",
              },
            },
          },

          Pagination: {
            type: "object",
            properties: {
              total: { type: "integer", example: 100 },
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
            },
          },

          User: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              username: { type: "string", example: "john_doe" },
              email: { type: "string", example: "john@example.com" },
              homepage: {
                type: "string",
                example: "https://example.com",
              },
              created_at: {
                type: "string",
                format: "date-time",
              },
            },
          },

          File: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              comment_id: { type: "integer", example: 5 },
              filename: { type: "string", example: "image.png" },
              type: { type: "string", example: "image" },
              path: { type: "string", example: "/uploads/image.png" },
              created_at: {
                type: "string",
                format: "date-time",
              },
            },
          },

          Comment: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              username: { type: "string", example: "john_doe" },
              email: { type: "string", example: "john@example.com" },
              text: { type: "string", example: "Hello world" },
              parent_id: {
                type: "integer",
                nullable: true,
                example: null,
              },
              created_at: {
                type: "string",
                format: "date-time",
              },
              user: {
                $ref: "#/components/schemas/User",
              },
              files: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/File",
                },
              },
            },
          },

          CommentListResponse: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Comment",
                },
              },
              pagination: {
                $ref: "#/components/schemas/Pagination",
              },
            },
          },
        },
      },
    },

    apis: ["./src/routes/*.js"],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};