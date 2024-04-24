const { View, Add, Update } = require('./categories');
const { Departments, Roles, Employees } = require('./queries');
const Questions = require('./questions');

const choices = () => {
    const map = new Map()
    map.set('View Departments', new View(new Departments(null)));
    map.set('View Roles', new View(new Roles(null)));
    map.set('View Employees', new View(new Employees(null)))
    map.set('Add Department', new Add(new Departments(new Questions('message', `name`, `Enter the name for the new Department.`, true).data)))
    map.set('Add Employee Role', new Add(new Roles([new Questions('message', 'name', 'Enter the name for the new Role.', true).data, new Questions('number', 'salary', 'Enter the salary for the new role.', false).data, new Questions('message', 'department', 'Enter the department for the role will be in.', true).data])));
    map.set('Add Employee', new Add(new Employees([new Questions('message', 'name', 'Enter full name of employee', true).data, new Questions('message', 'role', 'Enter the role name the employee will have.', true).data, new Questions('message', 'manager', 'Enter the manager name the employee will have.', true).data])));
    map.set('Update Employee Role', new Update(new Employees([new Questions('message', 'name', 'Enter the name of the employee you would like to update', true).data, new Questions('message', 'role', 'Enter the new role for the employee', true).data])));
    return map;
};

module.exports = choices;