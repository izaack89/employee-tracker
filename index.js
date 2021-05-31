// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
const connection = require('./lib/connection');
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const cTable = require('console.table');
const config = require('./package.json');
console.log(logo({
        name: 'Employee Manager',
        lineChars: 10,
        padding: 2,
        margin: 3,
        borderColor: 'blue',
        logoColor: 'bold-green',
}).render());

const viewAllEmployeesDepartment = () => {
             // query the database for all items being auctioned
            connection.query('SELECT name FROM department', (err, results) => {
                if (err) throw err;
                // once you have the items, prompt the user for which they'd like to bid on
                inquirer
                .prompt([
                    {
                    name: 'choiceDepartmen',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        results.forEach(({ name }) => {
                        choiceArray.push(name);
                        });
                        return choiceArray;
                    },
                    message: 'Which department would you like to see employees for?',
                    },
                ])
                .then((answer) => {
                    connection.query(`select e.id as Id,e.first_name as 'First Name', 
                                        e.last_name as 'Last Name',r.title as 'Title',
                                        d.name as 'Department',r.salary as "Salary",
                                        concat(m.first_name,' ',m.last_name) as 'Manager'
                                        from employee as e join role as r on e.role_id=r.id
                                        join department as d on r.department_id=d.id
                                        left join employee as m on e.manager_id=m.id where ? `,
                                        {
                                            name: answer.choiceDepartmen
                                        }, (err, results) => {
                        if (err) throw err;
                        console.log('\r\b');
                        console.table(results);
                        start();
                    });
                });
            });
}


const viewAllEmployeesManager = () => {
             // query the database for all items being auctioned
            connection.query(`SELECT concat(m.first_name,' ',m.last_name) as name FROM employee as e join  employee as m on e.manager_id=m.id `, (err, results) => {
                if (err) throw err;
                // once you have the items, prompt the user for which they'd like to bid on
                inquirer
                .prompt([
                    {
                    name: 'choiceManager',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        results.forEach(({ name }) => {
                        choiceArray.push(name);
                        });
                        return choiceArray;
                    },
                    message: 'Which Manager would you like to see employees for?',
                    },
                ]).then((answer) => {
                    const fullName = (answer.choiceManager).split(' ')
                    const first_name = fullName[0];
                    const last_name = fullName[1];
                    connection.query(`select e.id as Id,e.first_name as 'First Name', 
                                        e.last_name as 'Last Name',r.title as 'Title',
                                        d.name as 'Department',r.salary as "Salary",
                                        concat(m.first_name,' ',m.last_name) as 'Manager'
                                        from employee as e join role as r on e.role_id=r.id
                                        join department as d on r.department_id=d.id
                                        left join employee as m on e.manager_id=m.id where ? and ? `,
                        [
                            {
                                'm.first_name' : first_name
                            },
                            {
                                'm.last_name' : last_name
                            }
                        ], (err, results) => {
                        if (err) throw err;
                        console.log('\r\b');
                        console.table(results);
                        start();
                    });
                });
            });
}

const viewAllEmployees = () => {
    connection.query(`select e.id as Id,e.first_name as 'First Name', e.last_name as 'Last Name',r.title as 'Title',d.name as 'Department',r.salary as "Salary",concat(m.first_name,' ',m.last_name) as 'Manager'  from employee as e join role as r on e.role_id=r.id join department as d on r.department_id=d.id left join employee as m on e.manager_id=m.id`, (err, results) => {
        if (err) throw err;
        console.log('\r\b');
        console.table(results);
    });
    start();
}

const viewAllRoles = () => {
    connection.query(`select r.id as 'ID',title as 'Title',salary as 'Salary' , d.name as 'Department Name'  from role as r join department as d on r.department_id=d.id`, (err, results) => {
        if (err) throw err;
        console.log('\r\b');
        console.table(results);
    });
    start();
}

const viewAllDeparments = () => {
    connection.query(`select id as 'ID', name as 'Department Name'  from department `, (err, results) => {
        if (err) throw err;
        console.log('\r\b');
        console.table(results);
    });
    start();
}

const start = () => {
    inquirer
        .prompt({
            name: 'actionInput',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees','View All Employees By Department','View All Employees By Manager','Add Employee','Remove Employee','Update Employee','Update Employee Role','Update Employee Manager','View All Roles','Add Role','Remove Role', 'View All Deparments','Add Department','Remove Deparment','Quit'],
        })
        .then((answer) => {
            // based on their answer, either call the bid or the post functions
            switch (answer.actionInput) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Employees By Department':
                    viewAllEmployeesDepartment();
                    break;
                case 'View All Employees By Manager':
                    viewAllEmployeesManager();
                    break;
                case 'Add Employee':
                    connection.end();
                    break;
                case 'Remove Employee':
                    connection.end();
                    break;
                case 'Update Employee':
                    connection.end();
                    break;
                case 'Update Employee Role':
                    connection.end();
                    break;
                case 'Update Employee Manager':
                    connection.end();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    connection.end();
                    break;
                case 'Remove Role':
                    connection.end();
                    break;
                case 'View All Deparments':
                    viewAllDeparments();
                    break;
                case 'Add Department':
                    connection.end();
                    break;
                case 'Remove Deparment':
                    connection.end();
                    break;
                case 'Quit':
                    connection.end();
                    break;
            }
        });
};

start();