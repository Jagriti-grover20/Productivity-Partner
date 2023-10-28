const timeOption = document.getElementById("time-option");

// Add an event listener to the "time-option" input to detect changes
timeOption.addEventListener("change", (event) => {
    // When the input value changes, this function is called.
    // Get the new value entered by the user.
    const val = event.target.value;
    
    // Check if the entered value is outside the range [1, 60]
    if (val < 1 || val > 60) {
        // If the value is less than 1 or greater than 60, set it back to the default of 25.
        timeOption.value = 25;
    }
});

// Get a reference to the "Save Options" button
const saveBtn = document.getElementById("save-btn");

// Add a click event listener to the "Save Options" button
saveBtn.addEventListener("click", () => {
    // When the button is clicked, this function is called.
    
    // Use the chrome.storage API to save data to the local storage of the extension.
    chrome.storage.local.set({
        // Here, we define the properties to save in the local storage.
        // timer is set to 0 to reset the timer.
        // isRunning is set to false, indicating the timer is not running.
        timer: 0,
        // timeOption is set to the current value of the "time-option" input.
        timeOption: timeOption.value,
        isRunning: false,
    });
});

// Retrieve the saved time option from local storage and set it in the input field.
chrome.storage.local.get(["timeOption"], (res) => {
    timeOption.value = res.timeOption;
});
