const db = require('../helpers/db.js');
const titleCase = (str) => str.replace(/\b[a-z]/gi, (cahr) => cahr.toUpperCase()).replace(/Tv/gi, 'TV');

//classes that hold our queries, seperated by query type, check methods check if the data exists in the DB. used these to promisfy the MySQL2 library.
class Query {

    checkDepartment(department) {

        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM department WHERE name = ?`, titleCase(department), (err, results) => {
                if (err) {
                    reject(err);
                } 
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
        const firstName = nameSplit[0];
        const lastName = nameSplit[1];
        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [firstName, lastName], (err, results) => {
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
            db.query(`SELECT id FROM employee_role WHERE title = ?`, roleTitle, (err, results) => {
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
        const splitName = managerName.split(' ');
        const firstName = splitName[0];
        const lastName = splitName[1];

        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [firstName, lastName], (err, results) => {
                if (results.length === 0) {
                    resolve(null);
                } else {
                    resolve(results[0].id);
                };
            });
        });
     };

     async getEmployeeNameId() {
        const arr = await this.queryEmployeeNameAndId();
        for (let i = 0; i < arr.length; i++) {
            arr[i] = {
                name: `${arr[i].first_name} ${arr[i].last_name}`,
                value: arr[i].id
            };
        }
        return arr;
    }

    queryEmployeeNameAndId() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT first_name, last_name, id FROM employee`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    async getRoleNameId() {
        const arr = await this.queryRoleNameAndId();
        for (let i = 0; i < arr.length; i++) {
            arr[i] = {
                name: `${arr[i].title}`,
                value: arr[i].id
            };
        }
        return arr;
    }

    queryRoleNameAndId() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT title, id FROM employee_role`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    async getDepartmentNameId() {
        const arr = await this.queryDepartmentNameId();
        for (let i = 0; i < arr.length; i++) {
            arr[i] = {
                name: `${arr[i].name}`,
                value: arr[i].id
            };
        }
        return arr;
    }

    queryDepartmentNameId() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT name, id FROM department`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    async getManagerNameId() {
        const arr = await this.queryManagerNameId();
        for (let i = 0; i < arr.length; i++) {
            arr[i] = {
                name: `${arr[i].first_name} ${arr[i].last_name}`,
                value: arr[i].id
            };
        }
        return arr;
    }

    queryManagerNameId() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };
}


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
            db.query(`INSERT INTO department (name) VALUES (?)`, titleCase(name), (err, results) => {
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
        
        const roleId = await this.checkRole(name);
        if (!department || roleId) {
            throw new Error(`
            Department doens't exist or role already exists.
            Department ID returned: ${department}
            Role ID returned ${roleId}
            `);
        };
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES (?, ?, ?)`, [titleCase(name), salary, department], (err, results) => {
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

        const managers = await this.getManagerNameId();
        const managerMap = new Map();
        managers.forEach((i) => managerMap.set(i.value, i.name));

        return new Promise((resolve, reject) => {      
            db.query('select e.id, e.first_name, e.last_name, e.manager_id, employee_role.title AS title, employee_role.salary, department.name AS department FROM employee e RIGHT JOIN employee_role ON e.role_id = employee_role.id RIGHT JOIN department ON employee_role.department_id = department.id', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const sortedResults = results.sort((a, b) => a.id - b.id);
                    for (let i of sortedResults) {

                        if (i.manager_id) {
                            i.manager = managerMap.get(i.manager_id);
                            delete i.manager_id;
                        }
                        else {
                            i.manager = 'Department Lead';
                            delete i.manager_id;
                        };
                    };
                    resolve(sortedResults);
                };
            });
        }); 
    };

    async create(name, role, manager) {

        const employeeExist = await this.checkEmployee(name);
        if (employeeExist || !manager || !role) {
            throw new Error(`
            Error creating employee. Check values for error:
            Employee ID: ${employeeExist} if not null employee already exists.
            Role ID: ${role} if not a number value role doesn't exist.
            Manager ID: ${manager} if not a number value manager doesn't exist.`)
        }
        const splitName = titleCase(name).split(' ');
        const firstName = splitName[0];
        const lastName = splitName[1];
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [firstName, lastName, role, manager], (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                };
            });
        });
    };

    async update(employeeId, roleId) {

        if (!employeeId || !roleId) {
            throw new Error(`
            Error updating employee. Check to see if employee name or role title exists.
            Employee returned: ${employeeId}
            Role returned: ${roleId}
            `);
        }
        return new Promise((resolve, reject) => {
            db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleId, employeeId], (err, results) => {
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
