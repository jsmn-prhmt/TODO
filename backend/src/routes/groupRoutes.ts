import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Group } from '../entity/Group';
import { HttpError } from '../middleware/HttpError';
import { invalidateUserTasksCache } from '../services/taskCache';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new HttpError(400, 'Group name is required');
    }
    const groupRepo = AppDataSource.getRepository(Group);
    const group = groupRepo.create({ name });
    await groupRepo.save(group);
    // Group creation does not necessarily invalidate user's tasks cache, only if tasks depend on groups
    // We'll leave as is because tasks are not directly changed.
    res.json(group);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const groups = await AppDataSource.getRepository(Group).find();
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

export default router;
