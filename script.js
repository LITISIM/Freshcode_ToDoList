const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

const API_URL = 'http://localhost:3000/tasks';
let tasks = [];

// 1. Завантаження даних з сервера
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error("Сервер не відповідає:", error);
    }
}

// 2. Збереження на сервер
async function saveTasks() {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tasks)
        });
    } catch (error) {
        console.error("Помилка при збереженні на сервер:", error);
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask(${index})">
                    ${task.completed ? 'Відмінити' : 'Виконав'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${index})">Видалити</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

async function addTask() {
    const text = taskInput.value.trim();
    if (text !== '') {
        tasks.push({ text: text, completed: false });
        taskInput.value = '';
        await saveTasks(); // Чекаємо збереження на сервері
        renderTasks();
    }
}

window.toggleTask = async function(index) {
    tasks[index].completed = !tasks[index].completed;
    await saveTasks();
    renderTasks();
};

window.deleteTask = async function(index) {
    tasks.splice(index, 1);
    await saveTasks();
    renderTasks();
};

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

// Завантажуємо дані при старті
loadTasks();