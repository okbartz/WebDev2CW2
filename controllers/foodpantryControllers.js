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


//function for displaying the about page
exports.show_about_page = function (req, res) {

    const myCookieValue = req.cookies['jwt'];

    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.log('Error verifying token:', err);
            res.render("about");
            return;
        } else {
            try {
                const admin1 = decoded.admin.admin;
                //Check if the user is a admin
                if (admin1 === "true") {
                    res.render("about", {
                        user: "user",
                        admin: "admin"
                    });

                }
            } catch (error) {
                
                console.error(error);
                const username = decoded.username;
                console.log('Getting Username:', username);
                console.log('Getting dec:', decoded);

                //if not an admin then a normal user
                res.render("about", {
                    user: "user"
                });
            };
        }
    });

}


//function for loading entries page, loads all the pantries into a selection dropdown
exports.new_entries = function (req, res) {


    dbPantries.getAllEntries().then(
        (entries) => {
            res.render('newEntry', {
                'title': 'Food',
                'user': 'user',
                'selectedPantries': entries

            });

            console.log(entries);

        }).catch((err) => {
            console.log('error handling author posts', err);
        });


}

// //function for posting new entries, loads all the pantries into a selection dropdown
// exports.new_entry = function (req, res) {
//     res.send('<h1>Not yet implemented: show a new entry page.</h1>');
// }

//function for posting new entries
exports.post_new_entry = function (req, res) {
    console.log('processing post-new_entry controller');
    if (!req.body.foodtitle) {
        return res.status(401).send("Entries must have an food title.");
        return;
    }

    if (req.body.foodtitle.length < 5){
        return res.status(401).send("Entries must have an food title atleast 5 characters.");
        return;
    }
    if (req.body.foodexp.length < 5){
        return res.status(401).send("Entries must have an food title atleast 5 characters.");
        return;
    }
    if (req.body.fooddesc.length < 5 || req.body.fooddesc.length > 300){
        return res.status(401).send("Entries must have an food title atleast 5 characters. and be less than 300");
        return;
    }

    const myCookieValue = req.cookies['jwt'];

    // Checking if there is a cookie meaning there is a user logged in.
    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.error('Error verifying token:', err);
            res.status(500).send("Error verifying token");
            return;
        } else {
            if (!decoded.userid) {
                res.status(500).send("Error not a user");
                return;
            }
            //Setting variables
            const userid = decoded.userid;
            const username = decoded.username;
            console.log('Getting Username:', username);
            console.log('Getting dec:', userid);

            //Initializing pantry title variable
            var pantryTitle = "";

            console.log("grabbing specific pantry ")


            dbPantries.getEntriesById(req.body.pantryID)
                .then((list) => {

                    //Setting pantry title variable
                    list.forEach(function (entry) {
                        pantryTitle = entry.pantryTitle;
                        console.log('Checking Entry: ' + pantryTitle);


                    });

                    //adding the post entry to the database
                    db.addEntry(req.body.foodtitle, req.body.foodimg, req.body.foodexp, req.body.fooddesc, username, userid, req.body.pantryID, pantryTitle);
                    res.redirect("/loggedIn");
                })
                .catch((err) => {
                    console.log('promise rejected', err);
                })


        }
    });
}

//function for loading the contact page
exports.new_message = function (req, res) {
    const myCookieValue = req.cookies['jwt'];

    //Checking which type of user the user is.
    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            //normal user with no cookie
            console.log('Error verifying token:', err);
            res.render("contact", {

                'title': 'Contact'
            });
            return;
        } else {

            try {
                const admin1 = decoded.admin.admin;
                //admin user
                if (admin1 === "true") {
                    res.render("contact", {
                        'title': 'Contact',
                        user: "user",
                        admin: "admin"
                    });

                }
            } catch (error) {


                const username = decoded.username;
                console.log('Getting Username:', username);
                console.log('Getting dec:', decoded);

                //normal user
                res.render("contact", {
                    'title': 'Contact',
                    user: "user"
                });
            }

        }
    });
}

//function for posting a new message from the contact page
exports.post_new_message = function (req, res) {
    console.log('processing post_new_message controller');
    if (!req.body.emailaddress) {
        res.status(400).send("Message must have an email address.");
        return;
    }

    console.log('adding message!');
    dbContact.addMessage(req.body.emailaddress, req.body.subject, req.body.message);
    console.log('redirecting!');
    res.redirect("/about");

}

//function for displaying the entries of a specific user
exports.show_user_entries = function (req, res) {
    console.log('filtering user name', req.params.userid);
    let user = req.params.userid;
    db.getEntriesByUser(user).then(
        (entries) => {
            res.render('entries', {
                'title': 'Users items',
                'user': 'user',
                'entries': entries

            });
        }).catch((err) => {
            console.log('error handling users entries', err);
        });
}


//PANTRY

//function for changing the items to be part of a pantry
exports.update_itempantry = function (req, res) {

    let itemid = req.params.itemID;

    const myCookieValue = req.cookies['jwt'];

    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.error('Error verifying token:', err);
            res.status(500).send("Error verifying token");
            return;
        } else {

            if (!decoded.userid) {
                res.status(500).send("Error not a user");
                return;
            }

            const itemID = itemid;

            dbUser.LookUpPantryID(decoded.userid).then((pantid) => {

                var pantryTitle = "";

                dbPantries.getEntriesById(pantid)
                    .then((entries) => {

                        console.log("ENTRIES PANTRIES:", entries)

                        entries.forEach(function (entry) {
                            pantryTitle = entry.pantryTitle;
                            console.log('Checking Pantry Entry: ' + pantryTitle);


                        });

                        console.log('changing pantry!');
                        db.updatePantry(itemID, pantid, pantryTitle)
                        console.log('redirecting!');
                        res.redirect("/loggedin");
                        
                    })
                    .catch((err) => {
                        console.log('promise rejected', err);
                    })






            })


        }
    });
}
//function for viewing the pantry of the current user
exports.view_own_pantry = function (req, res) {



    const myCookieValue = req.cookies['jwt'];

    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.error('Error verifying token:', err);
            res.status(500).send("Error verifying token");
            return;
        } else {

            if (!decoded.userid) {
                res.status(500).send("Error not a user");
                return;
            }


            const UserID = decoded.userid;


            dbUser.LookUpPantryID(UserID).then((pantid) => {
                console.log("pantry id", pantid);
                db.getEntriesByPantryId(pantid)
                    .then((entries) => {
                        res.render('entries', {
                            'title': 'Pantry items',
                            'user': 'user',
                            'entries': entries
                        });
                    })
                    .catch((err) => {
                        console.log('error handling author posts', err);
                        res.status(500).send("Error: unable to retrieve entries by pantry ID");
                    });
            }).catch((err) => {
                console.log('error handling pantry ID lookup', err);
                res.status(500).send("Error: unable to look up pantry ID");
            });
        }
    });
}