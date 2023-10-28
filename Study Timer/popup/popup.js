// Create an array to store tasks.
let tasks = [];

// This function updates the displayed time on the popup.
function updateTime() {
    // Use chrome.storage.local to retrieve timer, timeOption, and isRunning data.
    chrome.storage.local.get(["timer", "timeOption", "isRunning"], (res) => {
        // Get a reference to the HTML element with the id "time" to display the timer.
        const time = document.getElementById("time");

        // Calculate minutes remaining in the timer by subtracting elapsed minutes from the total timeOption.
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");

        // Calculate seconds remaining in the timer.
        let seconds = "00";
        if (res.timer % 60 != 0) {
            seconds = `${60 - res.timer % 60}`.padStart(2, "0");
        }

        // Update the displayed time in the format MM:SS.
        time.textContent = `${minutes}:${seconds}`;

        // Determine the label on the "Start Timer" button based on whether the timer is running or not.
        const startTimerBtn = document.getElementById("start-timer-btn");
        startTimerBtn.textContent = res.isRunning ? "Pause Timer" : "Start Timer";
    });
}

// Call updateTime immediately and update the time every second.
updateTime();
setInterval(updateTime, 1000);

// Get a reference to the "Start Timer" button and add a click event listener.
const startTimerBtn = document.getElementById("start-timer-btn");
startTimerBtn.addEventListener("click", () => {
    // When the button is clicked, toggle the timer's running state in local storage.
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            // Update the button label based on the new state.
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer";
        });
    });
});

// Get a reference to the "Reset Timer" button and add a click event listener.
const resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
    // When the button is clicked, reset the timer to 0 and set isRunning to false.
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        // Update the button label to "Start Timer" since the timer is reset.
        startTimerBtn.textContent = "Start Timer";
    });
});

// Get a reference to the "Add Task" button and add a click event listener.
const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => addTask());

// Use chrome.storage.sync to retrieve the tasks from storage, if they exist.
chrome.storage.sync.get(["tasks"], (res) => {
    // If tasks exist in storage, assign them to the tasks array; otherwise, keep an empty array.
    tasks = res.tasks ? res.tasks : [];

    // Render the tasks in the popup.
    renderTasks();
});

// This function saves the tasks to storage.
function saveTasks() {
    chrome.storage.sync.set({
        tasks,
    });
}

// This function renders a task in the popup.
function renderTask(taskNum) {
    // Create a new div element to hold the task input and delete button.
    const taskRow = document.createElement("div");

    // Create an input element for the task text.
    const text = document.createElement("input");
    text.type = "text";
    text.placeholder = "Enter a Task";
    text.value = tasks[taskNum]; // Set the value of the input to the task text.
    text.className = "task-input";
    text.addEventListener("change", () => {
        // When the input changes, update the corresponding task in the tasks array.
        tasks[taskNum] = text.value;
        saveTasks(); // Save the updated tasks to storage.
    });

    // Create a delete button for the task.
    const deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "X";
    deleteBtn.className = "task-delete";
    deleteBtn.addEventListener("click", () => {
        // When the delete button is clicked, remove the task.
        deleteTask(taskNum);
    });

    // Append the task input and delete button to the task row.
    taskRow.appendChild(text);
    taskRow.appendChild(deleteBtn);

    // Get a reference to the task container div and append the task row to it.
    const taskContainer = document.getElementById("task-container");
    taskContainer.appendChild(taskRow);
}

// This function adds a new task.
function addTask() {
    const taskNum = tasks.length;
    tasks.push(""); // Add an empty task to the tasks array.
    renderTask(taskNum); // Render the new task in the popup.
    saveTasks(); // Save the updated tasks to storage.
}

// This function deletes a task.
function deleteTask(taskNum) {
    tasks.splice(taskNum, 1); // Remove the task at the specified index.
    renderTasks(); // Re-render the tasks to reflect the change.
    saveTasks(); // Save the updated tasks to storage.
}

// This function renders all tasks in the popup.
function renderTasks() {
    const taskContainer = document.getElementById("task-container");
    taskContainer.textContent = ""; // Clear the existing task container.

    // Iterate through the tasks array and render each task.
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum);
    });
}
