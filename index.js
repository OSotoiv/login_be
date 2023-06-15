const express = require('express');
const { ExpressError } = require('./expressErrors');
const authRoute = require('./routes/auth')
const User = require('./models/Users')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoute)

app.get("/users", async (req, res, next) => {
        try {
                const users = await User.all();
                return res.json({ users })
        } catch (e) {
                return next(e)
        }
})








//catch all for page not found
app.use((req, res, next) => {
        const err = new ExpressError(404, 'Page Not Found');
        return next(err);
})
//handle error response
app.use((err, req, res, next) => {
        const msg = err.message || 'something went wrong';
        const status = err.status || 500;
        return res.status(status).json({ error: msg })
})
//server
app.listen(3000, () => console.log('http://localhost:3000/'))
module.exports = { app }