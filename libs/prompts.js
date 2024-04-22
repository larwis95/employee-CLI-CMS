const inq = require('inquirer');
const { Categories, View, Add, Update } = require('./categories');

const returnPrompt = {
    type: 'confirm',
    name: 'restart',
    message: 'Would you like to return to the main menu?',
    default: true
};


const menu = {
    type: 'list',
    message: 'Main Menu',
    name: 'mainMenu',
    choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Employee Role', 'Add Employee', 'Update Employee Role']
};

const choices = () => {
    const map = new Map()
    map.set('View Departments', new View('Departments'));
    map.set('View Roles', new View('Roles'));
    map.set('View Employees', new View('Employees'));
    map.set('Add Department', new Add('Departments'));
    map.set('Add Employee Role', new Add('Roles'));
    map.set('Add Employee', new Add('Employees'));
    map.set('Update Employee Role', new Update('Employees'));
    return map;
};

const returnToMain = (input) => {
    if (!input) {
        console.log('Exiting program.');
        return process.exit();
    }
    return mainMenu();
}

const mainMenu = async () => {
    const lookupTable = choices();
    const choice = await inq.prompt(menu);
    const action = lookupTable.get(choice.mainMenu);
    try {
        await action.run();
        const input = await inq.prompt(returnPrompt);
        returnToMain(input.restart);
    }
    catch (e) {
        console.log('Error', e.message);
        const input = await inq.prompt(returnPrompt);
        returnToMain(input.restart);
    };
};

module.exports = mainMenu;