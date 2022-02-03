const mysql = require("mysql");
const inquirer = require("inquirer");
const db = require("../app");

// Initial Prompts for user to select
function initQ() {
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to view, modify, or add information?",
            name: "initQChoice",
            choices: ["view", "modify", "add"]
        }
    ]).then(function(initAnswers){
        if(initAnswers.initQChoice === "view") {
            viewChoices(initAnswers)
        } else if(initAnswers.initQChoice === "modify") {
            modifyChoices(initAnswers)
        } else (
            addChoices(initAnswers)
        )
    });
}
// If user selects view, user selects from following prompts
function viewChoices() {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose what you would like to view.",
            name: "viewResponse",
            choices: ["Departments", "Roles", "Employees"]
        }
    ]).then(function(viewAnswers) {
        if(viewAnswers.viewResponse === "Departments") {
            viewDept()
        } else if (viewAnswers.viewResponse === "Roles") {
            viewRole()
        } else {
            viewEmployee()
        }
    });
}
// If user selects modify, user selects from following prompts
function modifyChoices() {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose what you would like to change.",
            name: "modifyResponse",
            choices: ["Change an employee's role", "Change an employee's manager"]
        }
    ]).then(function(modifyAnswers) {
        if(modifyAnswers.modifyResponse === "Change an employee's role") {
            modifyEmpRole()
        } else {
            modifyEmpMgr()
        }
    });
}
// If user selects add, user selects from following prompts
function addChoices() {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose what you would like to add.",
            name: "addNewResponse",
            choices: ["New Department", "New Role", "New Employee"]
        }
    ]).then(function(addChoicesAnswers){
        if(addChoicesAnswers.addNewResponse === "New Department") {
            newDept()
        } else if (addChoicesAnswers.addNewResponse === "New Role") {
            newRole()
        } else {
            newEmployee()
        }
    });
}
// Add new department
function newDept(){
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the new department name.",
            name: "addNewDept"
        }
    ]).then(function(newDeptResponse){
        db.connection.query(
            "INSERT INTO department SET ?",
            {
                dept_name: newDeptResponse.addNewDept,
            },
            function (err, res) {
                if (err) throw err;
                console.log("New department added successfully!");
                continueChoice()
            }
        )
    })
}

// Add new role
function newRole() {
    db.connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the name of the new role.",
                name: "newRoleTitle"
            },
            {
                type: "input",
                message: "Enter the salary for this position.",
                name: "newRoleSalary"
            },
            {
                type: "list",
                message: "Which department does this role belong to?",
                name: "newRoleDept",
                choices: function(){
                    const deptArray = []
                    for(let i = 0; i<res.length; i++){
                        deptArray.push(`${res[i].id} | ${res[i].dept_name}`);
                    } return deptArray
                }
            }
        ]).then(function(newRoleResponse){
            if(newRoleResponse.newRoleSalary != parseInt(newRoleResponse.newRoleSalary)) {
                console.log("Salary must be numbers only, no special characters or letters. Please try again.")
            } else {
                db.connection.query("INSERT INTO roles SET ?",
                {
                    title: newRoleResponse.newRoleTitle,
                    salary: newRoleResponse.newRoleSalary,
                    department_id: parseInt(newRoleResponse.newRoleDept.slice(0,3))
                },
                function(err, res) {
                    if(err) throw err;
                    console.log("New role successfully added!")
                    continueChoice()
                })
            }
        })
    })
}

// Add new employee
function newEmployee() {
    db.connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the employee's first name.",
                name: "newEmplFName"
            },
            {
                type: "input",
                message: "Enter the employee's last name.",
                name: "newEmplLName"
            },
            {
                type: "list",
                message: "Which team will they be apart of?",
                name: "newEmplRole",
                choices: function(){
                    const rolesArray = []
                    for(let i = 0; i<res.length; i++){
                        rolesArray.push(`${res[i].id} | ${res[i].title}`);
                    } return rolesArray
                }
            },
            {
                type: "confirm",
                message: "Will this person be a manager?",
                name: "newEmplIsMgr"
            },
            {
                type: "confirm",
                message: "Will this person report to a manager?",
                name: "newEmplHasMgr"
            },
        ]).then(function(newEmployeeResponse){
            let query = db.connection.query("INSERT INTO employee SET ?",
                {
                    first_name: newEmployeeResponse.newEmplFName,
                    last_name: newEmployeeResponse.newEmplLName,
                    role_id: parseInt(newEmployeeResponse.newEmplRole.slice(0,5)),
                    is_manager: newEmployeeResponse.newEmplIsMgr,
                },
                function(err, res) {
                    if(err) throw err;
                    console.log(res.affectedRows + "employee inserted!\n")
                    if(newEmployeeResponse.newEmplHasMgr === true){
                        console.log("Almost done, just need more information about their manager");
                        retrieveMgr()
                    } else {
                        console.log("New employee successfully added!")
                        continueChoice()
                    }
                })
        })
    })
};

