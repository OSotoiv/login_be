"use strict";

const { Client } = require("pg");
const { DB_URI } = require('./config')


const SECRET_KEY = process.env.SALT_KEY || "secret";
const BCRYPT_WORK_FACTOR = 12;
const db = new Client(DB_URI);

db.connect();
module.exports = db;