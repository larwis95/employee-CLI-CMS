const sql = require('mysql2');

const db = sql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_cms'
    },
    console.log('Connected to employee_cms database.')
)

module.exports = db;