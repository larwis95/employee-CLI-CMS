const inq = require('inquirer');
const lookupTable = require('./lookup');

//prompt for returning to main menu
const returnPrompt = {
    type: 'confirm',
    name: 'restart',
    message: 'Would you like to return to the main menu?',
    default: true
};

//prompt for the main menu
const menu = {
    type: 'list',
    message: 'Main Menu',
    name: 'mainMenu',
    choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Employee Role', 'Add Employee', 'Update Employee Role']
};

//function that sees if input is true or false, if true returns to main menu, if false exits the program
const returnToMain = (input) => {
    if (!input) {
        console.log('Exiting program.');
        return process.exit();
    }
    return mainMenu();
}

//defines our lookupTable, then sees if the user option is in the table, then calls the options action, after does a prompt to ask the user to return to the main menu.
const mainMenu = async () => {
    const map = lookupTable();
    const choice = await inq.prompt(menu);
    const action = map.get(choice.mainMenu);
    try {
        await action.run();

    }
    catch (e) {
        console.log(e);
        console.log('Error', e.message);
    };
    const input = await inq.prompt(returnPrompt);
    returnToMain(input.restart);
};

module.exports = mainMenu;