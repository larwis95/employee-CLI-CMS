const printTable = require('./formatTable');
const Questions = require('./questions');
const inq = require('inquirer');

//classes that help us what queries to run in our program.
class Categories {
    constructor(query) {
        this.query = query;
    };

    //selects what questions to return for our actions to pass into inquirer
    async getQuestions() {
        if (this.constructor.name === 'Update') {
            return [new Questions('list', 'name', 'Enter the name of the employee you would like to add', false, await this.query.getEmployeeNameId()).data, new Questions('list', 'role', 'Enter the new role for the employee', false, await this.query.getRoleNameId()).data];
        };
        if (this.constructor.name === 'Add' && this.query.constructor.name === 'Departments') {
            return new Questions('message', `name`, `Enter the name for the new Department.`, true).data;
        };
        if (this.constructor.name === 'Add' && this.query.constructor.name === 'Roles') {
            return [new Questions('message', 'name', 'Enter the name for the new Role.', true).data, new Questions('number', 'salary', 'Enter the salary for the new role.', false).data, new Questions('list', 'department', 'Enter the department for the role will be in.', false, await this.query.getDepartmentNameId()).data];
        };
        if (this.constructor.name === 'Add' && this.query.constructor.name === 'Employees') {
            return [new Questions('message', 'name', 'Enter the name of the employee you would like to add', true).data, new Questions('list', 'role', 'Enter the role for the employee', true, await this.query.getRoleNameId()).data, new Questions('list', 'manager', 'Enter the manager the employee will have', false, await this.query.getManagerNameId()).data];
        };
    };
};

class View extends Categories {
    constructor(query) {
        super(query);
    };
    //starts our prompt to view our category, then prints the results in a nice table to console.
    async run() {
        const results = await this.query.viewAll();
        printTable(results);
    };
};

class Add extends Categories {
    constructor(query) {
        super(query);
    };
    //starts our prompt to create something in our category, then logs it when its successfully done.
    async run() {

        const prompt = await inq.prompt(await this.getQuestions());
        const data = Object.values(prompt)
        await this.query.create(...data);
        console.log(`Sucessfully created ${this.query.constructor.name.slice(0, -1)}: ${prompt.name}.`);
    
    };
};

class Update extends Categories {
    constructor(query) {
        super(query);
    }
    //starts our to update something in our category, then logs it when its sucessfull.
    async run() {
        const data = await inq.prompt(await this.getQuestions());
        await this.query.update(data.name, data.role);
        console.log(`Successfully updated employee role!.`);
    };
};


module.exports = {  View, Add, Update };