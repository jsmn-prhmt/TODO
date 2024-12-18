import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { HttpError } from './HttpError';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await AppDataSource.getRepository(User).findOneBy({ id: payload.userId });
    if (!user) return next(new HttpError(401, 'Invalid token: user not found'));
    (req as any).user = user;
    next();
  } catch (e) {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
}
