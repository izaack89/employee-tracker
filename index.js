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

//------------------------- Start Secion of View -------------------------
const viewAllEmployeesDepartment = () => {
             // query the database for all items being auctioned
            connection.query('SELECT name FROM department order by id', (err, results) => {
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
                                        left join employee as m on e.manager_id=m.id where ?   order by e.id`,
                                        {
                                            name: answer.choiceDepartmen
                                        }, (err, results) => {
                        if (err) throw err;
                        console.log('\r\n');
                        console.table(results);
                        start();
                    });
                });
            });
}


const viewAllEmployeesManager = () => {
            // query the database for all items being auctioned
            connection.query(`SELECT concat(m.first_name,' ',m.last_name) as name FROM employee as e join  employee as m on e.manager_id=m.id  order by e.id`, (err, results) => {
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
                                        left join employee as m on e.manager_id=m.id where ? and ? order by e.id`,
                        [
                            {
                                'm.first_name' : first_name
                            },
                            {
                                'm.last_name' : last_name
                            }
                        ], (err, results) => {
                        if (err) throw err;
                        console.log('\r\n');
                        console.table(results);
                        start();
                    });
                });
            });
}

const viewAllEmployees = () => {
    connection.query(`select e.id as Id,e.first_name as 'First Name', e.last_name as 'Last Name',r.title as 'Title',d.name as 'Department',r.salary as "Salary",concat(m.first_name,' ',m.last_name) as 'Manager'  from employee as e join role as r on e.role_id=r.id join department as d on r.department_id=d.id left join employee as m on e.manager_id=m.id  order by e.id`, (err, results) => {
        if (err) throw err;
        console.log('\r\n');
        console.table(results);
    });
    start();
}

const viewAllRoles = () => {
    connection.query(`select r.id as 'ID',title as 'Title',salary as 'Salary' , d.name as 'Department Name'  from role as r join department as d on r.department_id=d.id order by r.id`, (err, results) => {
        if (err) throw err;
        console.log('\r\n');
        console.table(results);
    });
    start();
}

const viewAllDeparments = () => {
    connection.query(`select id as 'ID', name as 'Department Name'  from department  order by id`, (err, results) => {
        if (err) throw err;
        console.log('\r\n');
        console.table(results);
    });
    start();
}
//------------------------- End Secion of View -------------------------
//------------------------- Start Secion of Add -----------------------
const addRole = (answer,departmentName) => {
    console.log("Enter",departmentName)
    connection.query(`SELECT id FROM department where ?  order by id`, [{
        name : departmentName,
    }], (err, results) => {
        if (err) throw err;
        const idDepartment = results[0].id;
        connection.query(`INSERT INTO role SET ? `,
            [
                {
                    title: answer.title,
                    salary : answer.salary,
                    department_id : idDepartment,
                }
            ], (err, results) => {
            if (err) throw err;
            console.log('\r\n');
            start();
        });
    });
 }
const addRoleQuestions = () => {
    connection.query(`SELECT name FROM department  order by id`, (err, results) => {
                if (err) throw err;
                // once you have the items, prompt the user for which they'd like to bid on
                inquirer
                    .prompt([
                    {
                        name: 'title',
                        message: 'Insert the name of the new Role:',
                    },
                        {
                        type: 'number',
                        name: 'salary',
                        message: 'Insert the salary:',
                    },
                    {
                        name: 'departmentName',
                        type: 'rawlist',
                        choices() {
                            const choiceArray = [];
                            results.forEach(({ name }) => {
                            choiceArray.push(name);
                            });
                            return choiceArray;
                    },
                    message: 'On which Department would be this role?',
                    },
                ]).then((answer) => {
                    addRole(answer,answer.departmentName);
                });
            });
}
const addDepartment = () => {
    inquirer
        .prompt([
            {
            name: 'departmentName',
            message: 'Insert the name of the Department ?',
            },
        ]).then((answer) => {
            connection.query(`INSERT INTO department SET ? `,
                [
                    {
                        name : answer.departmentName
                    }
                ], (err, results) => {
                if (err) throw err;
                console.log('\r\n');
                start();
            });
        });
    
}
//------------------------- End Secion of Add -------------------------
//------------------------- Start Secion of Update -----------------------


const updateUser = (userName) => {
    
    inquirer
        .prompt([
            {
            name: 'firstName',
            message: 'What is the employee\'s first name?',
            },
            {
            name: 'lastName',
            message: 'What is the employee\'s last name?',
            },
        ]).then(function (answer) {
            const fullName = (userName).split(' ')
            const first_name = fullName[0];
            const last_name = fullName[1];
            connection.query(`UPDATE employee SET ? WHERE ? AND ?`,
                [
                    {
                        first_name: answer.firstName,
                        last_name : answer.lastName
                        
                    },
                    {
                        first_name: first_name
                    },
                    {
                        last_name : last_name
                    }
                ], (err, results) => {
                if (err) throw err;
                console.log('\r\n');
                start();
            });
        });    
}
const updateUserList = () => {    

    connection.query(`SELECT  concat(e.first_name,' ',e.last_name) as name  FROM employee as e  order by e.id`, (err, results) => {
        if (err) throw err;
        // once you have the users list , prompt the users that will like to edit
        inquirer
        .prompt([
            {
            name: 'userName',
            type: 'rawlist',
            choices() {
                const choiceArray = [];
                results.forEach(({ name }) => {
                choiceArray.push(name);
                });
                return choiceArray;
            },
            message: 'Which Employee would you like to edit?',
            },
        ]).then((answer) => {
            updateUser(answer.userName);           
        });

    });
}

