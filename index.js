const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// start DB connection
db.connect(err => {
    if (err) throw err;
    // console.log('Database connected.')
});

// add new department prompt
function addDepartmentPrompt() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What is the name of the department?',
        }
    ])
}

// add new role prompt
function addRolePrompt() {
    console.log("test test test")
}

// function to initialize app
function mainPrompt() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit'
            ]
        }
    ])
        .then((answers) => {
            // console.log(answers)
            // console.log(answers.menu)
            switch (answers.menu) {
                case 'View all departments':
                    displayDepartments()
                    break;
                case 'View all roles':
                    displayRoles()
                    break;
                case 'View all employees':
                    displayEmployees()
                    break;
                case 'Add a department':
                    addDepartment()
                    break;
                case 'Add a role':
                    addRole()
                    break;
                case 'Add an employee':
                    // displayEmployees()
                    break;
                case 'Update an employee role':
                    // displayEmployees()
                    break;
                case 'Quit':
                    process.exit()
            }
        })
}

function displayDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        mainPrompt();
    })
}

function displayRoles() {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary
                FROM role
                LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        mainPrompt();
    })
}

function displayEmployees() {
    const sql = `SELECT employee.*, role.title, department.name AS department, role.salary
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        mainPrompt();
    })
}

function addDepartment() {
    addDepartmentPrompt()
        .then(answer => {
            // console.log(answer.addDepartment)

            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = answer.addDepartment;

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log('Added ' + params + ' to the database.')
                mainPrompt();
            })
        })
}

function addRole() {
    addDepartmentPrompt()
        .then(addRolePrompt)
}

// function call to initalize app
mainPrompt()
