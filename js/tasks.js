/* ==================================================
   FlowBalance | tasks.js
   Handles: Tasks CRUD, Priority, Timer, Storage
   Practicals Covered: 3, 4, 5, 6, 7, 8, 9, 11
================================================== */

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("fb_tasks")) || [];

/* ==================================================
   RENDER TASKS
================================================== */
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("fade-in");

    li.innerHTML = `
      <span>
        ${task.completed ? "✅" : "⬜"} 
        ${task.name} 
        <span style="color: var(--primary)">(${task.priority})</span>
      </span>

      <div>
        <button class="secondary-btn small-btn complete-btn">${task.completed ? "Undo" : "Done"}</button>
        <button class="danger-btn small-btn delete-btn">Delete</button>
      </div>
    `;

    // Task Complete / Undo
    li.querySelector(".complete-btn").addEventListener("click", () => {
      toggleComplete(task.id);
    });

    // Delete Task
    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });
}

/* ==================================================
   ADD TASK
================================================== */
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("taskInput").value.trim();
  const priorityInput = document.getElementById("taskPriority").value;

  // String validation (Practical 6)
  const nameRegex = /^[A-Za-z0-9\s]+$/;

  try {
    if (!nameRegex.test(nameInput)) {
      throw new Error("Task name must contain letters or numbers only.");
    }

    const newTask = {
      id: Date.now(),
      name: nameInput,
      priority: priorityInput,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();

  } catch (err) {
    console.error("Task Error:", err);
    alert(err.message);
  }
});

/* ==================================================
   TOGGLE COMPLETE
================================================== */
function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

/* ==================================================
   DELETE TASK
================================================== */
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

/* ==================================================
   SAVE TO LOCAL STORAGE
================================================== */
function saveTasks() {
  localStorage.setItem("fb_tasks", JSON.stringify(tasks));
}

/* ==================================================
   TIMER SECTION (PRACTICAL 11)
================================================== */
let timeLeft = 25 * 60; // 25 minutes
let timerId = null;

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startTimer");
const pauseBtn = document.getElementById("pauseTimer");
const resetBtn = document.getElementById("resetTimer");

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateTimerUI() {
  timerDisplay.textContent = formatTime(timeLeft);
}

// START TIMER
startBtn.addEventListener("click", () => {
  if (timerId) return;

  timerId = setInterval(() => {
    timeLeft--;

    timerDisplay.classList.add("timer-glow"); // animation

    updateTimerUI();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      alert("Time's up!");
      timerDisplay.classList.remove("timer-glow");
      timeLeft = 25 * 60;
    }
  }, 1000);
});

// PAUSE TIMER
pauseBtn.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  timerDisplay.classList.remove("timer-glow");
});

// RESET TIMER
resetBtn.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  timeLeft = 25 * 60;
  timerDisplay.classList.remove("timer-glow");
  updateTimerUI();
});

// Initial UI
updateTimerUI();
renderTasks();
