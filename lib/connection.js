const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        // Your port; if not 3306
        port: 3306,
        // Your username
        user: process.env.DB_USER,
        // Your password
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
module.exports = connection;