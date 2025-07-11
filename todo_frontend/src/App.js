import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App - Main application component for the To-Do List Manager.
 * Features:
 * - Add, edit, delete, complete, and view to-do items
 * - Data is persisted in localStorage
 * - Minimalistic, light-themed, centered UI with theming colors
 */
function App() {
  // Todo item structure: { id, text, completed }
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const inputRef = useRef(null);

  // Load todos from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  // Persist todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Public: Add todo
  // PUBLIC_INTERFACE
  const addTodo = (e) => {
    e.preventDefault();
    const toAdd = editId !== null ? editInput.trim() : input.trim();
    if (!toAdd) return;

    if (editId !== null) {
      setTodos((prev) =>
        prev.map((td) =>
          td.id === editId ? { ...td, text: editInput.trim() } : td
        )
      );
      setEditId(null);
      setEditInput('');
    } else {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input.trim(),
          completed: false
        }
      ]);
      setInput('');
    }
    inputRef.current && inputRef.current.focus();
  };

  // Public: Delete todo
  // PUBLIC_INTERFACE
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((td) => td.id !== id));
  };

  // Public: Mark as complete/incomplete
  // PUBLIC_INTERFACE
  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((td) =>
        td.id === id ? { ...td, completed: !td.completed } : td
      )
    );
  };

  // Public: Start editing
  // PUBLIC_INTERFACE
  const startEdit = (id, text) => {
    setEditId(id);
    setEditInput(text);
    inputRef.current && inputRef.current.focus();
  };

  // Public: Cancel editing
  // PUBLIC_INTERFACE
  const cancelEdit = () => {
    setEditId(null);
    setEditInput('');
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    if (editId !== null) setEditInput(e.target.value);
    else setInput(e.target.value);
  };

  // Handle Enter for edit in list
  const onEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      addTodo({ preventDefault: () => {} });
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Render one todo item
  function TodoItem({ todo }) {
    return (
      <li className="todo-item" key={todo.id}>
        <button
          className={`check-btn${todo.completed ? ' checked' : ''}`}
          onClick={() => toggleComplete(todo.id)}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? (
            <span className="checkbox">&#10003;</span>
          ) : (
            <span className="checkbox"></span>
          )}
        </button>
        {editId === todo.id ? (
          <input
            type="text"
            value={editInput}
            ref={inputRef}
            className="edit-input"
            onChange={handleInputChange}
            onKeyDown={e => onEditKeyDown(e, todo.id)}
            onBlur={cancelEdit}
            autoFocus
            aria-label="Edit to-do"
          />
        ) : (
          <span
            className={`todo-text${todo.completed ? ' completed' : ''}`}
            tabIndex={0}
            aria-label={
              todo.completed
                ? `Completed to-do: ${todo.text}`
                : `To-do: ${todo.text}`
            }
            onDoubleClick={() => startEdit(todo.id, todo.text)}
          >
            {todo.text}
          </span>
        )}
        {editId === todo.id ? (
          <>
            <button
              className="action-btn save"
              onMouseDown={addTodo}
              aria-label="Save edit"
              tabIndex={-1}
            >
              Save
            </button>
            <button
              className="action-btn cancel"
              onMouseDown={cancelEdit}
              aria-label="Cancel edit"
              tabIndex={-1}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="action-btn edit"
              onClick={() => startEdit(todo.id, todo.text)}
              aria-label="Edit to-do"
            >
              Edit
            </button>
            <button
              className="action-btn delete"
              onClick={() => deleteTodo(todo.id)}
              aria-label="Delete to-do"
            >
              Delete
            </button>
          </>
        )}
      </li>
    );
  }

  // Render all todo items
  function TodoList() {
    if (!todos.length)
      return <div className="no-todos">No to-dos yet!</div>;
    return (
      <ul className="todo-list" aria-label="To-Do List">
        {todos.map((todo) => (
          <TodoItem todo={todo} key={todo.id} />
        ))}
      </ul>
    );
  }

  // Main UI
  return (
    <div className="main-bg">
      <div className="todo-container">
        <h1 className="todo-header">
          <span className="todo-accent">To-Do</span> List Manager
        </h1>
        <form className="add-form" onSubmit={addTodo} autoComplete="off">
          <input
            type="text"
            className="add-input"
            placeholder={
              editId !== null ? 'Edit to-do...' : 'Add new to-do...'
            }
            value={editId !== null ? editInput : input}
            onChange={handleInputChange}
            ref={inputRef}
            maxLength={200}
            aria-label={editId !== null ? 'Edit to-do input' : 'Add to-do input'}
          />
          <button
            className="add-btn"
            type="submit"
            style={{ backgroundColor: 'var(--primary)' }}
            aria-label={editId !== null ? 'Save edit' : 'Add to-do'}
          >
            {editId !== null ? 'Save' : 'Add'}
          </button>
          {editId !== null && (
            <button
              type="button"
              className="cancel-btn"
              onClick={cancelEdit}
              aria-label="Cancel edit"
            >
              Cancel
            </button>
          )}
        </form>
        <TodoList />
      </div>
      <footer className="todo-footer">
        <small>
          &copy; {new Date().getFullYear()} Minimal To-Do • Persistent in browser
        </small>
      </footer>
    </div>
  );
}

export default App;
