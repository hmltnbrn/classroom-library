CREATE TABLE books (
    id SERIAL PRIMARY KEY NOT NULL,
    title TEXT,
    author TEXT,
    genre TEXT,
    level TEXT,
    number_in INTEGER,
    number_out INTEGER,
    available BOOLEAN
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT,
    class TEXT,
    active BOOLEAN
);

CREATE TABLE checked_out (
    id SERIAL PRIMARY KEY NOT NULL,
    book_id INTEGER REFERENCES books (id),
    student_id INTEGER REFERENCES students (id),
    date_out DATE,
    date_in DATE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username TEXT,
    password TEXT,
    salt TEXT,
    admin BOOLEAN
);

INSERT INTO students (name, class, active) VALUES
('Kevin Costner', '601', TRUE),
('Brian Hamilton', '601', TRUE),
('Barack Obama', '601', TRUE),
('Alex Rodriguez', '601', TRUE),
('Henry Tudor', '601', TRUE),
('Peter Capaldi', '602', TRUE),
('Idris Elba', '602', TRUE),
('Benjamin Sisko', '602', TRUE),
('Jon Snow', '602', TRUE),
('Elizabeth Thornberry', '602', TRUE),
('Daniel Day-Lewis', '603', TRUE),
('William Henry Harrison', '603', TRUE),
('Natalie Merchant', '603', TRUE),
('Lin-Manuel Miranda', '603', TRUE),
('Daenerys Targaryen', '603', TRUE);

INSERT INTO users (username, password, salt, admin) VALUES
('admin', '0d69f9f9f5f8281916dfb28f83b7621437a1618ee881e745cfcfb844f7f0634e', 'f574566127fc27d61d4c4777ac09ac9ec513ee843eb5c21fee42887b7b0542b9', TRUE),
('librarian', '02a3efdafbb99e165f647a734dc67e64764cded725225897c1ab23aa0a0f6c35', 'a47da52d82102a4d5db9a38cd834cc7705f63dea40d971e48378915b5a5a4fe8', FALSE);

COPY books (title, author, genre, level, number_in, number_out, available) FROM '{{put file path here}}/database/books.csv' DELIMITER ',' CSV HEADER;
