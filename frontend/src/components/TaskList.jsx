import React from 'react';

const TaskList = ({ tasks, toggleTask, deleteTask }) => {
	if (!tasks.length) return <div>No tasks yet.</div>;

	return (
		<ul className="task-list">
			{tasks.map(task => (
				<li key={task.id} className={task.completed ? 'completed' : ''}>
					<input
						type="checkbox"
						checked={task.completed}
						onChange={() => toggleTask(task.id)}
					/>
					<span>{task.title}</span>
					<span className="date">
						{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}
					</span>
					<button onClick={() => deleteTask(task.id)}>Delete</button>
				</li>
			))}
		</ul>
	);
};

export default TaskList;