const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/taskRoutes");
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
