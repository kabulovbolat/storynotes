const express = require ('express');
const mongoose = require ('mongoose');
const cookieParser = require ('cookie-parser');
const session = require ('express-session');
const passport = require ('passport');

require ('./models/User');

require ('./config/passport')(passport);

const auth = require ('./routes/auth');

const keys = require ('./config/keys');

mongoose.Promise = global.Promise;

mongoose.connect (keys.mongoURI, {
    useMongoClient: true
})
    .then (() => console.log ('MongoDB Connected'))
    .catch (err => console.log (err));

const app = express();

app.get ('/', (req, res) => {
    res.send ('It Works!');
});

app.use (cookieParser());
app.use (session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());

app.use ((req, res, next)=> {
    res.locals.user = req.user || null;
    next();
});

//Use Routes
app.use ('/auth', auth);

const port = process.env.PORT || 5000;

app.listen (port, () => {
    console.log (`Server started on port ${port}`)
});