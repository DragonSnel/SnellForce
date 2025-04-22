import React, { useState } from 'react';

function TaskForm({ onAdd }) {
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Ошибка при создании задачи');

      const newTask = await res.json();
      onAdd(newTask);
      setForm({ title: '', description: '' });
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Название"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Описание"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Добавление...' : 'Добавить'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default TaskForm;
