const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: "pumpkinPie!!",
        database: "employees_db"
    },
    console.log(`Connected to the employees_db database!`)
);

function init() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "QUIT"],
            name: "action"
        }
    ]).then((data) => {
        const action = data.action;
        switch(action) {
            case "View All Departments":
                db.query(`SELECT * FROM department`, function(err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(results);
                        console.log(`Viewing all departments!`);
                        init();
                    };
                })
                break;
            case "QUIT":
                console.log(`Hasta la pizza!`);
                db.end();
                break;
        };
    });
};

init();