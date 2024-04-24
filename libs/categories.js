const printTable = require('./formatTable');
const inq = require('inquirer');

class Categories {
    constructor(query) {
        this.query = query;
    };
};

class View extends Categories {
    constructor(query) {
        super(query);
    };

    async run() {

            const results = await this.query.viewAll();
            printTable(results);
    };
};

class Add extends Categories {
    constructor(query) {
        super(query);
    };

    async run() {

        const prompt = await inq.prompt(this.query.prompt);
        const data = Object.values(prompt)
        await this.query.create(...data);
        console.log(`Sucessfully created ${this.query.constructor.name}: ${prompt.name}.`);
    
    };
};

class Update extends Categories {
    constructor(query) {
        super(query);
    }

    async run() {
        const data = await inq.prompt(this.query.prompt);
        await this.query.update(data.name, data.role);
        console.log(`Successfully updated ${data.name} to role ${data.role}.`);
    };
};


module.exports = {  View, Add, Update };