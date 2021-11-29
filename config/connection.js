const mysql = require("mysql");

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Snoops97!",
    database: "employee_management_db"
});

db.connect((err) => {
    if (err) throw err;
})

module.exports = db;