const inquirer = require('inquirer');
const keyexit = require('./helpers/exit');
const { Query, Departments, Roles, Employees} = require('./helpers/queries');

const main = async () => {
    const emp = new Employees;
    const dep = new Departments;
    try {
    await dep.create('Test Department');
    console.log(await dep.viewAll());
    }
    catch(e) {
        console.log("\x1b[31m", e.message ,'\x1b[0m');
        console.log('\x1b[33m%s\x1b[0m', 'Returning to Main Menu.')
    }
};

keyexit();
main();