import React from 'react';

function TaskItem({ task, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task);
    }
  };

  return (
    <li className="task-item">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <span className="status">{task.status}</span>
      <button onClick={handleDelete} className="delete-btn">🗑</button>
    </li>
  );
}

export default TaskItem;
