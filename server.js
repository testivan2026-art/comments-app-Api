import express from 'express';
import app from './src/app.js';
import { sequelize, testConnection } from './config/db.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// === Swagger конфігурація ===
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comments App API',
      version: '1.0.0',
      description: 'API Documentation for Comments SPA',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // усі JSDoc коментарі в маршрутах
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Підключаємо Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 3000;

const start = async () => {
  try {
    // тест підключення до БД
    await testConnection();

    // синхронізація моделей
    await sequelize.sync();

    // старт сервера
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(` Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Server start failed ❌', err);
  }
};

start();