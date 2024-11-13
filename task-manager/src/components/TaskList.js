import React from 'react';

const TaskList = ({ tasks, updateTask, deleteTask }) => {
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Due: {task.dueDate}</p>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.completed ? "Completed" : "Pending"}</p>
          <button onClick={() => updateTask({ ...task, completed: !task.completed })}>
            {task.completed ? "Mark as Pending" : "Mark as Completed"}
          </button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
