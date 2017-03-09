# Classroom Library

![Library Preview](/www/images/preview.png?raw=true "Library Preview")

Play around with a demo version on [Heroku](https://classroomlibrary.herokuapp.com/)! Default usernames and passwords are listed below.

[Node.js](https://nodejs.org/en/) app using [Express](https://expressjs.com/), [Webpack](https://webpack.github.io/), [React](https://facebook.github.io/react/), [React Router](https://github.com/reactjs/react-router), [Passport](http://passportjs.org/), [Crypto](https://nodejs.org/api/crypto.html), [Material-UI](http://www.material-ui.com/#/), and a [PostgreSQL](https://www.postgresql.org/) database.

Credit to ccoenraets and his [beer explorer](https://github.com/ccoenraets/belgian-beer-explorer) for creating the initial front-end and back-end I used to start this project.

## Installation

1. Download the latest versions of [Node.js](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/).

2. Set up a local database called **library** (or anything you'd like) or use a Postgres database supplied by Heroku.

3. Clone the repository or download the zip file for this project.

4. Either open **database/database.sql** and import the contents to the database or just import the SQL file itself. All tables should be created with dummy data. A CSV file for the books table is included for reference.

5. Use terminal/cmd/powershell/something similar to navigate to the directory with the files and type the command below. This will automatically install all dependencies listed in the **package.json** file.

    ```
    npm install
    ```

6. Open **server/config.js** and edit the databaseURL to be accurate. For a production server, you will want to set the environment variable (on Heroku, use config vars). If you're deploying on a web server, add **?ssl=true** to the end of the URL.

7. Type and run the command below to build the Webpack files:

    ```
    npm run webpack
    ```
    
8. Type and run the command below to run the server:

    ```
    npm start
    ```

9. Open a browser of your choice (but for your own health, avoid IE) and navigate to [http://localhost:8080](http://localhost:8080).

## Initial Users/Passwords

1. Teacher/password (includes access to [admin](http://localhost:8080/admin) page)
2. Librarian/password

Use the [admin](http://localhost:8080/admin) page to change passwords and add new users.

## Usage Notes

1. When altering the modules and components, you have to run the webpack command in order to see the changes. Changing anything in the server files just requires restarting the server.

2. Only retrieving books should be done with GET. Signing in/out, retrieving students, making changes to the database, etc. should all use POST. This is to avoid allowing sensitive information to be easily seen or allowing a URL to change the database.

3. All user accounts require a [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hashed password with an associated [salt](https://en.wikipedia.org/wiki/Salt_(cryptography)) saved with it.

4. Major changes to the books and students tables should be done within Postgres. Using the [admin](http://localhost:8080/admin) page is mainly for small changes.

5. It's designed to always require a sign in to see student's names and to check out/in books.

6. Signing in creates a browser session, allowing for refreshing the page and remaining signed in. Restart the server to reinitialize it.

7. The heroku-ssl-redirect module is included, but will only do anything with proper SSL certificates in use on Heroku.

---

Feel free to use this as a stepping stone for learning React or as a base for something else. Let me know if there are any issues or if you have any questions.
