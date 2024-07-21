import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import './Todo.css'; // Ensure you create this CSS file

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("task");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterStatus, setFilterStatus] = useState("");

    const fetchTodoList = useCallback(() => {
        axios.get('https://todo-list-d209.onrender.com/getTodoList', {
            params: {
                searchTerm,
                sortField,
                sortOrder,
                status: filterStatus
            }
        })
        .then(result => {
            setTodoList(result.data);
        })
        .catch(err => console.log(err));
    }, [searchTerm, sortField, sortOrder, filterStatus]);

    useEffect(() => {
        fetchTodoList();
    }, [fetchTodoList]);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim() || !newStatus.trim() || !newDeadline.trim()) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('https://todo-list-d209.onrender.com', { task: newTask, status: newStatus, deadline: newDeadline })
            .then(res => {
                setNewTask("");
                setNewStatus("");
                setNewDeadline("");
                fetchTodoList();
            })
            .catch(err => console.log(err));
    };

    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        if (!editedTask.trim() || !editedStatus.trim() || !editedDeadline.trim()) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('https://todo-list-d209.onrender.com' + id, editedData)
            .then(result => {
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline("");
                fetchTodoList();
            })
            .catch(err => console.log(err));
    };

    const deleteTask = (id) => {
        axios.delete('https://todo-list-d209.onrender.com' + id)
            .then(result => {
                fetchTodoList();
            })
            .catch(err => console.log(err));
    };

    const handleSearch = () => {
        fetchTodoList();
    };

    const handleSort = () => {
        fetchTodoList();
    };

    const handleFilter = () => {
        fetchTodoList();
    };

    const statusOptions = ['Yet to Start', 'Completed', 'In Progress'];

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7">
                    <h2 className="text-center">Todo List</h2>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search tasks"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearch} className="btn btn-primary btn-sm">Search</button>
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-control mb-3"
                            onChange={(e) => setSortField(e.target.value)}
                            value={sortField}
                        >
                            <option value="task">Task</option>
                            <option value="status">Status</option>
                            <option value="deadline">Deadline</option>
                        </select>
                        <select
                            className="form-control mb-3"
                            onChange={(e) => setSortOrder(e.target.value)}
                            value={sortOrder}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        <button onClick={handleSort} className="btn btn-primary btn-sm">Sort</button>
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-control mb-3"
                            onChange={(e) => setFilterStatus(e.target.value)}
                            value={filterStatus}
                        >
                            <option value="">All</option>
                            {statusOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <button onClick={handleFilter} className="btn btn-primary btn-sm">Filter</button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todoList.map(todo => (
                                    <tr key={todo._id}>
                                        <td>
                                            {editableId === todo._id ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editedTask}
                                                    onChange={(e) => setEditedTask(e.target.value)}
                                                />
                                            ) : (
                                                todo.task
                                            )}
                                        </td>
                                        <td>
                                            {editableId === todo._id ? (
                                                <select
                                                    className="form-control"
                                                    value={editedStatus}
                                                    onChange={(e) => setEditedStatus(e.target.value)}
                                                >
                                                    {statusOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                todo.status
                                            )}
                                        </td>
                                        <td>
                                            {editableId === todo._id ? (
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={editedDeadline}
                                                    onChange={(e) => setEditedDeadline(e.target.value)}
                                                />
                                            ) : (
                                                new Date(todo.deadline).toLocaleDateString()
                                            )}
                                        </td>
                                        <td>
                                            {editableId === todo._id ? (
                                                <>
                                                    <button onClick={() => saveEditedTask(todo._id)} className="btn btn-success btn-sm">Save</button>
                                                    <button onClick={() => setEditableId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => {
                                                        setEditableId(todo._id);
                                                        setEditedTask(todo.task);
                                                        setEditedStatus(todo.status);
                                                        setEditedDeadline(todo.deadline.split('T')[0]);
                                                    }} className="btn btn-warning btn-sm">Edit</button>
                                                    <button onClick={() => deleteTask(todo._id)} className="btn btn-danger btn-sm">Delete</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-md-5">
                    <h2 className="text-center">Add Todo</h2>
                    <form onSubmit={addTask}>
                        <div className="mb-3">
                            <label className="form-label">Task</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Task Name"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Deadline</label>
                            <input
                                type="date"
                                className="form-control"
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Add Task</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Todo;
