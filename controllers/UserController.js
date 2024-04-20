const foodpantryDAO = require('../models/foodpantryModel');
const pantryDAO = require('../models/pantryModel');
const userDao = require("../models/userModel.js");
const adminDao = require("../models/adminModel.js");
const contactDao = require("../models/contactModel.js");

const db = require('../models/foodpantryModel');
const dbPantries = require('../models/pantryModel');

const dbUser = new require("../models/userModel");
const dbAdmin = new require("../models/adminModel");
const dbContact = require("../models/contactModel.js");
const jwt = require("jsonwebtoken");



//Function for displaying the register page
exports.show_register_page = function (req, res) {
    res.render("user/register");
}

// function for registering a new user
exports.post_new_user = function (req, res) {
    //Setting Variables
    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const confpassword = req.body.confpassword;

    //Validating Variables
    if (!email || !password) {
        return res.status(401).send('No email or no password');
    }

    if (password !== confpassword) {
        return res.status(401).send('Passwords do not match');
    }

    if (email > 200 && email < 5) {
        return res.status(401).send('Email is too long max lenght 200 or too short');
    }

    if (fname > 100 && fname < 3) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (sname > 100 && sname < 3) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (password < 8 && password > 100) {
        return res.status(401).send('password too long or short');
    }

    if (confpassword < 8 && confpassword > 100) {
        return res.status(401).send('password too long or short');
    }

    //Looking up if user exists in either the user and admin database
    dbUser.lookup(email, function (err, user) {
        if (err) {
            console.error("Error looking up user:", err);
            return res.status(500).send('Internal Server Error');
        }

        if (user) {
            return res.status(401).send("User already exists: " + email);
        }

        dbAdmin.lookup(email, function (err, admin) {
            if (err) {
                console.error("Error looking up admin:", err);
                return res.status(500).send('Internal Server Error');
            }

            if (admin) {
                return res.status(401).send("Admin already exists: " + email);
            }

            // If user and admin dont exist, create the new user
            userDao.create(email, fname, sname, password, confpassword);
            res.redirect('/login');


        });
    });
};

//function for handling login
exports.handle_login = function (req, res) {
    res.redirect("/about");
};

// function for displaying the login page
exports.show_login_page = function (req, res) {
    res.render("user/login");
};

//function for handling logining out
exports.logout = function (req, res) {
    res.clearCookie("jwt").status(200).redirect("/");
}


//function for displaying the logged in landing which is the view item page
exports.loggedIn_landing = function (req, res) {
    const myCookieValue = req.cookies['jwt'];

    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.log('Error verifying token:', err);
            res.render("about");
            return;
        } else {
            const userid1 = decoded.userid;
            console.log('Getting Username:', userid1);
            console.log('Getting dec:', decoded);

            var isPantry1;

            dbUser.userispantry(userid1)
                .then((ispantry) => {
                    // Once the promise resolves, set the value of isPantry
                    isPantry1 = ispantry;
                    console.log('isPantry value is set to:', isPantry1);

                    //Checking if the user is part of a pantry or not
                    if (isPantry1 === "true") {
                        console.log('user is part of a pantry');
                        db.getEntriesByPantryId("1234")
                            .then((list) => {
                                res.render("entries", {
                                    title: "Items",
                                    entries: list,
                                    user: "user",
                                    pantry: "pantry"
                                });
                                console.log("promise resolved");
                            })
                            .catch((err) => {
                                console.error("Error:", err);
                                res.redirect("/login");
                            });
                    } else {
                        console.log('user is not part of a pantry');
                        db.getEntriesByPantryId("1234")
                            .then((list) => {
                                res.render("entries", {
                                    title: "Provided Items",
                                    entries: list,
                                    user: "user"
                                });
                                console.log("promise resolved");
                            })
                            .catch((err) => {
                                console.error("Error:", err);
                                res.redirect("/login");
                            });
                    }
                })
                .catch((error) => {
                    // Handle any errors
                    console.error('Error:', error);
                    return res.status(401).send("401 Unauthorized access, attempt re-login to fix");
                    // res.redirect("/about");
                });
        }
    });
};
