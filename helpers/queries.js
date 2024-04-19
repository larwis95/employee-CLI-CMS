const db = require('./db.js');
const titleCase = (str) => str.replace(/\b[a-z]/gi, (cahr) => cahr.toUpperCase()).replace(/Tv/gi, 'TV')

class Query {
    
    viewAll() {};

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

    create(name) {

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

    getID(department) {

        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM department WHERE name = "${titleCase(department)}"`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }
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
        const dep = new Departments
        const id = await dep.getID(department);
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES ("${titleCase(name)}", ${salary}, ${id[0].id})`, (err, results) => {
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
    
    viewEmployees() {

        return new Promise((resolve, reject) => {      
            db.query('SELECT e.id, e.first_name, e.last_name, er.salary, er.title, dep.name AS dep_name, m.first_name AS manager_first, m.last_name AS manager_last FROM employee_role er, department dep, employee e, manager m WHERE e.role_id = er.id AND er.department_id = dep.id AND e.manager_id = m.id', (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    console.log(results)
                    resolve(results);
                };
            });
        }); 
    };

    getManagers() {

        return new Promise ((resolve, reject) => {
            db.query('SELECT e.id, e.first_name, e.last_name, er.salary, er.title, dep.name AS dep_name, m.first_name AS manager_first, m.last_name AS manager_last FROM employee_role er, department dep, employee e, manager m WHERE e.role_id = er.id AND er.department_id = dep.id AND e.id = m.id', (err, results) => {
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
