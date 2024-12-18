import request from 'supertest';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../testApp';

describe('Task API', () => {
  let token: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    const userRepo = AppDataSource.getRepository(User);
    const passwordHash = await bcrypt.hash('testpass', 10);
    const user = userRepo.create({username:'testuser', passwordHash});
    await userRepo.save(user);

    token = jwt.sign({ userId: user.id, username: user.username }, 'secretkey', { expiresIn: '1h' });
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it('should create a task', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({title: 'Test Task'});
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Task');
  });
});
