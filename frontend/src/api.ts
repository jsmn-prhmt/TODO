const BASE_URL = 'http://localhost:3001';

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json(); // { token }
}

export async function getTasks(token: string, page=1, limit=10) {
  const res = await fetch(`${BASE_URL}/tasks?page=${page}&limit=${limit}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json(); // { tasks, total, page, limit }
}

export async function createTask(token: string, taskData: any) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':'application/json'
    },
    body: JSON.stringify(taskData)
  });
  if(!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(token: string, id:number, data:any) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  });
  if(!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(token: string, id:number) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  if(!res.ok) throw new Error('Failed to delete task');
  return res.json();
}
