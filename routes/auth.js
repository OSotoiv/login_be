const express = require('express');
const { ExpressError } = require('../expressErrors');
const router = new express.Router();

router.get('/', (req, res, next) => {
    return res.json({ msg: 'dogs page' })
})
router.get('/err', (req, res, next) => {
    throw new ExpressError(404, 'error during auth')
})

module.exports = router;