// Retrieve manager
function retrieveMgr(){
    db.connection.query("SELECT * FROM employee WHERE is_manager=1", function(err,res){
        if(err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Who is the manager?",
                name: "newEmplMgr",
                choices: function(){
                    const MgrArray = []
                    for(let i = 0; i < res.length - 1; i++){
                        MgrArray.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    } return MgrArray
                }
            }
        ]).then(function(mgrRes){
            const MgridArr = []
            db.connection.query("SELECT id FROM employee", function (err,ans){
                for(let i=0; i< ans.length; i++) {
                    MgridArr.push(ans[i].id)
                }
                const newestid = MgridArr[MgridArr.length - 1];
                const mgr = parseInt(mgrRes.newEmplMgr.slice(0,5));
                if(newestid === mgr){
                    console.log("Error: manager and employee cannot have the same ID. Please try again.");
                    retrieveMgr()
                } else {
                    newMgr(newestid, mgr);
                }
            })
        })
    })
}

// Add manager
function newMgr(manager, employee){
    db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [employee, manager], function(err, res){
        if (err) {
            console.log(err)
        } else {
            console.log("Employee and manager added!")
            continueChoice();
        }
    })
}

// View department
function viewDept(){
    db.connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        const deptArr = []
        for(let i = 0; i < res.length; i++) {
            deptArr.push(res[i])
        }
        console.table(deptArr);
        continueChoice();
    });
}

// View role
function viewRole(){
    db.connection.query("SELECT * FROM roles", function(err, res) {
        if (err) throw err;
        const roleArr = []
        for(let i = 0; i < res.length; i++) {
            roleArr.push(res[i])
        }
        console.table(roleArr);
        continueChoice();
    });
}

// View employee
function viewEmployee(){
    db.connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        const employeeArr = []
        for(let i = 0; i < res.length; i++) {
            employeeArr.push(res[i])
        }
        console.table(employeeArr);
        continueChoice();
    });
}

// Change employee role - first select employee who's role you want to change
function modifyEmpRole(){
    db.connection.query("SELECT id, first_name, last_name FROM employee", function(err, res){
        if(err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Select the employee who's role you would like to change.",
                name: "EmpRoleChange",
                choices: function(){
                    const EmpChoiceArr = []
                    for(let i=0; i < res.length; i++){
                        EmpChoiceArr.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    } return EmpChoiceArr
                }
            }
        ]).then(function(emp){
            const changeEmp = parseInt(emp.EmpRoleChange.slice(0,5));
            modifyEmpRoleSel(changeEmp)
        })
    })
}
// Then select the new role for the employee
function modifyEmpRoleSel(emp) {
    const employee = emp
    db.connection.query("SELECT id, title FROM roles", function(err, res){
        inquirer.prompt([
            {
                type: "list",
                message: "Select this employee's new role.",
                name: "modifyRoleChange",
                choices: function(){
                    const RoleChoiceArr = []
                    for(let i=0; i < res.length; i++){
                        RoleChoiceArr.push(`${res[i].id} | ${res[i].title}`)
                    } return RoleChoiceArr
                }
            }
        ]).then(function(role){
            const changeRole = parseInt(role.modifyRoleChange.slice(0,5));
            const changeEmp = role.employee
            let query = db.connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [changeRole, employee], function(err, res) {
                if (err) {

                } else {
                    console.log("This employee's role has been changed!")
                    continueChoice();
                }
            })
        })
    })
}

// Change employee manager - first select the employee who's manager you want to change
function modifyEmpMgr(){
    db.connection.query("SELECT id, first_name, last_name FROM employee", function(err, res){
        if(err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Select the employee who's manager you would like to change.",
                name: "EmpMgrChange",
                choices: function(){
                    const EmpChoiceArr = []
                    for(let i=0; i < res.length; i++){
                        EmpChoiceArr.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    } return EmpChoiceArr
                }
            }
        ]).then(function(emp){
            const changeEmp = parseInt(emp.EmpMgrChange.slice(0,5));
            modifyEmpMgrSel(changeEmp)
        })
    })
}
// Then select new manager for employee
function modifyEmpMgrSel(emp){
    const employee = emp
    db.connection.query("SELECT id, first_name, last_name FROM employee WHERE is_manager = 1", function(err, res){
        inquirer.prompt([
            {
                type: "list",
                message: "Select this employee's new manager.",
                name: "modifyMgrChange",
                choices: function(){
                    const MgrChoiceArr = []
                    for(let i=0; i < res.length; i++){
                        MgrChoiceArr.push(`${res[i].id} | ${res[i].first_name} | ${res[i].last_name}`)
                    } return MgrChoiceArr
                }
            }
        ]).then(function(people){
            const mgr = parseInt(people.modifyMgrChange.slice(0,5));
            const changeEmp = employee
                if (mgr === changeEmp) {
                    console.log("Manager and employee cannot have the same ID. Please try again.")
                    modifyEmpMgr()
                } else {
                    db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [mgr, changeEmp], function(err, res){
                        if (err){

                        } else {
                            console.log("This employee's manager has been changed!")
                            continueChoice();        
                        }
                    })
                }
            })
        })
}

// Option to continue modifying
function continueChoice(){
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to view, modify, or add anything else?",
            name: "loopResponse",
            choices: ["Yes", "No"]
        }
    ]).then(function(finalAnswer){
        if(finalAnswer.loopResponse === "Yes"){
            initQ()
        } else {
            db.connection.end()
        }
    })
}

// Exporting function to be used in app.js
exports.initQ = initQ