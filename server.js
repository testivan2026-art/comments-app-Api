import dotenv from 'dotenv';
dotenv.config();

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import app from './src/app.js';
import { sequelize, testConnection } from './config/db.js';
import './src/models/index.js';

// === Swagger config ===
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === PORT (Render injects this) ===
const PORT = process.env.PORT || 3000;

// === Start server ===
const start = async () => {
  try {
    await testConnection();
    console.log('✅ DB connected');

    await sequelize.sync({ alter: false });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1); 
  }
};

start();