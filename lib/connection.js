const mysql = require('mysql');

module.exports = (app, path) => {
    // create the connection information for the sql database
    const connection = mysql.createConnection({
        host: 'localhost',
        // Your port; if not 3306
        port: 3306,
        // Your username
        user: 'root',
        // Your password
        password: 'izaack89',
        database: 'employees',
    });

    // connect to the mysql server and sql database
    connection.connect((err) => {
        if (err) throw err;
        // run the start function after the connection is made to prompt the user
        start();
    });
};