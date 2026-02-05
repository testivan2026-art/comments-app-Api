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
        url: process.env.BASE_URL || 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // чекаємо поки БД реально підніметься
    await testConnection();

    // синхронізація моделей
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 Swagger: /api-docs`);
    });
  } catch (err) {
    console.error('Server start failed ❌', err);
    process.exit(1); // Render побачить, що сервіс впав
  }
};

start();