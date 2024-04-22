const keyExit = require('./helpers/exit');
const startPrompts = require('./libs/prompts');

const main = async () => {
    startPrompts();
};

keyExit();
main();