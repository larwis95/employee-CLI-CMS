class Questions {
    constructor(type, name, message, validate) {
        
        if (validate = true) {
            this.data = {
                type: type,
                name: name,
                message: message,
                validate: (input) => {
                    if (input.length > 30) {
                        console.log(`Input must be a max of 30 characters!`);
                        return false;
                    }
                    else if (input.length < 1) {
                        console.log('Input must be a minimum of 1 character.');
                    }
                    else {
                    return true;
                    };
                }
            } 
            } else {
            this.data = {
                type: type,
                name: name,
                message: message
            };
        };

        this.return = {
            type: 'confirm',
            name: 'restart',
            message: 'Would you like to return to the main menu?',
            default: true
        };
    };
};



module.exports = Questions;

