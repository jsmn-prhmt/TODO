import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { RegisterUserDto } from '../dto/RegisterUserDto';
import { LoginUserDto } from '../dto/LoginUserDto';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HttpError } from '../middleware/HttpError';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const router = Router();

router.post('/register', async (req, res, next:) => {
  try {
    const dto = plainToInstance(RegisterUserDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json({ errors });

    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOneBy({ username: dto.username });
    if (existingUser) throw new HttpError(400, 'Username already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = userRepo.create({ username: dto.username, passwordHash });
    await userRepo.save(user);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const dto = plainToInstance(LoginUserDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json({ errors });

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ username: dto.username });
    if (!user) throw new HttpError(401, 'Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new HttpError(401, 'Invalid credentials');

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
