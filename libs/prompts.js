const inq = require('inquirer');
const lookupTable = require('./lookup');

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

const returnToMain = (input) => {
    if (!input) {
        console.log('Exiting program.');
        return process.exit();
    }
    return mainMenu();
}

const mainMenu = async () => {
    const map = lookupTable();
    const choice = await inq.prompt(menu);
    const action = map.get(choice.mainMenu);
    try {
        await action.run();
        const input = await inq.prompt(returnPrompt);
        returnToMain(input.restart);
    }
    catch (e) {
        console.log(e);
        console.log('Error', e.message);
        const input = await inq.prompt(returnPrompt);
        returnToMain(input.restart);
    };
};

module.exports = mainMenu;