const updateDepartment = (answerDepartment) => {
    const oldDepartmentName = answerDepartment.departmentName;
    inquirer
        .prompt([
            {
            name: 'departmentName',
            message: 'New name of the Department ?',
            },
        ]).then(function (answer) {
            console.log(answer, answerDepartment)
            connection.query(`UPDATE department SET ? WHERE ?`,
                [
                    {
                        name : answer.departmentName
                    },
                    {
                        name : oldDepartmentName
                    }
                ], (err, results) => {
                if (err) throw err;
                console.log('\r\n');
                start();
            });
        });    
}

const updateDepartmentList = () => {

    connection.query(`SELECT name FROM department  order by id`, (err, results) => {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
        .prompt([
            {
            name: 'departmentName',
            type: 'rawlist',
            choices() {
                const choiceArray = [];
                results.forEach(({ name }) => {
                choiceArray.push(name);
                });
                return choiceArray;
            },
            message: 'Which Department would you like to edit?',
            },
        ]).then((answerDepartment) => {
            updateDepartment(answerDepartment);           
        });

    });
}
//------------------------- End Secion of Update -------------------------
//------------------------- Start Secion of Delete -----------------------

const deleteUser= () => {
    // query the database for all roles     
    connection.query(`SELECT  concat(e.first_name,' ',e.last_name) as name  FROM employee as e  order by e.id`, (err, results) => {
        if (err) throw err;
        // once you have the role, prompt the user for which they'd like to remove
        inquirer
        .prompt([
            {
            name: 'choiceEmployee',
            type: 'rawlist',
            choices() {
                const choiceArray = [];
                results.forEach(({ name }) => {
                choiceArray.push(name);
                });
                return choiceArray;
            },
            message: 'Which employee would you like to remove?',
            },
        ]).then((answer) => {

            const fullName = (answer.choiceEmployee).split(' ')
            const first_name = fullName[0];
            const last_name = fullName[1];
            connection.query(`DELETE FROM employee WHERE ?  AND ? `,
                [
                    {
                        first_name : first_name
                    },
                    {
                        last_name : last_name
                    }
                ], (err, results) => {
                if (err) throw err;
                console.log('\r\n');
                start();
            });
        });
    });
}
const deleteRole= () => {
    // query the database for all roles     
    connection.query(`SELECT title FROM role  order by id`, (err, results) => {
        if (err) throw err;
        // once you have the role, prompt the user for which they'd like to delete on
        inquirer
        .prompt([
            {
            name: 'roleName',
            type: 'rawlist',
            choices() {
                const choiceArray = [];
                results.forEach(({ title }) => {
                choiceArray.push(title);
                });
                return choiceArray;
            },
            message: 'Which Role would you like to remove?',
            },
        ]).then((answer) => {
            connection.query(`DELETE FROM role WHERE ?  `,
                [
                    {
                        title : answer.roleName
                    }
                ], (err, results) => {
                if (err) throw err;
                console.log('\r\n');
                start();
            });
        });
    });
}
const deleteDepartment = () => {
    // query the database for all deparments 
    connection.query(`SELECT name FROM department  order by id`, (err, results) => {
        if (err) throw err;
        // once you have the deparments, prompt the user for which they'd like to delete on
        inquirer
        .prompt([
            {
            name: 'departmentName',
            type: 'rawlist',
            choices() {
                const choiceArray = [];
                results.forEach(({ name }) => {
                choiceArray.push(name);
                });
                return choiceArray;
            },
            message: 'Which Department would you like to remove?',
            },
        ]).then((answer) => {
            connection.query(`DELETE FROM department WHERE ? `,
                [
                    {
                        name : answer.departmentName
                    }
                ], (err, results) => {
                if (err) throw err;
                console.log('\r\n');
                start();
            });
        });
    });
}
//------------------------- End Secion of Delete -------------------------
const start = () => {

    console.log('\r\n');
    inquirer
        .prompt({
            name: 'actionInput',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees','View All Employees By Department','View All Employees By Manager','Add Employee','Remove Employee','Update Employee','Update Employee Role','Update Employee Manager','View All Roles','Add Role','Remove Role', 'View All Deparments','Add Department','Update Department','Remove Deparment','Quit'],
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
                    deleteUser();
                    break;
                case 'Update Employee':
                    updateUserList();
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
                    addRoleQuestions();
                    break;
                case 'Remove Role':
                    deleteRole();
                    break;
                case 'View All Deparments':
                    viewAllDeparments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Update Department':
                    updateDepartmentList();
                    break;
                case 'Remove Deparment':
                    deleteDepartment();
                    break;
                case 'Quit':
                    connection.end();
                    break;
            }
        });
};

start();