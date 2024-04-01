const path = require('path');
const public = path.join(__dirname, 'public');
const bodyParser = require('body-parser');
const express = require("express");
const app = express();

const cookieParser = require('cookie-parser') 
app.use(cookieParser())

const mustache = require('mustache-express');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(public));
require('dotenv').config();

app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const router = require('./routes/foodpantryRoutes');
const exp = require('constants');
app.use('/', router);

router.get('/about', function (req, res) {
    res.redirect('/about.html');
})

router.use(function (req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})

router.use(function (err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})

