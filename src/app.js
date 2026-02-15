import express from 'express';
import cors from 'cors';

import path from 'path';

import commentRoutes from './routes/commentRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import captchaRoutes from './routes/captchaRoutes.js';
import { setupSwagger } from './swagger.js';

const app = express();

/* ===============================
   TRUST PROXY 
================================ */
app.set('trust proxy', 1);

/* ===============================
   CORS
================================ */
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://comments-app-frontend-sooty.vercel.app'
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

/* ===============================
   BODY PARSER
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   SESSION (CAPTCHA)
================================ */


/* ===============================
   ROUTES
================================ */

// CAPTCHA
app.use('/captcha', captchaRoutes);

// API
app.use('/comments', commentRoutes);
app.use('/files', fileRoutes);
app.use('/users', userRoutes);

// Uploads
app.use('/uploads', express.static(path.resolve('uploads')));

/* ===============================
   SWAGGER
================================ */
setupSwagger(app);

export default app;