const inquirer = require("inquirer");
const connection = require("./config/connection");
const prompts = require("./assets/prompts");
const table = require("console.table");

async function init() {
    const userSelect = await inquirer.prompt(questions.initialPrompt);
    switch (userSelect.initial) {
        case "View Departments":
            displayDepartments();
            break;
        case "View Roles":
            displayRoles();
            break;
        case "View Employees":
            displayEmployees();
            break;
            
    }
}