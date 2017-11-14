"use strict";

let express = require('express'),
    compression = require('compression'),
    path = require('path'),
    library = require('./server/library'),
    db = require('./server/pghelper'),
    sslRedirect = require('heroku-ssl-redirect'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    crypto = require('crypto'),
    app = express();

require('dotenv-safe').load({
    allowEmptyValues: true
});

app.set('port', process.env.PORT || 8080); //sets port

if (process.env.NODE_ENV === 'production') {
    app.use(sslRedirect());
}

app.use(compression());

app.use('/', express.static(__dirname + '/www'));

app.use(cookieParser(process.env.COOKIE_SECRET || 'library'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.COOKIE_SECRET || 'library',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Handle 500 error
app.use(function(err, req, res, next) {
    res.status(500).send('500: Internal Server Error');
});

let createHash = (string) => crypto.createHash('sha256').update(string).digest('hex'); //hashes password

passport.use(new LocalStrategy( //passport local strategy
    (username, password, done) => {
        return db.query("SELECT salt FROM users WHERE username = $1", [username])
            .then(result => {
                return db.query("SELECT id, username, admin FROM users WHERE username = $1 AND password = $2", [username, createHash(password + result[0].salt)])
                    .then(result => {
                        return done(null, result[0]);
                    })
                    .catch(err => {
                        return done(null, false, {message:'Wrong password'});
                    });
                })
            .catch(err => {
                return done(null, false, {message:'Wrong user name'});
            });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query("SELECT id, username, admin FROM users WHERE id = $1", [id])
        .then(user => {
            done(null, user[0]);
        })
        .catch(err => {
            done(new Error("User with the id ${id} does not exist"));
        })
});

// Adding CORS support
app.all('*', function (req, res, next) {
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
    res.header('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        next();
    }
});

app.get('/books', library.findAllBooks);
app.get('/books/titles', library.findAllBookTitles);
app.get('/books/:id', library.findBookById);
app.post('/students', isLoggedIn, library.findAllStudents);
app.post('/student', isLoggedIn, library.findStudentById);
app.post('/student/history', isLoggedIn, library.findStudentHistoryById);
app.post('/checkedout/book/students', isLoggedIn, library.findStudentsByBook);
app.post('/checkedout/books/students', isLoggedIn, library.findStudentsByAllBooks);
app.post('/book/checkout', isLoggedIn, library.checkOutBook);
app.post('/book/checkin', isLoggedIn, library.checkInBook);
app.post('/user/register', isLoggedIn, library.register);
app.post('/user/changepassword', isLoggedIn, library.changePassword);
app.post('/book/add', isLoggedIn, library.addBook);
app.post('/book/update', isLoggedIn, library.updateBook);
app.post('/student/add', isLoggedIn, library.addStudent);
app.post('/student/update', isLoggedIn, library.updateStudent);

app.post('/user/signin', isNotLoggedIn, function (req, res, next) {
    passport.authenticate('local', {session: true}, function(err, user, info) {
        if (err) { return res.json({status: "Unknown Error -- Contact Website Owner"}); }
        if (!user) { return res.json({status: "Incorrect username or password"}); }
        req.logIn(user, function(err) {
            if (err) { return res.json({status: "Unknown Error -- Contact Website Owner"}); }
            return res.json({status: false});
        });
    })(req, res, next);
});

app.post('/user/signout', isLoggedIn, function (req, res, next){
    req.logout();
    return res.json({status: false});
});

app.post('/user/session', checkSession, function (req, res, next) {
    return res.json({status: true, admin: req.user.admin, username: req.user.username});
});

app.get('*', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

function isLoggedIn(req, res, next) { //checks authentication status
    if (req.isAuthenticated())
        return next();

    return res.json({status: false, message: "Not Authorized"});
}

function isNotLoggedIn(req, res, next) { //checks non-authentication status
    if (!req.isAuthenticated())
        return next();

    return res.json({status: false, message: "Not Authorized"});
}

function checkSession(req, res, next) { //checks session status
    if (req.isAuthenticated())
        return next();

    return res.json({status: false, admin: false, username: ""});
}

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
