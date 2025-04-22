const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Получить все задачи
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Добавить задачу
router.post("/", async (req, res) => {
  const { title, description, status = "pending", user_id = null } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Введите заголовок и описание" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [title, description, status, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при добавлении задачи" });
  }
});

// Мягкое удаление (в корзину)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (task.rows.length === 0) return res.status(404).json({ message: "Задача не найдена" });

    const { title, description, status, user_id } = task.rows[0];

    await pool.query("BEGIN");
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    await pool.query(
      `INSERT INTO deleted_tasks (title, description, status, user_id, deleted_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [title, description, status, user_id]
    );
    await pool.query("COMMIT");

    res.json({ message: "Задача перемещена в корзину" });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ message: "Ошибка при удалении" });
  }
});

// Получить корзину
router.get("/trash", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM deleted_tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при загрузке корзины" });
  }
});

// Восстановить из корзины
router.post("/:id/restore", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await pool.query("SELECT * FROM deleted_tasks WHERE id = $1", [id]);
    if (task.rows.length === 0) return res.status(404).json({ message: "Задача не найдена в корзине" });

    const { title, description, status, user_id } = task.rows[0];

    await pool.query("BEGIN");
    await pool.query(
      `INSERT INTO tasks (title, description, status, user_id, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [title, description, status, user_id]
    );
    await pool.query("DELETE FROM deleted_tasks WHERE id = $1", [id]);
    await pool.query("COMMIT");

    res.json({ message: "Задача восстановлена" });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ message: "Ошибка при восстановлении" });
  }
});

// Удалить навсегда
router.delete("/:id/forever", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM deleted_tasks WHERE id = $1", [id]);
    res.json({ message: "Задача удалена навсегда" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при окончательном удалении" });
  }
});

module.exports = router;
