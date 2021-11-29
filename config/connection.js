const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3003,
    user: "root",
    password: "Snoops97!",
    database: "employee_management_db"
});

connection.connect((err) => {
    if (err) throw err;
})

module.exports = connection;