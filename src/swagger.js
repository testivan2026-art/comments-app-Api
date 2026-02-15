import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comments API',
      version: '1.0.0',
      description: 'SPA Comments Application API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
      {
        url: 'https://comments-app.onrender.com',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};