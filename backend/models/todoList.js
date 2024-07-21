const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Yet to Start', 'Completed', 'In Progress'], // Enum for predefined status
        required: true,
    },
    deadline: {
        type: Date,
    },
});

const todoList = mongoose.model("todo", todoSchema);

module.exports = todoList;
