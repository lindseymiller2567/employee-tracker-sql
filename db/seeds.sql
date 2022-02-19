INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Executive', 100000, 1),
    ('Sales Associate', 80000, 1),
    ('Finance Manager', 100000, 2),
    ('Accountant', 80000, 2),
    ('Legal Manager', 100000, 3),
    ('Lawyer', 90000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Billie', 'Eilish', 1, NULL),
    ('Justin', 'Bieber', 2, 1),
    ('Jennifer', 'Lopez', 3, NULL),
    ('Kanye', 'West', 4, 3),
    ('Ariana', 'Grande', 5, NULL),
    ('Ed', 'Sheeran', 6, 5),
    ('Brittany', 'Spears', 2, 1);