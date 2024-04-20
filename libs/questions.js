class Prompt {
    constructor() {
        this.mainmenu = {
            type: 'list',
            message: 'Main Menu',
            name: 'mainMenu',
            choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Employee Role', 'Add Employee', 'Update Employee Role']
        }

        this.departmentName = {
            type: 'input',
            message: 'Enter department name you would like to add.',
            name: 'departmentName',
            validate: (input) => {
                if (input.length > 30) {
                    console.log(`Input must be a max of 30 characters!`);
                    return false;
                }
                if (input.length < 1) {
                    console.log('Input must be a minimum of 1 character.');
                }
                return true;
            }
        };

        this.roleName = {
            type: 'input',
            message: 'Enter role name you would like to add.',
            name: 'roleName',
            validate: (input) => {
                if (input.length > 30) {
                    console.log(`Input must be a max of 30 characters!`);
                    return false;
                }
                if (input.length < 1) {
                    console.log('Input must be a minimum of 1 character.');
                }
                return true;
            }
        };

        this.roleSalary = {
            type: 'number',
            message: 'Enter salary amount for role.',
            name: 'roleSalary'
        };

        this.roleDepartment = {
            type: 'input',
            message: 'Enter department the new role will be in.',
            validate: (input) => {
                if (input.length > 30) {
                    console.log(`Input must be a max of 30 characters!`);
                    return false;
                }
                if (input.length < 1) {
                    console.log('Input must be a minimum of 1 character.');
                }
                return true;
            },
            name: 'roleDepartment'
        };

        this.employeeName = {
            type: 'input',
            message: 'Enter employee first and last name.',
            validate: (input) => {
                if (input.length > 30) {
                    console.log(`Input must be a max of 30 characters!`);
                    return false;
                }
                if (input.length < 1) {
                    console.log('Input must be a minimum of 1 character.');
                }
                return true;
            },
            name: 'employeeName'
        };

        this.employeeRole = {
            type: 'input',
            message: 'Enter employee role',
            validate: (input) => {
                if (input.length > 30) {
                    console.log(`Input must be a max of 30 characters!`);
                    return false;
                }
                if (input.length < 1) {
                    console.log('Input must be a minimum of 1 character.');
                }
                return true;
            },
            name: 'employeeRole'
        };

        this.employeeManager = {
            type: 'input',
            message: 'Enter employee manager first and last name.',
            validate: (input) => {
                if (input.length > 30) {
                    console.log(`Input must be a max of 30 characters!`);
                    return false;
                }
                if (input.length < 1) {
                    console.log('Input must be a minimum of 1 character.');
                }
                return true;
            },
            name: 'employeeRole'
        };

        this.return = {
            type: 'confirm',
            name: 'restart',
            message: 'Would you like to return to the main menu?',
            default: true
        };
    };
};

module.exports = Prompt;