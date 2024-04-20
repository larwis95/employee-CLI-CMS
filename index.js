const keyExit = require('./helpers/exit');
const startPrompts = require('./libs/prompts');

const { Query, Departments, Roles, Employees} = require('./libs/queries');

const main = async () => {
    startPrompts();
};

keyExit();
main();