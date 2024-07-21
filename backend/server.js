const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const TodoModel = require('./models/todoList');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(error => console.error("MongoDB connection error:", error));

app.get("/getTodoList", async (req, res) => {
    try {
        const { searchTerm = '', sortField = 'task', sortOrder = 'asc', status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        if (searchTerm) {
            query.task = { $regex: searchTerm, $options: 'i' };
        }

        let sortOptions = {};
        if (sortField === 'deadline') {
            sortOptions.deadline = sortOrder === 'asc' ? 1 : -1;
        } else if (sortField === 'status') {
            sortOptions.status = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions.task = sortOrder === 'asc' ? 1 : -1;
        }

        const todoList = await TodoModel.find(query).sort(sortOptions).exec();
        res.json(todoList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/addTodoList", async (req, res) => {
    try {
        const { task, status, deadline } = req.body;

        if (!task.trim() || !status.trim() || !deadline.trim()) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const statusOptions = ['Yet to Start', 'Completed', 'In Progress'];
        if (!statusOptions.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const newTodo = new TodoModel({
            task,
            status,
            deadline,
        });

        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/updateTodoList/:id", async (req, res) => {
    try {
        const { task, status, deadline } = req.body;

        if (!task.trim() || !status.trim() || !deadline.trim()) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const statusOptions = ['Yet to Start', 'Completed', 'In Progress'];
        if (!statusOptions.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            req.params.id,
            { task, status, deadline },
            { new: true }
        );

        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/deleteTodoList/:id", async (req, res) => {
    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);
        res.json(deletedTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

