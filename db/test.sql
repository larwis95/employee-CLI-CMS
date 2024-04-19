SELECT e.id, e.first_name, e.last_name, er.salary, er.title, dep.name AS dep_name
FROM employee_role er, department dep, employee e, manager m
WHERE e.role_id = er.id AND er.department_id = dep.id AND e.id = m.id;