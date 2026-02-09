import express from 'express';
import cors from 'cors';
import commentRoutes from './routes/commentRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { setupSwagger } from './swagger.js';
import path from 'path';

const app = express();

// --- CORS ---
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://comments-app-frontend-sooty.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
// --- Body parser ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Роутери ---
app.use('/comments', commentRoutes);
app.use('/files', fileRoutes);
app.use('/users', userRoutes);
app.use('/uploads', express.static(path.resolve('uploads')));

// --- Swagger ---
setupSwagger(app);

export default app;