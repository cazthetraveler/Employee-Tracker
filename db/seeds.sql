INSERT INTO department (name)
VALUES ("Security"),
       ("Sales"),
       ("Technology"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Head of Security", 100000, 1),
       ("Security Guard", 85000, 1),
       ("Sales Lead", 90000, 2),
       ("Sales Representative", 80000, 2),
       ("Senior Engineer", 120000, 3),
       ("Software Engineer", 90000, 3),
       ("Malware Analyst", 85000, 3),
       ("Marketing Manager", 87500, 4),
       ("Marketing Specialist", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Olberic", "Eisenberg", 1, NULL),
       ("Hikari", "Ku", 2, 1),
       ("Tressa", "Calzione", 3, NULL),
       ("Partitio", "Yellowil", 4, 3),
       ("Osvald", "Vanstein", 5, NULL),
       ("Cyrus", "Albright", 6, 5),
       ("Throne", "Anguis", 7, 5),
       ("Primrose", "Azelhart", 8, NULL),
       ("Agnea", "Bristarni", 9, 8),
       ("Alfyn", "Greengrass", 9, 8);