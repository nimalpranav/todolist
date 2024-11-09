// Get HTML elements
const addTaskButton = document.getElementById('add-task-btn');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const taskDueDateInput = document.getElementById('task-due-date');
const taskPrioritySelect = document.getElementById('task-priority');
const taskCategorySelect = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const allTasksBtn = document.getElementById('all-tasks-btn');
const workTasksBtn = document.getElementById('work-tasks-btn');
const personalTasksBtn = document.getElementById('personal-tasks-btn');
const shoppingTasksBtn = document.getElementById('shopping-tasks-btn');
const completedTasksBtn = document.getElementById('completed-tasks-btn');
const pendingTasksBtn = document.getElementById('pending-tasks-btn');

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Global filters for category and status
let categoryFilter = 'all';  // Default category filter (all categories)
let statusFilter = 'all';    // Default status filter (both completed and pending)

// Render tasks on the page based on the current filters
function renderTasks() {
    taskList.innerHTML = '';

    // Apply category filter
    let filteredTasks = tasks;
    if (categoryFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
    }

    // Apply status filter (completed or pending)
    if (statusFilter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (statusFilter === 'pending') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    // Render the filtered tasks
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item', `${task.priority.toLowerCase()}-priority`);
        
        // Add completed class if task is completed
        if (task.completed) {
            taskItem.classList.add('completed');
        }

        taskItem.innerHTML = `
            <div>
                <strong>${task.title}</strong><br>
                <small>${task.description}</small><br>
                <small>Due: ${task.dueDate}</small>
            </div>
            <div>
                <button class="edit-btn" data-id="${task.id}">Edit</button>
                <button class="delete-btn" data-id="${task.id}">&times;</button>
                <button class="complete-btn" data-id="${task.id}">Complete</button>
            </div>
        `;
        
        // Add event listener for editing a task
        taskItem.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(task.id);
        });

        // Add event listener for deleting a task
        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(task.id);
        });

        // Add event listener for marking a task as complete
        taskItem.querySelector('.complete-btn').addEventListener('click', () => {
            completeTask(task.id);
        });

        taskList.appendChild(taskItem);
    });
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add new task
addTaskButton.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    const dueDate = taskDueDateInput.value.trim();
    const priority = taskPrioritySelect.value;
    const category = taskCategorySelect.value;
    
    if (title && description && dueDate) {
        const newTask = {
            id: Date.now(),  // Unique ID for the task
            title,
            description,
            dueDate,
            priority,
            category,
            completed: false  // New task is not completed by default
        };
        tasks.push(newTask);
        saveTasks();
        taskTitleInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
        renderTasks();
    } else {
        alert('Please fill out all fields');
    }
});

// Edit task
function editTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        taskTitleInput.value = task.title;
        taskDescInput.value = task.description;
        taskDueDateInput.value = task.dueDate;
        taskPrioritySelect.value = task.priority;
        taskCategorySelect.value = task.category;
        
        // Remove the task from the list for now (it will be added back later)
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Mark task as completed
function completeTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;  // Toggle completed status
        saveTasks();
        renderTasks();
    }
}

// Event listeners for category filter buttons
allTasksBtn.addEventListener('click', () => {
    categoryFilter = 'all'; 
    renderTasks();
});
workTasksBtn.addEventListener('click', () => {
    categoryFilter = 'Work';
    renderTasks();
});
personalTasksBtn.addEventListener('click', () => {
    categoryFilter = 'Personal';
    renderTasks();
});
shoppingTasksBtn.addEventListener('click', () => {
    categoryFilter = 'Shopping';
    renderTasks();
});

// Event listeners for status filter buttons
completedTasksBtn.addEventListener('click', () => {
    statusFilter = 'completed';
    renderTasks();
});
pendingTasksBtn.addEventListener('click', () => {
    statusFilter = 'pending';
    renderTasks();
});

// Initial rendering of tasks
renderTasks();
