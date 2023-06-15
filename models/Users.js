const db = require("../db");
const { ExpressError } = require("../expressErrors");

class User {
    constructor() {

    }
    static async all() {
        const results = await db.query(`SELECT * FROM users;`);
        if (results.rows[0]) {
            return results.rows;
        }
        throw new ExpressError(403, 'your not authorized');
    }
}

module.exports = User;