const readline = require('readline');

const keyexit = () => {
readline.emitKeypressEvents(process.stdin);
    console.log('Press the escape key at any point to exit the program.');
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    };

    process.stdin.on('keypress', (chunk, key) => {
    if (key && key.name == 'escape')
        process.exit();
    });
};

module.exports = keyexit;