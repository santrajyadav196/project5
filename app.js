const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const State = require('./models/state');
const District = require('./models/district');
const Child = require('./models/child');


mongoose.connect('mongodb://localhost:27017/details', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
const sessionConfig = {
    secret: 'This is secret!!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.flash("success", 'Welocome to dhawani!!!')
        res.redirect('/states')
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register')
    }
})

app.get('/login', (req, res) => {
    res.render('users/login')
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash("success", "Welcome Back!!")
    res.redirect('/states')
})

app.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "GoodBye!!")
    res.redirect('/')
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/states', async (req, res) => {
    const states = await State.find({});
    res.render('details/state', { states });
})

app.get('/states/new', (req, res) => {
    res.render('details/newState');
})

app.post('/states', async (req, res) => {
    const newState = new State(req.body);
    await newState.save();
    req.flash('success', 'Successfully you made state!!')
    res.redirect('/states');
})

app.get('/districts', async (req, res) => {
    const districts = await District.find({});
    res.render('details/district', { districts });
})

app.get('/districts/new', (req, res) => {
    res.render('details/newDistrict');
})

app.post('/districts', async (req, res) => {
    const newDistrict = new District(req.body);
    await newDistrict.save();
    req.flash('success', 'Successfully you made district!!')
    res.redirect('/districts');
})

app.get('/children', async (req, res) => {
    const children = await Child.find({});
    res.render('details/child', { children });
})

app.get('/children/new', (req, res) => {
    res.render('details/newChild');
})

app.post('/children', async (req, res) => {
    const newChild = new Child(req.body);
    await newChild.save();
    req.flash('success', 'Successfully you made child!!')
    res.redirect('/children');
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
});

