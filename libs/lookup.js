const { View, Add, Update } = require('./categories');
const { Departments, Roles, Employees } = require('./queries');

const choices = () => {
    const map = new Map()
    map.set('View Departments', new View(new Departments));
    map.set('View Roles', new View(new Roles));
    map.set('View Employees', new View(new Employees));
    map.set('Add Department', new Add(new Departments))
    map.set('Add Employee Role', new Add(new Roles));
    map.set('Add Employee', new Add(new Employees));
    map.set('Update Employee Role', new Update(new Employees));
    return map;
};

module.exports = choices;