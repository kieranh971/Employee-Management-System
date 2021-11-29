INSERT into department (dept_name)
VALUES
    ('Executive'),
    ('Accounting'),
    ('Sales'),
    ('Customer Service'),
    ('HR');

    
    
INSERT into roles (title, salary, department_id)
VALUES
    ('CFO', 500000, 1),
        ('EVP', 250000, 1),
        ('Regional Manager', 75000, 1),
            ('Head of Accounting', 65000, 2),
                ('Senior Accountant', 60000, 2),
                ('Junior Accountant', 55000, 2),
            ('Head of Sales', 60000, 3),
                ('Salesperson', 57000, 3),
                ('Salesperson', 57000, 3),
                ('Salesperson', 57000, 3),
            ('Head of CS', 55000, 4),
            ('Head of HR', 50000, 5),
            ('Secretary', 45000, 5);

INSERT into employee (first_name, last_name, role_id, manager_id)
VALUES
    ('David', 'Wallace', 1, 1),
    ('Jan', 'Levinson', 2, 1),
    ('Michael', 'Scott', 3, 1),
    ('Angela', 'Martin', 4, 3),
    ('Oscar', 'Martinez', 5, 4),
    ('Kevin', 'Malone', 6, 4),
    ('Dwight', 'Schrute', 7, 3),
    ('Jim', 'Halpert', 8, 3),
    ('Andy', 'Bernard', 9, 3),
    ('Pam', 'Halpert', 10, 3),
    ('Kelly', 'Kapoor', 11, 1),
    ('Toby', 'Flenderson', 12, 1),
    ('Erin', 'Hannon', 13, 3);

Select
employee.first_name,
employee.last_name,
roles.title,
roles.salary,
department.department_name,
employee_m.first_name as manager_first_name,
employee_m.last_name as manager_last_name
from
    employee
    join roles on employee.role_id = roles.id
    join department on roles.department_id = department.id
    LEFT join employee as employee_m on employee.manager_id = employee_m.id;

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;