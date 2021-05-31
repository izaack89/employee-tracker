USE employees;

INSERT INTO
    department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO
    role (title, salary, department_id)
VALUES
    ('Sales Lead', 110000, 1),
    ('Sales Person', 700000, 1),
    ('Lead Engineer', 120000, 2),
    ('Engineer Software', 110000, 2),
    ('Account Manager', 125000, 3),
    ('Accountant', 105000, 3),
    ('Leagal Team Lead', 225000, 4),
    ('Lawer', 125000, 4);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('German', 'Ramirez', 3, NULL),
    ('Isaac', 'Ramirez', 4, 2),
    ('Mike', 'Chan', 2, 1),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, NULL),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, NULL);