import React, { useState, useEffect } from 'react';
import { loginUser, getTasks, createTask, updateTask, deleteTask } from './api';
import TaskList from './components/TaskList';

function App() {
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('testpass');
  const [token, setToken] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const loadTasks = async () => {
    if(!token) return;
    try {
      const data = await getTasks(token, page, limit);
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  useEffect(() => {
    if(token) {
      loadTasks();
    }
  }, [token, page, limit]);

  const handleLogin = async () => {
    try {
      const { token: userToken } = await loginUser(username, password);
      setToken(userToken);
      setErrorMsg('');
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handleAdd = async () => {
    if(!newTitle || !token) return;
    try {
      await createTask(token, { title: newTitle });
      setNewTitle('');
      loadTasks();
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handleToggleComplete = async (id:number, completed:boolean) => {
    if(!token) return;
    try {
      await updateTask(token, id, {completed: !completed});
      loadTasks();
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if(!token) return;
    try {
      await deleteTask(token, id);
      loadTasks();
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1>TODO App</h1>
      {!token && (
        <div>
          <h2>Login</h2>
          <input placeholder='Username' value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
      {token && (
        <>
          <div>
            <input placeholder='Task Title' value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <button onClick={handleAdd}>Add Task</button>
          </div>
          <TaskList tasks={tasks} onToggle={handleToggleComplete} onDelete={handleDelete} />
          <div>
            <p>Page: {page} / {totalPages}</p>
            <button disabled={page <= 1} onClick={()=>setPage(p=>p-1)}>Previous</button>
            <button disabled={page >= totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        </>
      )}
      {errorMsg && <p style={{color:'red'}}>{errorMsg}</p>}
    </div>
  );
}

export default App;
