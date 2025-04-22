import React, { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [trash, setTrash] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка при загрузке задач');
        setLoading(false);
      });
  }, []);

  const addTask = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const deleteTask = (task) => {
    setTasks(tasks.filter(t => t.id !== task.id));
    setTrash([task, ...trash]);
  };

  const restoreTask = (task) => {
    setTrash(trash.filter(t => t.id !== task.id));
    setTasks([task, ...tasks]);
  };

  const removeForever = (task) => {
    setTrash(trash.filter(t => t.id !== task.id));
  };

  return (
    <div className="container">
      <h1>📋 SnellForce — Task Manager</h1>
      <button className="toggle-btn" onClick={() => setShowTrash(!showTrash)}>
        {showTrash ? '⬅ Вернуться к задачам' : '🗑 Открыть корзину'}
      </button>

      {showTrash ? (
        <>
          <h2>🗑 Корзина</h2>
          <ul className="task-list">
            {trash.length ? (
              trash.map(task => (
                <li key={task.id} className="task-item deleted">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="trash-buttons">
                    <button onClick={() => restoreTask(task)}>♻️ Восстановить</button>
                    <button onClick={() => removeForever(task)}>❌ Удалить навсегда</button>
                  </div>
                </li>
              ))
            ) : (
              <p>Корзина пуста</p>
            )}
          </ul>
        </>
      ) : (
        <>
          <TaskForm onAdd={addTask} />
          {loading ? <p className="loader">Загрузка...</p> : error ? <p className="error">{error}</p> : <TaskList tasks={tasks} onDelete={deleteTask} />}
        </>
      )}
    </div>
  );
}

export default App;
