const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Получение всех задач
router.get("/", async (req, res) => {
  try {
    const tasks = await pool.query("SELECT * FROM tasks");
    res.json(tasks.rows);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении задач" });
  }
});

// Добавление новой задачи
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при добавлении задачи" });
  }
});

// Обновление задачи
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *",
      [title, description, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении задачи" });
  }
});

// Удаление задачи
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Задача удалена" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении задачи" });
  }
});

module.exports = router;
