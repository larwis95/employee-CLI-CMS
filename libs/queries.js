const db = require('../helpers/db.js');
const titleCase = (str) => str.replace(/\b[a-z]/gi, (cahr) => cahr.toUpperCase()).replace(/Tv/gi, 'TV');

class Query {

    checkDepartment(department) {

        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM department WHERE name = "${titleCase(department)}"`, (err, results) => {
                if (err) {
                    reject(err);
                } 
                console.log(results);
                if (results[0] === undefined) {
                    resolve(null);
                } else {
                    resolve(results[0]?.id);

                };
            });
        });
    };

    checkEmployee(employee) {

        const name = titleCase(employee);
        const nameSplit = name.split(' ');
        const first_name = nameSplit[0];
        const last_name = nameSplit[1];
        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM employee WHERE first_name = "${first_name}" AND last_name = "${last_name}"`, (err, results) => {
                if (err) {
                    reject(err);
                }
                if (results.length === 0) {
                    resolve(null)
                } else {
                    resolve(results[0]?.id);
                };
            });
        });
    };

     checkRole(role) {

        const roleTitle = titleCase(role);
        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM employee_role WHERE title = "${roleTitle}"`, (err, results) => {
                if (err) {
                    reject(err);
                }
                if (results.length === 0) {
                    resolve(null);
                } else {
                    resolve(results[0]?.id);
                };
            });
        });
     };

     checkManager(manager) {

        const managerName = titleCase(manager);
        const splitName = managerName.split(' ')
        const firstName = splitName[0];
        const lastName = splitName[1];

        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM employee WHERE first_name = "${firstName}" AND last_name = "${lastName}"`, (err, results) => {
                if (results.length === 0) {
                    resolve(null);
                } else {
                    resolve(results[0].id);
                };
            });
        });
     };
};

class Departments extends Query {
    
    viewAll() {

        return new Promise((resolve, reject) => {      
            db.query('SELECT name, id FROM department', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                };
            });
        });
    };

    async create(name) {
        const departmentExist = await this.checkDepartment(name);
        if (departmentExist) {
            throw new Error('The department already exists in the DB.');
        }
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO department (name) VALUES ("${titleCase(name)}")`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                };
            });
        });
    };

};

class Roles extends Query {
    
    viewAll() {

        return new Promise((resolve, reject) => {      
            db.query('SELECT er.id, er.title, er.salary, dep.name AS department FROM employee_role er, department dep WHERE er.department_id = dep.id', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                };
            });
        }); 
    };

    async create(name, salary, department) {

        const id = await this.checkDepartment(department);
        const roleId = await this.checkRole(name);
        if (!id || roleId) {
            throw new Error(`
            Department doens't exist or role already exists.
            Department ID returned: ${id}
            Role ID returned ${roleId}
            `);
        };
        console.log('Role ID Test', id)
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES ("${titleCase(name)}", ${salary}, ${id})`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                };
            });
        });
    };
};

class Employees extends Query {
    
    async viewAll() {
        const manager = await this.getManagers();
        return new Promise((resolve, reject) => {      
            db.query('SELECT e.id, e.first_name, e.last_name, er.salary, er.title, dep.name AS dep_name, m.first_name AS manager_first, m.last_name AS manager_last FROM employee_role er, department dep, employee e, manager m WHERE e.role_id = er.id AND er.department_id = dep.id AND e.manager_id = m.id', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const resultsArray = manager.concat(results);
                    const sortedResults = resultsArray.sort((a, b) => a.id - b.id);
                    for (let i of sortedResults) {
                        if (i.manager_first && i.manager_last) {
                            i.manager = `${i.manager_first} ${i.manager_last}`;
                            delete i.manager_first;
                            delete i.manager_last;
                        }
                        else if (!i.manager_first && !i.manager_last) {
                            i.manager = 'Department Lead';
                        }
                    }
                    resolve(sortedResults);
                };
            });
        }); 
    };

    getManagers() {

        return new Promise ((resolve, reject) => {
            db.query('SELECT e.id, e.first_name, e.last_name, er.salary, er.title, dep.name AS dep_name FROM employee_role er, department dep, employee e, manager m WHERE e.role_id = er.id AND er.department_id = dep.id AND e.id = m.id', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                };
            });
        });
    };

    async create(name, role, manager) {

        const employeeExist = await this.checkEmployee(name);
        const managerExist = await this.checkManager(manager);
        const roleExist = await this.checkRole(role);
        if (employeeExist || !managerExist || !roleExist) {
            throw new Error(`
            Error creating employee. Check values for error:
            Employee ID: ${employeeExist} if not null employee already exists.
            Role ID: ${roleExist} if not a number value role doesn't exist.
            Manager ID: ${managerExist} if not a number value manager doesn't exist.`)
        }
        const splitName = titleCase(name).split(' ');
        const firstName = splitName[0];
        const lastName = splitName[1];
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${roleExist}", "${managerExist}")`, (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                };
            });
        });
    };

    async update(employee, role) {

        const employeeId = await this.checkEmployee(employee);
        const roleId = await this.checkRole(role);
        if (!employeeId || !roleId) {
            throw new Error(`
            Error updating employee. Check to see if employee name or role title exists.
            Employee returned: ${employeeId}
            Role returned: ${roleId}
            `);
        }
        return new Promise((resolve, reject) => {
            db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                };
            });
        });
    };
};


module.exports = { Query, Departments, Roles, Employees };
