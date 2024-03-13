const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

let users = [
  {
    id: 10,
    username: "abdurehman",
    password: "password123",
  },
];

let Tasks = [
  {
    id: 1,
    title: "Office",
    description: "This is a sample description",
    category: "High",
    status: false,
    created_by: 10,
  },
  {
    id: 2,
    title: "Home",
    description: "This is a sample description",
    category: "Medium",
    status: true,
    created_by: 10,
  },
];

app.get("/tasks", (req, res) => {
  res.json(Tasks);
});

app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = Tasks.find((task) => task.id === taskId);

  if (!task) {
    res.status(404).json({ error: "Task not found" });
  } else {
    res.json(task);
  }
});

app.post("/tasks", (req, res) => {
  const { title, description, category, status, created_by } = req.body;
  const userID = req.user.id;
  if (!title || !category || !created_by) {
    res
      .status(400)
      .json({ error: "Title, category, and creator ID are required" });
  } else {
    const newTask = {
      id: Tasks.length + 1,
      title,
      description: description || "",
      category,
      status: status || false,
      created_by: userID,
    };
    Tasks.push(newTask);
    res.status(201).json(newTask);
  }
});

app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, category, status } = req.body;

  const taskIndex = Tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    res.status(404).json({ error: "Task not found" });
  } else {
    Tasks[taskIndex] = {
      ...Tasks[taskIndex],
      title: title || Tasks[taskIndex].title,
      description: description || Tasks[taskIndex].description,
      category: category || Tasks[taskIndex].category,
      status: status !== undefined ? status : Tasks[taskIndex].status,
    };

    res.json(Tasks[taskIndex]);
  }
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = Tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    res.status(404).json({ error: "Task not found" });
  } else {
    Tasks.splice(taskIndex, 1);
    res.sendStatus(204);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
