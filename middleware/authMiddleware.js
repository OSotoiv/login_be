"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressErrors");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
            //EXAMPLE::res.locals.user => { username: 'Octavian', isAdmin: false, iat: 1687039597 }
        }
        return next();
    } catch (err) {
        return next();
    }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        //should probably check if the user is still valid in the database here
        return next();
    } catch (err) {
        return next(err);
    }
}
//you are the user and you are logged in
function sameUserOrAdmin(req, res, next) {
    try {
        if (res.locals.user.username === req.params.username) {
            return next();
        } else {
            //check if you are admin status
            return isCreator(req, res, next);
        }
        return next({ status: 401, message: "Unauthorized" });
    } catch (err) {
        // errors would happen here if we made a request and req.locals.user is undefined
        return next({ status: 401, message: "Unauthorized Caught" });
    }
}

function isCreator(req, res, next) {
    try {
        if (res.locals.user.role === 'creator') {
            return next();
        }
        throw new UnauthorizedError();
    } catch (err) {
        return next(err);
    }
}
module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    isCreator,
    sameUserOrAdmin
};