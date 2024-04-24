const printTable = require('./formatTable');
const Questions = require('./questions');
const inq = require('inquirer');

class Categories {
    constructor(query) {
        this.query = query;
    };

    getQuestions() {
        if (this.constructor.name === 'Update') {
            return [new Questions('message', 'name', 'Enter the name of the employee you would like to update', true).data, new Questions('message', 'role', 'Enter the new role for the employee', true).data];
        };
        if (this.constructor.name === 'Add' && this.query.constructor.name === 'Departments') {
            return new Questions('message', `name`, `Enter the name for the new Department.`, true).data;
        };
        if (this.constructor.name === 'Add' && this.query.constructor.name === 'Roles') {
            return [new Questions('message', 'name', 'Enter the name for the new Role.', true).data, new Questions('number', 'salary', 'Enter the salary for the new role.', false).data, new Questions('message', 'department', 'Enter the department for the role will be in.', true).data];
        };
        if (this.constructor.name === 'Add' && this.query.constructor.name === 'Employees') {
            return [new Questions('message', 'name', 'Enter the name of the employee you would like to add', true).data, new Questions('message', 'role', 'Enter the role for the employee', true).data, new Questions('message', 'manager', 'Enter the manager the employee will have', true)];
        };
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

        const prompt = await inq.prompt(this.getQuestions());
        const data = Object.values(prompt)
        await this.query.create(...data);
        console.log(`Sucessfully created ${this.query.constructor.name.slice(0, -1)}: ${prompt.name}.`);
    
    };
};

class Update extends Categories {
    constructor(query) {
        super(query);
    }

    async run() {
        const data = await inq.prompt(this.getQuestions());
        await this.query.update(data.name, data.role);
        console.log(`Successfully updated ${data.name} to role ${data.role}.`);
    };
};


module.exports = {  View, Add, Update };