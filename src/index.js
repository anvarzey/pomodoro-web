import "../styles.css";

const pomodoroSubtitle = document.getElementById("pomodoro-subtitle");
const pomodoroContainer = document.getElementById("pomodoro__icons-container");
const shortSubtitle = document.getElementById("short-subtitle");
const shortContainer = document.getElementById("short__icons-container");
const longSubtitle = document.getElementById("long-subtitle");
const longContainer = document.getElementById("long__icons-container");
const border = document.querySelector(".clock");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");
const restartButton = document.getElementById("restart-btn");
let task = document.getElementById("task");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("tasklist");
let interval;

task.addEventListener("keydown", (event) => {
  if (event.code === "Enter") return addTask();
});
startButton.addEventListener("click", runTimer);
stopButton.addEventListener("click", stopTimer);
restartButton.addEventListener("click", restartTimer);
addButton.addEventListener("click", addTask);

const periods = {
  pomodoro: {
    starter: "25",
    count: 0,
    next: function () {
      if (this.count % 4 === 0) {
        return "longBreak";
      }
      return "shortBreak";
    },
    increaseCounter,
  },
  shortBreak: {
    starter: "05",
    count: 0,
    next: returnPomodoro,
    increaseCounter,
  },
  longBreak: {
    starter: "15",
    count: 0,
    next: returnPomodoro,
    increaseCounter,
  },
  actual: "pomodoro",
};

setActual("pomodoro");

function runTimer() {
  if (startButton.innerHTML === "START" || startButton.innerHTML === "RESUME") {
    startButton.innerHTML = "PAUSE";
    interval = setInterval(() => {
      if (seconds.innerHTML === "00" && minutes.innerHTML === "00") {
        periods[periods.actual].increaseCounter();
        periodCompleted(periods.actual);
        if (periods["pomodoro"].count === 12) {
          finishAllPeriods();
        } else {
          periods.actual = periods[periods.actual].next();
          changeBorderColor(periods.actual);
          minutes.innerHTML = periods[periods.actual].starter;
        }
      } else {
        if (seconds.innerHTML === "00") {
          seconds.innerHTML = "59";
          minutes.innerHTML = Number(minutes.innerHTML) - 1;
          if (minutes.innerHTML < 10)
            minutes.innerHTML = "0" + minutes.innerHTML;
        } else {
          seconds.innerHTML = Number(seconds.innerHTML) - 1;
          if (seconds.innerHTML < 10)
            seconds.innerHTML = "0" + seconds.innerHTML;
        }
      }
    }, 1000);
  } else {
    startButton.innerHTML = "RESUME";
    clearInterval(interval);
  }
}

function increaseCounter() {
  this.count += 1;
}

function returnPomodoro() {
  return "pomodoro";
}

function periodCompleted(task) {
  const imagen = document.createElement("img");

  if (task === "pomodoro") {
    imagen.src = "./assets/images/tomato.svg";
    imagen.classList = "pomodoro-icon";
    pomodoroContainer.appendChild(imagen);
  } else if (task === "shortBreak") {
    imagen.src = "./assets/images/coffee.png";
    imagen.classList = "coffee-icon";
    shortContainer.appendChild(imagen);
  } else {
    imagen.src = "./assets/images/battery.png";
    imagen.classList = "battery-icon";
    longContainer.appendChild(imagen);
  }
}

function stopTimer() {
  clearInterval(interval);
  setActual("pomodoro");
  startButton.innerHTML = "START";
  border.style.setProperty("--border-color", "var(--pomodoro-color)");

}

function addTask() {
  task = document.getElementById("task");
  const regex = /\w+/g;
  if (regex.test(task.value)) {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const dlt_item = document.createElement("label");
    const task_name = document.createElement("div");
    const check_label = document.createElement("label");
    check_label.classList = "check_label";
    checkbox.type = "checkbox";
    checkbox.classList = "list__item-checkbox";
    dlt_item.innerText = "X";
    dlt_item.classList = "list__item-delete";
    dlt_item.addEventListener("click", deleteTask);
    li.classList = "list__item";
    task_name.classList = "task-name";
    task_name.textContent = task.value;
    li.appendChild(check_label);
    li.appendChild(checkbox);
    li.appendChild(dlt_item);
    li.appendChild(task_name);
    taskList.appendChild(li);
    task.value = "";
  }
}

function deleteTask(e) {
  e.path[1].remove();
}

function changeBorderColor(actual) {
  const pomodoroModifier = "block-left__pomodoro-subtitle--actual";
  const shortModifier = "block-left__short-subtitle--actual";
  const longModifier = "block-left__long-subtitle--actual";

  const state_options = {
    "pomodoro": [0, "var(--pomodoro-color)"],
    "shortBreak": [1, "var(--short-color)"],
    "longBreak": [2, "var(--long-color)"],
    "finish": [-1, "var(--restart-color)"],
  };

  const actual_state = state_options[actual];

  const class_modifiers = [
    [pomodoroSubtitle, pomodoroModifier],
    [shortSubtitle, shortModifier],
    [longSubtitle, longModifier],
  ];

  for (let i = 0; i < class_modifiers.length; i++) {
    if (actual_state[0] === i) {
      class_modifiers[i][0].classList.add(class_modifiers[i][1]);
    } else {
      class_modifiers[i][0].classList.remove(class_modifiers[i][1]);
    }
  }
  border.style.setProperty("--border-color", actual_state[1]);
}

function finishAllPeriods() {
  clearInterval(interval);
  startButton.style.setProperty("display", "none");
  stopButton.style.setProperty("display", "none");
  restartButton.style.setProperty("display", "inline-block");
  changeBorderColor("finish");
  minutes.innerHTML = "--";
  seconds.innerHTML = "--";
}

function restartTimer() {
  startButton.innerHTML = "START";
  periods["pomodoro"].count = 0;
  periods["shortBreak"].count = 0;
  periods["longBreak"].count = 0;
  removeAllChildNodes(pomodoroContainer);
  removeAllChildNodes(shortContainer);
  removeAllChildNodes(longContainer);
  removeAllChildNodes(taskList);
  setActual("pomodoro");
  changeBorderColor("pomodoro");
  startButton.style.setProperty("display", "block");
  stopButton.style.setProperty("display", "block");
  restartButton.style.setProperty("display", "none");
}

function setActual(actual) {
  minutes.innerHTML = periods[actual].starter;
  seconds.innerHTML = "00";
  periods.actual = actual;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
