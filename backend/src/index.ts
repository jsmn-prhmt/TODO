import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import groupRoutes from './routes/groupRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Public Routes
  app.use('/auth', authRoutes);

  // Protected Routes
  app.use('/tasks', authMiddleware, taskRoutes);
  app.use('/groups', authMiddleware, groupRoutes);

  app.use(errorHandler);

  const port = 3001;
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
})();
