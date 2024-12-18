import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import groupRoutes from './routes/groupRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', authMiddleware, taskRoutes);
app.use('/groups', authMiddleware, groupRoutes);
app.use(errorHandler);

export default app;
