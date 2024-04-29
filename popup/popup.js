let tasks = [];

const addTaskBtn = document.getElementById("add-task-timer");
addTaskBtn.addEventListener("click", () => addTask());
// set timer
function updateTime() {
  chrome.storage.local.get(["timer", "timeOption"], (res) => {
    const timerText = document.getElementById("timer");
    const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(
      2,
      "0"
    );
    let seconds = "00";
    if (res.timer % 60 != 0) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
    }
    timerText.textContent = `${minutes}:${seconds}`;
  });
}
updateTime();
setInterval(updateTime, 1000);

//set start or stop
const startBtn = document.getElementById("start-timer");
startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startBtn.textContent = res.isRunning ? "start timer" : "stop timer";
      }
    );
  });
});
// set reset btn timer
const resetBtn = document.getElementById("reset-timer");
resetBtn.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startBtn.textContent = "Start timer";
    }
  );
  chrome.action.setBadgeText({
    text: `0`,
  });
});
// set render tasks or remove tasks
chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
}

function renderTask(taskNum) {
  const taskRow = document.createElement("div");
  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a Task ...";
  text.className = "btn-task";
  text.value = tasks[taskNum];
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });
  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.className = "btn-X";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });
  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);
  const taskContainer = document.getElementById("timer-container");
  taskContainer.appendChild(taskRow);
}
function addTask() {
  const taskNum = tasks.length;
  tasks.push("");
  renderTask(taskNum);
  saveTasks();
}
function deleteTask(taskNum) {
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
}
function renderTasks() {
  const taskContainer = document.getElementById("timer-container");
  taskContainer.textContent = "";
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
}
