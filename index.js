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
            message: 'What is the name of the department you want to add?',
        }
    ])
}

// add new role prompt
function addRolePrompt(departmentArray) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'What is the name of the role you want to add?'
        },
        {
            type: 'input',
            name: 'addSalary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'addDepartment',
            message: 'Which department does the role belong to?',
            choices: departmentArray
        }
    ])
}

// add new employee prompt
function addEmployeePrompt(roleArray) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'last',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roleArray
        }
        // {
        //     type: 'list',
        //     name: 'manager',
        //     message: "Who is the employee's manager?",
        //     choices: [
        //         "Billie Eilish",
        //         "Jennifer Lopez",
        //         "Ariana Grande"
        //     ]
        // }
    ])
}

function updateEmployeePrompt() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: "Which employee's role do you want to update?",
            choices: "something"
        },
        {
            type: 'input',
            name: 'addDepartment',
            message: "Which role do you want to assign the selected employee?",
            choices: "something"
        }
    ])
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
                    addEmployee()
                    break;
                case 'Update an employee role':
                    // to come
                    break;
                case 'Quit':
                    process.exit() // exit out of Node
            }
        })
        .catch(err => {
            console.log(err);
        })
}

// View all departments
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

// View all roles
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

// View all employees
function displayEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN employee manager ON manager.id = employee.manager_id
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

// Add a department
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

// Add a role
function addRole() {
    // find all the departments and update 'id' to 'value' so that it can be called inside the prompt choices
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        // console.log(rows);
        const departmentArray = [];

        for (let i = 0; i < rows.length; i++) {
            let newRows = {
                value: rows[i].id,
                name: rows[i].name
            }
            departmentArray.push(newRows)
        }

        // console.log(departmentArray)

        addRolePrompt(departmentArray)
            .then(answer => {
                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                const params = [answer.addRole, answer.addSalary, answer.addDepartment];

                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Added ' + params[0] + ' to the database.')
                    mainPrompt();
                })
            })

    })
}

// Add an employee
function addEmployee() {
    // find all the roles and update 'id' to 'value' so that it can be called inside the prompt choices
    const sql = `SELECT id, title FROM role`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        // console.log(rows);
        const roleArray = [];

        for (let i = 0; i < rows.length; i++) {
            let newRows = {
                value: rows[i].id,
                name: rows[i].title
            }
            roleArray.push(newRows)
        }
        // console.log(roleArray)

        // findManager()

        addEmployeePrompt(roleArray)
            .then(answer => {
                const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
                const params = [answer.first, answer.last, answer.role];

                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Added ' + params[0] + ' ' + params[1] + ' to the database.')
                    mainPrompt();
                })
            })

    })
}

// find all the roles and update 'id' to 'value' so that it can be called inside the prompt choices
function findManager() {
    const sql = `SELECT manager_id, first_name FROM employee`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        // console.log(rows);
        const managerArray = [];

        for (let i = 0; i < rows.length; i++) {
            let newRows = {
                value: rows[i].manager_id,
                name: rows[i].first_name
            }
            managerArray.push(newRows)
        }
        // console.log(managerArray)
    })
}

function updateEmployeeRole() {
    const sql = `SELECT id, first_name, last_name FROM employee`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        // console.log(rows);
        const employeeArray = [];

        for (let i = 0; i < rows.length; i++) {
            let newRows = {
                value: rows[i].id,
                name: rows[i].first_name
            }
            employeeArray.push(newRows)
        }

        console.log(employeeArray)

    })
}

// function call to initalize app
mainPrompt()