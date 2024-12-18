import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entity/Task';
import { Group } from '../entity/Group';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from '../dto/CreateTaskDto';
import { UpdateTaskDto } from '../dto/UpdateTaskDto';
import { HttpError } from '../middleware/HttpError';
import { getCachedTasks, setCachedTasks, invalidateUserTasksCache } from '../services/taskCache';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const dto = plainToInstance(CreateTaskDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json({ errors });

    const { title, deadline, groupId } = dto;
    const user = (req as any).user;

    let group = null;
    if (groupId) {
      group = await AppDataSource.getRepository(Group).findOneBy({ id: groupId });
      if (!group) throw new HttpError(400, 'Invalid group');
    }

    const taskRepo = AppDataSource.getRepository(Task);
    const task = taskRepo.create({ title, deadline, user, group });
    await taskRepo.save(task);
    // Invalidate cache
    invalidateUserTasksCache(user.id);
    return res.json(task);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const user = (req as any).user;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    // Check cache first
    const cached = getCachedTasks(user.id, page, limit);
    if (cached) return res.json(cached);

    const taskRepo = AppDataSource.getRepository(Task);
    const [tasks, total] = await taskRepo.findAndCount({
      where: { user: { id: user.id } },
      relations: ['group'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' }
    });

    // Cache the result
    setCachedTasks(user.id, page, limit, tasks);
    res.json({ tasks, total, page, limit });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const dto = plainToInstance(UpdateTaskDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json({ errors });

    const user = (req as any).user;
    const { id } = req.params;
    const { title, deadline, completed, groupId } = dto;

    const taskRepo = AppDataSource.getRepository(Task);
    const task = await taskRepo.findOne({
      where: { id: parseInt(id), user: { id: user.id } },
      relations: ['group']
    });

    if (!task) throw new HttpError(404, 'Not found');

    if (title !== undefined) task.title = title;
    if (deadline !== undefined) task.deadline = deadline;
    if (completed !== undefined) task.completed = completed;

    if (groupId !== undefined) {
      const groupRepo = AppDataSource.getRepository(Group);
      const newGroup = await groupRepo.findOneBy({ id: groupId });
      if (!newGroup) throw new HttpError(400, 'Invalid group');
      task.group = newGroup;
    }

    await taskRepo.save(task);
    // Invalidate cache
    invalidateUserTasksCache(user.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const taskRepo = AppDataSource.getRepository(Task);
    const task = await taskRepo.findOne({
      where: { id: parseInt(id), user: { id: user.id } }
    });
    if (!task) throw new HttpError(404, 'Not found');

    await taskRepo.remove(task);
    // Invalidate cache
    invalidateUserTasksCache(user.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
