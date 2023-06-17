
// read .env files and make environmental variables

require("dotenv").config();

let DB_URI = {
    user: process.env.DB_USER,
    host: 'localhost',
    database: '',
    password: process.env.DB_PASSWORD,
    ssl: ''
}

DB_URI.database = (process.env.NODE_ENV === "test")
    ? "usersdb_test"
    : "usersdb";

DB_URI.ssl = (process.env.NODE_ENV === "production")
    ? { rejectUnauthorized: false }
    : ""

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;


module.exports = {
    DB_URI,
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
};