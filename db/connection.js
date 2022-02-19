const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root', // MySQL username
        password: 'Snow7flake!',
        database: 'employee_tracker'
    },
    console.log('-----Connected to employee_tracker database-----')
);

module.exports = db;