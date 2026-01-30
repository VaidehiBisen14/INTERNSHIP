const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const clearCompletedBtn = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* ---------- Storage ---------- */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ---------- Add Task ---------- */
addBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  if (!title) {
    alert("Task title is required");
    return;
  }

  tasks.push({
    id: Date.now(),
    title,
    completed: false,
    due: dueDate.value,
    priority: priority.value,
  });

  taskInput.value = "";
  dueDate.value = "";
  renderTasks();
  saveTasks();
});

/* ---------- Task Actions ---------- */
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

/* ---------- Filters ---------- */
document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

/* ---------- Render ---------- */
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  }
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span onclick="toggleTask(${task.id})">
        <strong>${task.title}</strong><br>
        <small>Due: ${task.due || "N/A"} | Priority: ${task.priority}</small>
      </span>
      <button class="danger" onclick="deleteTask(${task.id})">Delete</button>
    `;

    taskList.appendChild(li);
  });
}

/* ---------- Initial Render ---------- */
renderTasks();
