const express = require('express');
const { ExpressError } = require('./expressErrors');
const User = require('./models/Users')
//routes
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute')

const { authenticateJWT } = require('./middleware/authMiddleware')


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(authenticateJWT);

app.get("/", (req, res) => {
        console.log('headers', req.headers)
        console.log("headers.auth", req.headers.authorization)
        return res.json({ hello: 'world' });
});
app.use('/auth', authRoute)
app.use('/user', userRoute)


//catch all for page not found
app.use("*", (req, res, next) => {
        console.log('here')
        const err = new ExpressError('Page Not Found', 400);
        return next(err);
})
//handle error response
app.use((err, req, res, next) => {
        const msg = err.message || 'something went wrong';
        const status = err.status || 500;
        return res.status(status).json({ error: msg })
})

module.exports = app;