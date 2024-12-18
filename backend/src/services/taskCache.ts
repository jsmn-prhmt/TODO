interface CacheKey {
    userId: number;
    page: number;
    limit: number;
  }
  
  const taskCache = new Map<string, any[]>();
  
  function genKey(userId: number, page: number, limit: number): string {
    return `${userId}:${page}:${limit}`;
  }
  
  export function getCachedTasks(userId: number, page: number, limit: number): any[] | undefined {
    return taskCache.get(genKey(userId, page, limit));
  }
  
  export function setCachedTasks(userId: number, page: number, limit: number, tasks: any[]) {
    taskCache.set(genKey(userId, page, limit), tasks);
  }
  
  // Invalidate all caches for a user
  export function invalidateUserTasksCache(userId: number) {
    for (let key of taskCache.keys()) {
      if (key.startsWith(userId + ':')) {
        taskCache.delete(key);
      }
    }
  }
  