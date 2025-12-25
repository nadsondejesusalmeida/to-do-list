document.addEventListener('DOMContentLoaded', () => {
	const taskInput = document.querySelector('#task-input');
	const addTaskButton = document.querySelector('#add-task-button');
	const taskList = document.querySelector('#task-list');
	const progress = document.querySelector('#progress');
	const progressNumbers = document.querySelector('#numbers');
	const emptyImage = document.querySelector('.empty-image');
	
	const toggleEmptyState = () => {
		emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
	}
	
	const updateProgress = (checkCompletion = true) => {
		const totalTasks = taskList.children.length;
		const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
		
		progress.style.width = totalTasks ? `${completedTasks / totalTasks * 100}%` : '0%';
		progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;
	}
	
	const saveTaskToLocalStorage = () => {
		const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
			text: li.querySelector('span').textContent,
			completed: li.querySelector('.checkbox').checked
		}));
		
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}
	
	const loadTasksFromLocalStorage = () => {
		const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
		
		savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
		toggleEmptyState();
		updateProgress();
	}
	
	const addTask = (text, completed = false, checkCompletion = true) => {
		const taskText = text || taskInput.value.trim();
		
		if (!taskText) {
			return;
		}
		
		const li = document.createElement('li');
		li.innerHTML = `
		<input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
		<span>${taskText}</span>
		<div class="task-buttons">
			<button class="edit-button">
				<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 96 960 960" width="1.5em"><path fill="currentColor" d="M199 857q-6-6-6-14t6-14l534-534q6-6 14-6t14 6q6 6 6 14t-6 14L227 857q-6 6-14 6t-14-6Z"/></svg>
			</button>
			<button class="delete-button">
				<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em"><path fill="currentColor" d="M13.05 42q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H9.5q-.65 0-1.075-.425Q8 9.65 8 9q0-.65.425-1.075Q8.85 7.5 9.5 7.5h7.9q0-.65.425-1.075Q18.25 6 18.9 6h10.2q.65 0 1.075.425.425.425.425 1.075h7.9q.65 0 1.075.425Q40 8.35 40 9q0 .65-.425 1.075-.425.425-1.075.425h-.55V39q0 1.2-.9 2.1-.9.9-2.1.9Zm5.3-8.8q0 .65.425 1.075.425.425 1.075.425.65 0 1.075-.425.425-.425.425-1.075V16.25q0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425-.425.425-.425 1.075Zm8.3 0q0 .65.425 1.075.425.425 1.075.425.65 0 1.075-.425.425-.425.425-1.075V16.25q0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425-.425.425-.425 1.075Z"/></svg>
			</button>
		</div>
		`;
		
		const checkbox = li.querySelector('.checkbox');
		const editButton = li.querySelector('.edit-button');
		const deleteButton = li.querySelector('.delete-button');
		
		checkbox.addEventListener('change', () => {
			const isChecked = checkbox.checked;
			
			li.classList.toggle('completed', isChecked);
			editButton.disabled = isChecked;
			editButton.style.opacity = isChecked ? '0.5' : '1';
			editButton.style.pointerEvents = isChecked ? 'none' : 'auto';
			updateProgress();
			saveTaskToLocalStorage();
		});
		
		if (completed) {
			li.classList.add('completed');
			editButton.disabled = true;
			editButton.style.opacity = '0.5';
			editButton.style.pointerEvents = 'none';
		}
		
		editButton.addEventListener('click', () => {
			if (!checkbox.checked) {
				taskInput.value = li.querySelector('span').textContent;
				li.remove();
				toggleEmptyState();
				updateProgress(false);
			}
		})
		
		deleteButton.addEventListener('click', () => {
			li.remove();
			toggleEmptyState();
			updateProgress();
			saveTaskToLocalStorage();
		})
		
		taskList.appendChild(li);
		taskInput.value = '';
		toggleEmptyState();
		updateProgress(checkCompletion);
		saveTaskToLocalStorage();
	}
	
	addTaskButton.addEventListener('click', (e) => {
		e.preventDefault();
		addTask();
	});
	taskInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTask();
		}
	});
	
	loadTasksFromLocalStorage();
});