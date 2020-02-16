const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
require('../config/passport');

const app = express();


app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/user.routes');
const postsRouter = require('./routes/posts.routes');

app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use('/posts', postsRouter);

app.get('*', (req, res) => {                       
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));                               
});

require('../config/database');


app.listen(process.env.PORT || 8000, () => {
  console.log('Server is listening on port 8000');
})


