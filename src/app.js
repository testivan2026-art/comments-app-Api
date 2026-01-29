import express from 'express';
import commentRoutes from './routes/commentRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { setupSwagger } from './swagger.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Роутери
app.use('/comments', commentRoutes);
app.use('/files', fileRoutes);
app.use('/users', userRoutes);

// Swagger
setupSwagger(app);

export default app;