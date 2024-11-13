import React, { useState, useEffect } from 'react';
import '../CSS/style.css';

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({ title, description, dueDate, priority, status: 'Pending' });
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border rounded-md px-4 py-2 w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-md px-4 py-2 w-full"
      ></textarea>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="border rounded-md px-4 py-2 w-full"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border rounded-md px-4 py-2 w-full"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Add Task
      </button>
    </form>
  );
};

const TaskList = ({ tasks, updateTask, deleteTask }) => {
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isOverdue = task.dueDate < currentDate && task.status === 'Pending';
        const status = isOverdue ? 'Overdue' : task.status;

        return (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-gray-600">Due: {task.dueDate}</p>
              <p className="text-gray-600">Priority: {task.priority}</p>
              <p className="text-gray-600">Status: {status}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() =>
                  updateTask({
                    ...task,
                    status: task.status === 'Pending' ? 'Completed' : 'Pending',
                  })
                }
                disabled={status === 'Overdue'}
                className={`px-4 py-2 rounded-md ${
                  task.status === 'Completed'
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Dashboard = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Automatically update tasks' statuses on page load
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.dueDate < currentDate && task.status === 'Pending') {
          return { ...task, status: 'Overdue' };
        }
        return task;
      })
    );
  }, []);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), completed: false }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const [filterStatus, setFilterStatus] = useState('all');
  const filteredTasks = tasks.filter((task) =>
    filterStatus === 'all'
      ? true
      : filterStatus === 'completed'
      ? task.status === 'Completed'
      : filterStatus === 'overdue'
      ? task.status === 'Overdue'
      : task.status === 'Pending'
  );

  return (
    <div className="bg-gray-100 h-screen p-6">
      <header className="bg-blue-500 text-white py-4 px-6 flex justify-between items-center rounded-t-lg">
        <h1 className="text-2xl font-bold">TaskEase</h1>
        <div className="space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'all' ? 'bg-white text-blue-500' : 'bg-blue-300 text-white'
            }`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'pending' ? 'bg-white text-blue-500' : 'bg-blue-300 text-white'
            }`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'overdue' ? 'bg-white text-blue-500' : 'bg-blue-300 text-white'
            }`}
            onClick={() => setFilterStatus('overdue')}
          >
            Overdue
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'completed' ? 'bg-white text-blue-500' : 'bg-blue-300 text-white'
            }`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
          <button
            className="bg-white text-blue-500 px-4 py-2 rounded-md"
            onClick={() => setFilterStatus('new')}
          >
            Add Task
          </button>
        </div>
      </header>

      <div className="bg-white rounded-b-lg shadow-md p-6">
        {filterStatus === 'new' ? (
          <TaskForm addTask={addTask} />
        ) : (
          <TaskList tasks={filteredTasks} updateTask={updateTask} deleteTask={deleteTask} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
