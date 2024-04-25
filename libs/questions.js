class Questions {
    constructor(type, name, message, validate, choices = []) {
        
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
            };
            } else {
            this.data = {
                type: type,
                name: name,
                message: message
            };
        };

        if (choices.length > 0) {
            this.data = {
                type: type,
                name: name,
                message: message,
                choices: choices,
            };
        };
    };
};



module.exports = Questions;

