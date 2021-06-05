const connection = require('../../lib/connection');
const inquirer = require('inquirer');

const updateUserRole = (userFirstName,userLastName,newroleName) => {

    const a1 =connection.query(
        {
            sql: `SELECT  id as role_id  FROM role  where  title=? order by id`,
            values: [newroleName]
        }
    , (err, results) => {
        if (err) throw err;
        const a = connection.query(
            {
                sql: `UPDATE employee SET role_id=? where  first_name=? and last_name=? `,
                values: [results[0].role_id,userFirstName,userLastName]
            }
        , (err, results) => {
            if (err) throw err;

            });
        console.log("Query:",a.sql)
        });
    
        console.log("Query:",a1.sql)
}

module.exports = { updateUserRole }