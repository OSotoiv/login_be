const express = require('express');
const { ExpressError, BadRequestError } = require('../expressErrors');
const router = new express.Router();
const User = require('../models/Users')
const jsonschema = require("jsonschema");
const { createToken } = require("../helpers/JWT");
const authUserSchema = require("../schemas/users/authUser.json");
const registerUserSchema = require("../schemas/users/registerSchema.json");


router.post('/register', async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, registerUserSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { username, password, email } = req.body;
        const newUser = await User.register(username, password, email);
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (e) {
        return next(e);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        //validate requeset body
        const validator = jsonschema.validate(req.body, authUserSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { username, password } = req.body;
        const user = await User.login(username, password);
        const token = createToken(user);
        return res.status(200).json({ token });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;