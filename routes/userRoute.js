const express = require('express');
const User = require('../models/Users');
const { ensureLoggedIn, sameUserOrAdmin } = require('../middleware/authMiddleware')
// const { ExpressError, BadRequestError } = require('../expressErrors');
const router = new express.Router();
router.use(ensureLoggedIn)

router.get('/', async (req, res, next) => {
    try {
        const users = await User.all();
        return res.json({ users })
    } catch (e) {
        return next(e)
    }
})
router.get('/:username', sameUserOrAdmin, async (req, res, next) => {
    try {
        const { username } = req.params
        const user = await User.get(username);
        return res.json({ user });
    } catch (e) {
        return next(e)
    }
})
module.exports = router;