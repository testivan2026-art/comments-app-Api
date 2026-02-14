import express from 'express';
import cors from 'cors';
import session from 'express-session';
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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
app.use(session({
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    maxAge: 10 * 60 * 1000 // 10 хвилин
  }
}));

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