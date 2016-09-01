"use strict";

let express = require('express'),
    compression = require('compression'),
    path = require('path'),
    library = require('./server/library'),
    db = require('./server/pghelper'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    crypto = require('crypto'),
    app = express();

app.set('port', process.env.PORT || 8080); //sets port

app.use(compression());

app.use('/', express.static(__dirname + '/www'));

app.get(['/', '/out', '/students', '/admin'], function (req, res) { //react router routes
  res.sendFile(path.join(__dirname, 'www', 'index.html'))
});

// Adding CORS support
app.all('*', function (req, res, next) { //posts and gets
    if (req.method === 'OPTIONS') {
        // Set CORS headers: allow all origins, methods, and headers
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST");
        res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
        res.header('Access-Control-Allow-Credentials', true);

        // CORS Preflight
        res.send();

    }

    else {
        next();
    }

});

app.use(cookieParser('librarian'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('trust proxy', 1);
app.use(session({
    secret: 'librarian',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

function createHash(string) { //creates a hash passed on a password
    return crypto.createHash('sha256').update(string).digest('hex');
}

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

app.get('/books', library.findAllBooks);
app.get('/books/:id', library.findBookById);
app.post('/booktitles', library.findAllBookTitles);
app.post('/students', library.findAllStudents);
app.post('/student', library.findStudentById);
app.post('/checkedout', library.findStudentsByBook);
app.post('/checkedoutbooks', library.findStudentsByAllBooks);
app.post('/checkout', library.checkOutBook);
app.post('/checkin', library.checkInBook);
app.post('/register', library.register);
app.post('/changepassword', library.changePassword);
app.post('/addbook', library.addBook);
app.post('/updatebook', library.updateBook);
app.post('/addstudent', library.addStudent);
app.post('/updatestudent', library.updateStudent);

function isLoggedIn(req, res, next) { //checks authentication status
    if (req.isAuthenticated())
        return next();

    return res.json({status: false, admin: false, username: ""});
}

app.post('/signin', function (req, res, next) {
    passport.authenticate('local', {session: true}, function(err, user, info) {
        if (err) { return res.json({status: "Unknown Error -- Contact Website Owner"}); }
        if (!user) { return res.json({status: "Incorrect username or password"}); }
        req.logIn(user, function(err) {
            if (err) { return res.json({status: "Unknown Error -- Contact Website Owner"}); }
            return res.json({status: false});
        });
    })(req, res, next);
});

app.post('/signout', function (req, res, next){
    req.logout();
    return res.json({status: false});
});

app.post('/signed', isLoggedIn, function (req, res, next) {
    return res.json({status: true, admin: req.user.admin, username: req.user.username});
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
