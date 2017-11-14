"use strict";

let pg = require('pg'),
    config = require('./config'),
    databaseURL = config.databaseURL;

exports.query = function (sql, values, singleItem, dontLog) {

    if (!dontLog) {
        console.log(sql, values);
    }

    const client = new pg.Client({
        connectionString: databaseURL
    });

    return new Promise((resolve, reject) => {

        client.connect((err) => {
            if (err) { return reject(err); }
            try {
                client.query(sql, values, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        client.end();
                        resolve(singleItem ? result.rows[0] : result.rows);
                    }
                });
            }
            catch (e) {
                client.end();
                reject(e);
            }
        });

    });

};
