const connection = require('../../lib/connection');
const inquirer = require('inquirer');

const updateUserManager = (userFirstName,userLastName,managerName) => {
 
    const fullNameManager = (managerName).split(' ')
    const managerLastName = fullNameManager[1];
    const managerFirstName = fullNameManager[0];

    connection.query(
        {
            sql: `SELECT  id as manager_id  FROM employee as e where  first_name=? and last_name=?  order by e.id`,
            values: [managerFirstName,managerLastName]
        }
    , (err, results) => {
        if (err) throw err;
        connection.query(
            {
                sql: `UPDATE employee SET manager_id=? where  first_name=? and last_name=? `,
                values: [results[0].manager_id,userFirstName,userLastName]
            }
        , (err, results) => {
            if (err) throw err;

            });
        });
    
}

module.exports = { updateUserManager, }