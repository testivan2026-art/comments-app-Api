import express from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import app from './src/app.js';
import { sequelize, testConnection } from './config/db.js';

dotenv.config();

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
        url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === PORT для Render ===
const PORT = process.env.PORT || 3000;

// === Запуск сервера ===
const start = async () => {
  try {
    console.log('⏳ Connecting to database...');

    // 1️⃣ Перевірка підключення до БД
    await testConnection();

    // 2️⃣ Синхронізація моделей (створить таблиці)
    await sequelize.sync();

    console.log('✅ Database synced');

    // 3️⃣ Запуск Express сервера
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 Swagger docs: /api-docs`);
    });

  } catch (err) {
    console.error('❌ Server start failed:', err);

    // Важливо для Render — щоб сервіс перезапустився
    process.exit(1);
  }
};

start();