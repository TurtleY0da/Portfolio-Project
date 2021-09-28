// Main Page Script by Timothy V

// -- Initialize Variables --

// - HTML Element References -
// Button array on dropdown menu
let buttonsArrayEl = docGetClass("dropdownButton");
let projectBtnEl = docGetID("projectsBtn");

// - Global Variables -
let dropdownToggleBool = true;

projectBtnEl.addEventListener('click', function() {
    dropdownToggleBool = dropdownToggle(dropdownToggleBool, buttonsArrayEl)
});