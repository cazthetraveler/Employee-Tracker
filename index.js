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
                });
                break;
            case "View All Roles":
                db.query(`SELECT r.title, r.id, d.name AS department, r.salary
                FROM department AS d
                JOIN role AS r ON r.department_id = d.id`, function(err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(results);
                        console.log(`Viewing all roles!`);
                        init();
                    };
                });
                break;
            case "View All Employees":
                db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employee AS e
                JOIN role AS r ON e.role_id = r.id
                JOIN department AS d ON r.department_id = d.id
                LEFT JOIN employee AS m ON e.manager_id = m.id;`, function(err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(results);
                        console.log(`Viewing all employees!`);
                        init();
                    };
                });
                break;
            case "Add a Department":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Please enter department name.",
                        name: "deptname"
                    }
                ]).then((data) => {
                    const deptname = JSON.stringify(data.deptname);  //stringify because it doesnt insert
                    db.query(`INSERT INTO department (name)
                    VALUES(${deptname});`, function(err, results) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`New department added successfully!!`);
                        };
                    init();
                    });
                });
                break;
            case "Add a Role":
                db.query(`SELECT name FROM department`, function(err, results) {
                    const deptNames = results.map(result => result.name);
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "Please enter a role name.",
                            name: "rolename"
                        },
                        {
                            type: "input",
                            message: "Please enter a salary.",
                            name: "rolesalary"
                        },
                        {
                            type: "list",
                            message: "Please select an existing department.",
                            choices: deptNames,
                            name: "roledept"
                        }
                    ]).then((data) => {
                        const title = JSON.stringify(data.rolename);
                        const salary = JSON.stringify(data.rolesalary);
                        const deptId = JSON.stringify(data.roledept);
                        const deptIdInsert = `(SELECT id FROM department WHERE name = ${deptId})`;
                        db.query(`INSERT INTO role (title, salary, department_id)
                        VALUES(${title}, ${salary}, ${deptIdInsert});`);
                        console.log(`New role added successfully!!`);
                        init();
                    });
                });
                break;
            case "Add an Employee":
                db.query(`SELECT title FROM role`, function(err, results) {
                    const titles = results.map(result => result.title);
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "Please enter their first name.",
                            name: "firstname"
                        },
                        {
                            type: "input",
                            message: "Please enter their last name.",
                            name: "lastname"
                        },
                        {
                            type: "list",
                            message: "Please select an existing role.",
                            choices: titles,
                            name: "emprole"
                        }
                    ]).then((data) => {
                        const firstName = data.firstname;
                        const lastName = data.lastname;
                        const role = data.emprole;
                        db.query(`SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager FROM employee AS e
                        WHERE e.manager_id IS NULL;`, function(err, results) {
                            if (err) {
                                console.error(err);
                            };
                            const managers = results.map(result => result.manager);
                            managers.unshift("NONE");
                            inquirer.prompt([
                                {
                                    type: "list",
                                    message: "Please select a manager.",
                                    choices: managers,
                                    name: "empmanager"
                                }
                            ]).then((data) => {
                                const manager = data.empmanager;
                                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES ("${firstName}", "${lastName}", (SELECT id FROM role WHERE title = "${role}"), (SELECT m.id FROM employee AS m WHERE CONCAT(m.first_name, ' ', m.last_name) = "${manager}"));`);
                                console.log(`Finally added a new employee!!`);
                                init();
                            });
                        });
                    });
                });
                break;
            case "QUIT":
                console.log(`Hasta la pizza!`);
                db.end();
                break;
        };
    });
};

init();