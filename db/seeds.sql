INSERT INTO department (name)
VALUES ("Web Development"),
       ("Customer Service"),
       ("Human Resources"),
       ("Marketing");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Junior Developer", 65000, 1),
       ("Senior Developer", 100000, 1),
       ("Development Leader", 140000, 1),
       ("CSR", 45000, 2),
       ("CSR Manager", 70000, 2),
       ("HR Team Member", 60000, 3),
       ("HR Leader", 110000, 3),
       ("Marketing Associate", 50000, 4),
       ("Senior Marketing Associate", 65000, 4),
       ("Marketing Lead", 95000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Javascript", 1, 3),
       ("Johnny", "React", 2, 3),
       ("Raymond", "Vanillajs", 3, NULL),
       ("Molly", "Phoneperson", 4, 6),
       ("Vincent", "Ticketguy", 4, 6),
       ("Lauren", "Helpdesk", 5, NULL),
       ("Jack", "Human", 6, 8),
       ("Jenny", "Resources", 7, NULL),
       ("Earl", "Sellyacar", 8, 11),
       ("Sally", "Greatdeals", 9, 11),
       ("Veronica", "Getasale", 10, NULL);

INSERT INTO manager (id, first_name, last_name)
VALUES (3, "Raymond", "Vanillajs"),
       (6, "Lauren", "Helpdesk"),
       (8, "Jenny", "Resources"),
       (11, "Veronica", "Getasale");