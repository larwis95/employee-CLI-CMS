const db = require('./db.js');
const titleCase = (str) => str.replace(/\b[a-z]/gi, (cahr) => cahr.toUpperCase()).replace(/Tv/gi, 'TV')

class Query {

    checkDepartment(department) {

        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM department WHERE name = "${titleCase(department)}"`, (err, results) => {
                if (err) {
                    reject(err);
                } 
                console.log(results);
                if (results.length < 0) {
                    resolve(null)
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
        if (!id) {
            throw new Error("Department doesn't exist in the DB.");
        }
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES ("${titleCase(name)}", ${salary}, ${id[0]?.id})`, (err, results) => {
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
    
    async viewEmployees() {
        const manager = await this.getManagers();
        return new Promise((resolve, reject) => {      
            db.query('SELECT e.id, e.first_name, e.last_name, er.salary, er.title, dep.name AS dep_name, m.first_name AS manager_first, m.last_name AS manager_last FROM employee_role er, department dep, employee e, manager m WHERE e.role_id = er.id AND er.department_id = dep.id AND e.manager_id = m.id', (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    const resultsArray = manager.concat(results)
                    const sortedResults = resultsArray.sort((a, b) => a.id - b.id);
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
                    reject(err)
                } else {
                    resolve(results);
                }
            })
        })

    };
};


module.exports = { Query, Departments, Roles, Employees };