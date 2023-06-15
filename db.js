"use strict";

const { Client } = require("pg");
require('dotenv').config();

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "usersdb_test"
        : process.env.DATABASE_URL || "usersdb";
}

let db;

if (process.env.NODE_ENV === "production") {
    db = new Client({
        user: process.env.DB_USER,
        host: 'localhost',
        database: getDatabaseUri(),
        password: process.env.DB_PASSWORD,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    db = new Client({
        user: process.env.DB_USER,
        host: 'localhost',
        database: getDatabaseUri(),
        password: process.env.DB_PASSWORD,
    });
}

db.connect();

module.exports = db;