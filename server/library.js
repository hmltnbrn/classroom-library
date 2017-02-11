"use strict";

let crypto = require('crypto'),
    db = require('./pghelper');

let createSalt = () => crypto.randomBytes(32).toString('hex'); //creates salt for password

let createHash = (string) => crypto.createHash('sha256').update(string).digest('hex'); //hashes password

let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let findAllBooks = (req, res, next) => { //finds all books with or without a search query

    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
        page = req.query.page ? parseInt(req.query.page) : 1,
        search = req.query.search,
        whereParts = [],
        values = [];

    if (search) {
        values.push(escape(search));
        whereParts.push("title || author || genre ~* $" + values.length);
    }

    whereParts.push("available IS TRUE");

    let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";

    let countSql = "SELECT COUNT(*) from books " + where;

    let sql = "SELECT id, title, author, genre, level, number_in, number_out, available " +
                "FROM books " + where +
                " ORDER BY title LIMIT $" + (values.length + 1) + " OFFSET $" +  + (values.length + 2);

    db.query(countSql, values)
        .then(result => {
            let total = parseInt(result[0].count);
            db.query(sql, values.concat([pageSize, ((page - 1) * pageSize)]))
                .then(books => {
                    return res.json({"pageSize": pageSize, "page": page, "total": total, "books": books});
                })
                .catch(next);
        })
        .catch(next);
};

let findAllBookTitles = (req, res, next) => { //finds book ID and title for admin page
    let sql = "SELECT id, title FROM books ORDER BY title";

    db.query(sql, [])
        .then(books => res.json({books}))
        .catch(next);
};

let findBookById = (req, res, next) => { //finds book info based on the ID
    let id = req.params.id;

    let sql = "SELECT id, title, author, genre, level, number_in, number_out, available FROM books WHERE id = $1";

    db.query(sql, [parseInt(id)])
        .then(book => res.json({book}))
        .catch(next);
};

let findAllStudents = (req, res, next) => { //finds all students

    let active = req.body.active;
    let sql = "";
    let sql2 = "";

    if (active == "only active") { //gets active students only
        sql = "SELECT * FROM students WHERE active IS TRUE ORDER BY SUBSTRING(name, '([^[:space:]]+)(?:,|$)')";
    }
    else if (active == "all + books") { //get all students plus how many books they have/what books they have
        sql = "SELECT s.id, s.class, s.name, " +
                "CASE WHEN (SELECT COUNT(*) FROM checked_out c WHERE c.date_in IS NULL) = 0 " +
                "THEN 0 ELSE (SELECT COUNT(*) FROM checked_out c WHERE s.id = c.student_id AND c.date_in IS NULL) END AS total_out, " +
                "ARRAY(SELECT DISTINCT b.title FROM books b, checked_out c WHERE s.id = c.student_id AND b.id = c.book_id AND c.date_in IS NULL) AS books_out " +
                "FROM students s WHERE active IS TRUE GROUP BY s.name, s.class, s.id ORDER BY s.class, SUBSTRING(s.name, '([^[:space:]]+)(?:,|$)')";
        sql2 = "SELECT s.id, s.class, s.name, " +
                "CASE WHEN (SELECT COUNT(*) FROM checked_out c WHERE c.date_in IS NULL) = 0 " +
                "THEN 0 ELSE (SELECT COUNT(*) FROM checked_out c WHERE s.id = c.student_id AND c.date_in IS NULL) END AS total_out, " +
                "ARRAY(SELECT DISTINCT b.title FROM books b, checked_out c WHERE s.id = c.student_id AND b.id = c.book_id AND c.date_in IS NULL) AS books_out " +
                "FROM students s WHERE active IS FALSE GROUP BY s.name, s.class, s.id ORDER BY s.class, SUBSTRING(s.name, '([^[:space:]]+)(?:,|$)')";
    }
    else { //gets all students regardless of active status
        sql = "SELECT * FROM students ORDER BY SUBSTRING(name, '([^[:space:]]+)(?:,|$)')";
    }

    db.query(sql, [])
        .then(students => {
            if (sql2 === "") {
                return res.json({"students": students});
            }
            else {
                db.query(sql2, [])
                    .then(inactive_students => {
                        return res.json({"students": students, "inactive_students": inactive_students});
                    })
                    .catch(next);
            }
            
        })
        .catch(next);
};

let findStudentById = (req, res, next) => { //gets student info based on ID
    let sql = "SELECT name, class, active FROM students WHERE id = $1";

    db.query(sql, [parseInt(req.body.studentId)])
        .then(student => res.json({student}))
        .catch(next);
};


