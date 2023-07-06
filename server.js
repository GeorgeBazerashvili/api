const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
const Task = require("./Task");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ success: false, message: error.message });
  }
});

app.post("/api/tasks/create", async (req, res) => {
  try {
    const { task } = req.body;

    if (!task || task.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Input field can't be empty" });
    }
    const newTask = await Task.create({
      task,
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put("/api/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { task, completed } = req.body;
    const singleTask = await Task.findById(taskId);
    singleTask.task = task || singleTask.task;
    singleTask.completed = completed || false;
    const saved = await singleTask.save();
    res.status(200).json(saved);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete("/api/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.deleteOne({ _id: taskId });
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected...");
    app.listen(process.env.PORT, () => {
      console.log(`connected to port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
