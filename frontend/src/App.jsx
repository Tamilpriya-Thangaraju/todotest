import { useState, useEffect, useCallback } from 'react';
import Header from './components/header';
import StatsCards from './components/StatsCards';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';

const API_URL = '/api/tasks';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  const fetchTasks = useCallback(async () => {
    try {
      const endpoint = filter === 'all' ? '/tasks' : `/tasks?status=${filter}`;
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [filter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/stats/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // useEffect with proper dependencies
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const addTask = useCallback(async (title) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      fetchStats();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [tasks, fetchStats]);

  const toggleTask = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      fetchStats();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }, [tasks, fetchStats]);

  const deleteTask = useCallback(async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [tasks, fetchStats]);

  return (
    <div className="app-container">
      <Header />
      <StatsCards stats={stats} />
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
      </div>
      <AddTaskForm addTask={addTask} />
      <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
};

export default App;