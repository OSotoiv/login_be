const db = require("../db");
const { ExpressError, UnauthorizedError } = require("../expressErrors");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require('../config')

class User {
    constructor(username = "") {
        this.username = username
    }
    static async get(username) {
        const results = await db.query(`SELECT username, email, joined_at FROM users WHERE username = $1`, [username]);
        const user = results.rows[0];
        if (user) {
            return user;
        }
        throw new UnauthorizedError(`${username} not found`)
    }

    static async all() {
        const results = await db.query(`SELECT username FROM users;`);
        if (results.rows[0]) {
            return results.rows;
        }
        throw new ExpressError(403, 'your not authorized');
    }
    static async register(username, password, email) {
        /** register a new user
         * Returnes (username, email, joined_at)
         */
        try {
            const hashPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
            const results = await db.query(`INSERT INTO users (username, password, email, joined_at)
        VALUES ($1, $2, $3, NOW()) RETURNING username, email, joined_at;`, [username, hashPassword, email]);
            if (results.rows[0]) {
                return results.rows[0];
            }
            throw new ExpressError('Failed to register user');
        } catch (e) {
            if (e.code === '23505') {
                throw new ExpressError('Username/email Taken, Please Pick another', 400);
            } else {
                throw new ExpressError('something went wrong', 400);
            }

        }
    }
    static async login(username, password) {
        /** authenticate user with username, password.
        *
        * Returns { username, first_name, last_name, email, is_admin }
        *
        * Throws UnauthorizedError is user not found or wrong password.
        **/
        // try to find the user first
        const result = await db.query(
            `SELECT username,
                password,
                email
                FROM users
                WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");

    }
}

module.exports = User;