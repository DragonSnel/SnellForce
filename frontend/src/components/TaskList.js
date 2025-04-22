import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onDelete }) {
  if (!tasks.length) return <p>Задач пока нет</p>;

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default TaskList;
