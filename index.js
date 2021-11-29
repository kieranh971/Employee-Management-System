const inquirer = require("inquirer");
const connection = require("./config/connection");
const prompts = require("./assets/prompts");
const table = require("console.table");
const db = require("./config/connection");

init();

async function init() {
    const userSelect = await inquirer.prompt(prompts.initialPrompt);
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

function displayDepartments() {
    db.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function displayRoles() {
    db.query("SELECT title FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}
function displayEmployees() {
    db.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role ON eployee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}