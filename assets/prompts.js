// Presented with the following options:
// view all departments, roles, employees
// add department, role, employee
// update an employee role

module.exports = {
    initialPrompt: {
        type: "list",
        message: "Please select what you would like to do",
        name: "prompts",
        choices: [
            "View Departments",
            "View Roles",
            "View Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee's Role"
        ]
    },
    // When user wants to add new employee, prompted to add first name, last name, role, and manager.
    // New employee will then be added to the database
    newEmployee: (roles, employees) => [{
            type: "input",
            message: "Please enter employee's first name",
            name: "first_name"
        },
        {
            type: "input",
            message: "Please enter employee's last name",
            name: "last_name"
        },
        {
            type: "list",
            message: "Please enter employee's role",
            name: "role_id",
            choices: roles
        },
        {
            type: "list",
            message: "Please your employee's manager",
            name: "manager_id",
            choices: employees
        }
    ],
    // When user wants to add department, prompted to add name
    // New department is then added to the database
    addDepartment: {
        type: "input",
        message: "Please enter the name of your department",
        name: "department_name"
    },
    // When user wants to add role, prompted to add name of role, salary of role, and department for new role
    // New role is then added to the database
    addRole: [{
            type: "input",
            message: "Please enter the title of the new role",
            name: "newRole"
        },
        {
            type: "input",
            message: "Please enter the salary for this role",
            name: "salary"
        },
        {
            type: "input",
            message: "Please enter the department id for this role",
            name: "department_id_role"
        }
    ]
}