const mysql = require("mysql");
const prompts = require("./assets/prompts");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Snoops97!",
    database: "employee_management_db"
});

connection.connect(function(err){
    if(err) throw err;
    console.log(`connected as id ` + connection.threadId + "\n");
    prompts.initQ();
});

exports.connection = connection