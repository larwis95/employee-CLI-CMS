SELECT e.id, e.first_name, e.last_name, er.salary, er.title, dep.name AS dep_name, m.first_name AS manager_first, m.last_name AS manager_last
FROM employee_role er, department dep, employee e, manager m
WHERE e.role_id = er.id AND er.department_id = dep.id AND e.manager_id = m.id;