import React from 'react';

interface Props {
  tasks: any[];
  onToggle: (id:number, completed:boolean) => void;
  onDelete: (id:number) => void;
}

const TaskList: React.FC<Props> = ({ tasks, onToggle, onDelete }) => {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <input type='checkbox' checked={task.completed} onChange={() => onToggle(task.id, task.completed)} />
          {task.title} {task.deadline ? `(Deadline: ${task.deadline})` : ''}
          <button onClick={()=>onDelete(task.id)}>X</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
