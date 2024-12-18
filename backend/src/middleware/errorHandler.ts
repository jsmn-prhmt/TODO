import { Request, Response, NextFunction } from 'express';
import { HttpError } from './HttpError';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
}
