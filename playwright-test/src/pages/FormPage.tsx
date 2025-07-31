// src/pages/FormPage.tsx
import React, { useState } from 'react';

const FormPage: React.FC = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  const handleAddTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task.trim()]);
      setTask('');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Task Form</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{ padding: '0.5rem', width: '70%', marginRight: '1rem' }}
        />
        <button onClick={handleAddTask} style={{ padding: '0.5rem 1rem' }}>
          Add Task
        </button>
      </div>

      <h2>Tasks</h2>
      <ul>
        {tasks.map((t, idx) => (
          <li key={idx}>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export default FormPage;
