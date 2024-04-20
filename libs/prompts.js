const inq = require('inquirer');

const Prompt = require('./questions');

const printTable = require('./formatTable');

const { Query, Departments, Roles, Employees} = require('../libs/queries');

const questions = new Prompt;
const department = new Departments;
const role = new Roles;
const employee = new Employees;

const arrayToObject = (arr) => {
    const object = arr.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {});
    return object;
}
const returnToMain = (input) => {
    if (!input) {
        console.log('Exiting program.');
        return process.exit();
    }
    return mainMenu();
}

const mainMenu = async () => {
    const choice = await inq.prompt(questions.mainmenu);
    console.log(choice);
    menuChoice(choice.mainMenu);
};

const menuChoice = (choice) => {
    switch (choice) {
        case 'View Departments':
            viewDepartment();
            break;
        
        case 'View Roles':
            viewRoles();
            break;

        case 'View Employees':
            viewEmployees();
            break;

        case 'Add Department':
            createDepartment();
            break;

        case 'Add Employee Role':
            createRole();
            break;
        
        case 'Add Employee':
            createEmployee();
            break;

        case ('Update Employee Role'):
            updateEmployee();
            break;
        
        default:
            break;
    };
    return;
};

const viewDepartment = async () => {
    try {
        const departmentsArr = await department.viewAll();
        printTable(departmentsArr);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart)
    } 
    catch (e) {
        console.log('Error viewing departments: ', e.message);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart);
    };
};

const viewEmployees = async () => {
    try {
        const employeeArr = await employee.viewEmployees();
        for (let i of employeeArr) {
            if (i.manager_first && i.manager_last) {
                i.manager = `${i.manager_first} ${i.manager_last}`;
                delete i.manager_first;
                delete i.manager_last;
            }
            else if (!i.manager_first && !i.manager_last) {
                i.manager = 'Department Lead';
            }
        }
        printTable(employeeArr);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart)
    } 
    catch (e) {
        console.log('Error viewing employees: ', e.message);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart);
    };
}

const viewRoles = async () => {
    try {
        const rolesArr = await role.viewAll();
        printTable(rolesArr);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart)
    } 
    catch (e) {
        console.log('Error viewing roles: ', e.message);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart);
    };
};

const createDepartment = async () => {
    try {
        const data = await inq.prompt(questions.departmentName);
        await department.create(data.departmentName);
        console.log('Sucessfully created Department: ', data.departmentName);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart);
    }
    catch (e) {
        console.log('Error creating department: ', e.message);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart);
    };
};

const createRole = async () => {
    try {
        const roleQuestions = [questions.roleName, questions.roleSalary, questions.roleDepartment];
        const data = await inq.prompt(roleQuestions);
        await role.create(data.roleName, data.roleSalary, data.roleDepartment);
        console.log('Successfully created role: ', data.roleName);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart);
    }
    catch (e) {
        console.log('Error creating role: ', e.message);
        const input = await inq.prompt(questions.return);
        returnToMain(input.restart);
    };
};


module.exports = mainMenu;