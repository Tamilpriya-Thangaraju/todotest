// Create a controlled form to add a task:
//inout + button
// validate non-empty
// call onAddTask(title) from props and clear input

import React, { useState } from 'react';

const AddTaskForm = ({ addTask }) => {
	const [title, setTitle] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title.trim()) {
			setError('Task cannot be empty');
			return;
		}
		addTask(title);
		setTitle('');
		setError('');
	};

	return (
		<form onSubmit={handleSubmit} className="add-task-form">
			<input
				type="text"
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder="Add a new task"
			/>
			<button type="submit">Add</button>
			{error && <div className="error">{error}</div>}
		</form>
	);
};

export default AddTaskForm;