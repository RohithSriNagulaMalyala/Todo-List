//App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from './components/Todo';
import './App.css';

function App() {
  const headStyle = {
    textAlign: 'center',
    padding: '20px',
    color: '#fff',
    backgroundColor: '#007bff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    margin: '0',
    fontFamily: 'Roboto', // Example font family
    fontWeight: 'bold',
    fontSize: '2.5rem',
};
  return (
    <div>
      <h1 style={headStyle}>Todo List</h1>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Todo/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;