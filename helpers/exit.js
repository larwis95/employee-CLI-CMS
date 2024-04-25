const readline = require('readline');
const mainMenu = require('../libs/prompts');

//lets the user exit on escape key press.
const keyexit = () => {
readline.emitKeypressEvents(process.stdin);
    console.log('Press escape to exit program at any time.')
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    };

    process.stdin.on('keypress', (chunk, key) => {
    if (key && key.name == 'escape')
        process.exit();
    });
};

module.exports = keyexit;