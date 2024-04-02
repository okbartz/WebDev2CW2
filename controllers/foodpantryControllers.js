const foodpantryDAO = require('../models/foodpantryModel');
const userDao = require("../models/userModel.js");
const db = new foodpantryDAO();
const jwt = require("jsonwebtoken");

db.init();

// exports.entries_list = function (req, res) {
//     res.send('<h1>foodpantry Messages</h1><p>Not yet implemented: will show a list of food pantry entries.</p> ');
// }

exports.entries_list = function (req, res) {
    res.send('<h1>Not yet implemented: show a list of food pantry entries.</h1>');
    db.getAllEntries();
}

exports.peters_entries = function (req, res) {
    res.send('<h1>Processing Peter\'s Entries, see terminal</h1>');
    db.getPetersEntries();
}

exports.landing_page = function (req, res) {
    db.getAllEntries()
        .then((list) => {
            res.render('entries', {
                'title': 'food pantry',
                'entries': list
            });
            console.log('promise resolved');
        })
        .catch((err) => {
            console.log('promise rejected', err);
        })
}

exports.show_register_page = function (req, res) {
    res.render("user/register");
}



exports.show_about_page = function (req, res) {
    
    const myCookieValue = req.cookies['jwt'];


    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.log('Error verifying token:', err);
            res.render("about");
            return;
        } else {
            const username = decoded.username;
            console.log('Getting Username:', username);
            console.log('Getting dec:', decoded);

            
            res.render("about", {
                user:"user"
            });
        
        
        }
    });
    
    
    
    
    
}

exports.loggedIn_landing = function (req, res) {
    db.getAllEntries()
        .then((list) => {
            res.render("entries", {
                title: "Provided Items",
                entries: list, user:
                    "user"
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });
};


exports.handle_login = function (req, res) {
    res.render("newEntry", {
        title: "Food",
        user: "user"
    });
};

exports.logout = function (req, res) {
    res.clearCookie("jwt").status(200).redirect("/");
}


exports.new_entries = function (req, res) {
    res.render('newEntry', {
        'title': 'Food'
    })
}

exports.new_entry = function (req, res) {
    res.send('<h1>Not yet implemented: show a new entry page.</h1>');
}

exports.post_new_entry = function (req, res) {
    console.log('processing post-new_entry controller');
    if (!req.body.foodtitle) {
        response.status(400).send("Entries must have an food title.");
        return;
    }

    const myCookieValue = req.cookies['jwt'];

    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.error('Error verifying token:', err);
            res.status(500).send("Error verifying token");
            return;
        } else {
            const username = decoded.username;
            console.log('Getting Username:', username);
            console.log('Getting dec:', decoded);

            // Perform database operation after getting email
            db.addEntry(req.body.foodtitle, req.body.foodimg, req.body.foodexp, req.body.fooddesc, username);
            res.redirect("/loggedIn");
        }
    });
}

exports.show_login_page = function (req, res) {
    res.render("user/login");
};

exports.post_new_user = function (req, res) {
    const email = req.body.emailaddress; 
    const fname = req.body.forename; 
    const sname = req.body.surname; 
    const password = req.body.pass;
    const confpassword = req.body.confpassword;



    if (!email || !password) {
        res.send(401,
            'no email or no password'); return;
    }
    userDao.lookup(email, function (err, u) {
        if (u) {
            res.send(401, "User exists:", email); return;
        }
        userDao.create(email,fname,sname,password,confpassword);
        
        console.log("register user", email, "password", password);
        res.redirect('/login');
    });
}

exports.show_user_entries = function (req, res) {
    console.log('filtering author name', req.params.user);
    let user = req.params.user;
    db.getEntriesByUser(user).then(
        (entries) => {
            res.render('entries', {
                'title': 'Users items',
                'user': 'user',
                'entries': entries
                
            });
        }).catch((err) => {
            console.log('error handling author posts', err);
        });
}


exports.show_new_entries = function (req, res) {
    res.render('newEntry', {
        'title': 'Items',
        'user': 'user'
    })
}