let findStudentHistoryById = (req, res, next) => { //gets student info based on ID
    let sql = "SELECT name, class, active FROM students WHERE id = $1";
    let sql2 = "SELECT c.id, c.book_id, b.title, b.level, c.date_out, c.date_in " +
                "FROM books b, checked_out c " + 
                "WHERE c.student_id = $1 AND b.id = c.book_id AND c.date_in IS NULL ORDER BY c.date_out DESC";
    let sql3 = "SELECT c.id, c.book_id, b.title, b.level, c.date_out, c.date_in " +
                "FROM books b, checked_out c " + 
                "WHERE c.student_id = $1 AND b.id = c.book_id AND c.date_in IS NOT NULL ORDER BY c.date_in DESC";

    db.query(sql, [parseInt(req.body.studentId)])
        .then(student => {
            db.query(sql2, [parseInt(req.body.studentId)])
                .then(out_books => {
                    db.query(sql3, [parseInt(req.body.studentId)])
                        .then(in_books => {
                            res.json({"student": student, "out_books": out_books, "in_books": in_books});
                        })
                        .catch(next);
                    })
                .catch(next);
            })
        .catch(next);
};

let findStudentsByBook = (req, res, next) => { //gets student info based on if they have a book ID checked out
    let sql = "SELECT s.id, s.name FROM students s, checked_out c " +
                "WHERE s.id = c.student_id AND c.date_in IS NULL AND c.book_id = $1 " +
                "GROUP BY s.id, s.name ORDER BY SUBSTRING(name, '([^[:space:]]+)(?:,|$)')";

    db.query(sql, [parseInt(req.body.bookId)])
        .then(studentsByBook => res.json({studentsByBook}))
        .catch(next);
};

let findStudentsByAllBooks = (req, res, next) => { //gets books that are checked out and the students that have them

    let pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 12,
        page = req.body.page ? parseInt(req.body.page) : 1,
        search = req.body.search,
        signedIn = (req.body.signedIn === 'true'),
        whereParts = [],
        values = [];

    if (search) {
        values.push(escape(search));
        if (signedIn === true) {
            whereParts.push("b.title || s.name ~* $" + values.length + " AND");

        }
        else {
            whereParts.push("b.title ~* $" + values.length + " AND");
        }
    }

    let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "WHERE ";

    let countSql = "SELECT COUNT(DISTINCT b.title) from books b, students s, checked_out c " + where +
                    " s.id = c.student_id AND b.id = c.book_id AND c.date_in IS NULL";

    let sql = "SELECT c.book_id, b.title, ARRAY(SELECT s2.name FROM books b2, students s2, checked_out c2 " +
                "WHERE s2.id = c2.student_id AND c2.book_id = c.book_id AND c2.date_in IS NULL GROUP BY s2.name " +
                "ORDER BY SUBSTRING(s2.name, '([^[:space:]]+)(?:,|$)')) AS students FROM books b, students s, checked_out c " + where +
                " s.id = c.student_id AND b.id = c.book_id AND c.date_in IS NULL GROUP BY c.book_id, b.title ORDER BY b.title " +
                "LIMIT $" + (values.length + 1) + " OFFSET $" + (values.length + 2);

    db.query(countSql, values)
        .then(result => {
            let total = parseInt(result[0].count);
            db.query(sql, values.concat([pageSize, ((page - 1) * pageSize)]))
                .then(books => {
                    return res.json({"pageSize": pageSize, "page": page, "total": total, "books": books});
                })
                .catch(next);
        })
        .catch(next);
};

let checkOutBook = (req, res, next) => { //checks out a book

    let sql1 = "SELECT * FROM checked_out WHERE book_id = $1 AND student_id = $2 AND date_in IS NULL";
    let sql2 = "INSERT INTO checked_out (book_id, student_id, date_out) VALUES ($1, $2, CURRENT_TIMESTAMP)";
    let sql3 = "UPDATE books SET number_in = $1, number_out = $2 WHERE id = $3";

    db.query(sql1, [parseInt(req.body.bookId), parseInt(req.body.studentId)])
        .then(result => {
            if(result.length !== 0) {
                return res.json({"status": "Already has book"}); //returns if the student already has the book
            }
            else {
                db.query(sql2, [parseInt(req.body.bookId), parseInt(req.body.studentId)])
                    .then(() => {
                        db.query(sql3, [parseInt(req.body.numberIn), parseInt(req.body.numberOut), parseInt(req.body.bookId)])
                            .then(() => {
                                return res.json({"status": false})
                            })
                            .catch(next);
                    })
                    .catch(next);
            }
        })
        .catch(next);

};

