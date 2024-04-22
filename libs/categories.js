const { Query, Departments, Roles, Employees } = require('./queries');
const Questions = require('./questions')
const printTable = require('./formatTable');
const inq = require('inquirer');

class Categories {
    constructor(name) {
        this.name = name;
        if (name === 'Departments') {
            this.query = new Departments;
            console.log('Parent class called', name)
            console.log(this.query)
        }
        if (name === 'Roles') {
            this.query = new Roles;
            console.log('Parent class called', name)
            console.log(this.query)
        }
        if (name === 'Employees') {
            this.query = new Employees;
        }
    }
}

class View extends Categories {
    constructor(name) {
        console.log('Name in classes', name);
        console.log('Super', super(name));
    }

    async run() {
            console.log(this.query);
            const results = await this.query.viewAll();
            printTable(results);
    };
};

class Add extends Categories {
    constructor(name) {
        super(name)
    }

    async run() {
        if (this.name === 'Departments') {
            const prompt = new Questions('message', `name`, `Enter the name for the new Department.`, true).data;
            const data = await inq.prompt(prompt);
            await this.query.create(data.name);
            console.log(`Sucessfully created ${this.name}: ${data.name}.`);
        };
        if (this.name === 'Roles') {
            const prompt = [new Questions('message', 'name', 'Enter the name for the new Role.', true).data, new Questions('message', 'salary', 'Enter the salary for the new role.', false).data, new Questions('message', 'department', 'Enter the department for the role will be in.', true).data];
            console.log('Roles prompt', prompt)
            const data = await inq.prompt(prompt);
            await this.query.create(data.name, data.salary, data.department);
            console.log(`Sucessfully created ${data.name} in department ${data.department}.`);
        };
        if (this.name === 'Employees') {
            const prompt = [new Questions('message', 'name', 'Enter full name of employee', true).data, new Questions('message', 'role', 'Enter the role name the employee will have.', true).data, new Questions('message', 'manager', 'Enter the manager name the employee will have.', true).data];
            const data = await inq.prompt(prompt);
            await this.query.create(data.name, data.role, data.manager);
            console.log(`Successfully created new employee ${data.name}.`)
        }
    };
};


module.exports = { Categories, View, Add };