let checkInBook = (req, res, next) => { //checks in a book

    let sql1 = "UPDATE checked_out SET date_in = CURRENT_TIMESTAMP WHERE book_id = $1 AND student_id = $2 AND date_in IS NULL";
    let sql2 = "UPDATE books SET number_in = $1, number_out = $2 WHERE id = $3";

    db.query(sql1, [parseInt(req.body.bookId), parseInt(req.body.studentId)])
        .then(() => {
            db.query(sql2, [parseInt(req.body.numberIn), parseInt(req.body.numberOut), parseInt(req.body.bookId)])
                .then(res.redirect('back'))
                .catch(next);
        })
        .catch(next);
};

let register = (req, res, next) => { //creates new users

    let salt = createSalt(); //creates salt
    let hashedPassword = createHash(req.body.password + salt); //creates a hashed password with the inputted password and salt

    let sql1 = "SELECT id FROM users WHERE username = $1";
    let sql2 = "INSERT INTO users (username, password, salt, admin) VALUES ($1, $2, $3, $4)";

    db.query(sql1, [req.body.username])
        .then(result => {
            if(result.length !== 0) {
                return res.json({"status": "Username already taken"}); //returns if the username is already taken
            }
            else {
                db.query(sql2, [req.body.username, hashedPassword, salt, req.body.admin])
                    .then(() => {
                        return res.json({"status": false})
                    })
                    .catch(next);
            }
        })
        .catch(next);
};

let changePassword = (req, res, next) => { //changes password for a user

    let salt = createSalt(); //creates salt
    let hashedPassword = createHash(req.body.password + salt); //creates a hashed password with the inputted password and salt

    let sql1 = "SELECT id FROM users WHERE username = $1";
    let sql2 = "UPDATE users SET password = $1, salt = $2 WHERE username = $3";

    db.query(sql1, [req.body.username])
        .then(result => {
            if(result.length === 0) {
                return res.json({"status": "Username doesn't exist"}); //returns if the username doesn't exist
            }
            else {
                db.query(sql2, [hashedPassword, salt, req.body.username])
                    .then(() => {
                        return res.json({"status": false})
                    })
                    .catch(next);
            }
        })
        .catch(next);
};

let addBook = (req, res, next) => { //add book

    let sql1 = "SELECT id FROM books WHERE title = $1";
    let sql2 = "INSERT INTO books (title, author, genre, level, number_in, number_out, available) VALUES ($1, $2, $3, $4, $5, $6, TRUE)";

    db.query(sql1, [req.body.title])
        .then(result => {
            if(result.length !== 0) {
                return res.json({"status": "Book already exists"}); //returns if book already exists
            }
            else {
                db.query(sql2, [req.body.title, req.body.author, req.body.genre, req.body.level, parseInt(req.body.numberIn), 0])
                    .then(() => {
                        return res.json({"status": false})
                    })
                    .catch(next);
            }
        })
        .catch(next);
};

let updateBook = (req, res, next) => { //updates a specific book

    let sql = "UPDATE books SET title = $1, author = $2, genre = $3, level = $4, number_in = $5, number_out = $6, available = $7 WHERE id = $8";

    db.query(sql, [req.body.title, req.body.author, req.body.genre, req.body.level, parseInt(req.body.numberIn), parseInt(req.body.numberOut), req.body.available, parseInt(req.body.bookId)])
        .then(res.redirect('back'))
        .catch(next);
};

let addStudent = (req, res, next) => { //adds a student

    let sql1 = "SELECT id FROM students WHERE name = $1 AND class = $2";
    let sql2 = "INSERT INTO students (name, class, active) VALUES ($1, $2, TRUE)";

    db.query(sql1, [req.body.name, req.body.class])
        .then(result => {
            if(result.length !== 0) {
                return res.json({"status": "Student already exists"}); //returns if student already exists
            }
            else {
                db.query(sql2, [req.body.name, req.body.class])
                    .then(() => {
                        return res.json({"status": false})
                    })
                    .catch(next);
            }
        })
        .catch(next);
};

let updateStudent = (req, res, next) => { //updates a specific student

    let sql = "UPDATE students SET name = $1, class = $2, active = $3 WHERE id = $4";

    db.query(sql, [req.body.name, req.body.class, req.body.active, parseInt(req.body.studentId)])
        .then(res.redirect('back'))
        .catch(next);
};

exports.findAllBooks = findAllBooks;
exports.findAllBookTitles = findAllBookTitles;
exports.findBookById = findBookById;
exports.findAllStudents = findAllStudents;
exports.findStudentById = findStudentById;
exports.findStudentHistoryById = findStudentHistoryById;
exports.findStudentsByBook = findStudentsByBook;
exports.findStudentsByAllBooks = findStudentsByAllBooks;
exports.checkOutBook = checkOutBook;
exports.checkInBook = checkInBook;
exports.register = register;
exports.changePassword = changePassword;
exports.addBook = addBook;
exports.updateBook = updateBook;
exports.addStudent = addStudent;
exports.updateStudent = updateStudent;
