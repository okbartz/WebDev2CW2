const foodpantryDAO = require('../models/foodpantryModel');
const pantryDAO = require('../models/pantryModel');
const userDao = require("../models/userModel.js");
const adminDao = require("../models/adminModel.js");
const contactDao = require("../models/contactModel.js");

const db = new foodpantryDAO();
const dbPantries = new pantryDAO();

const dbUser = new require("../models/userModel");
const dbAdmin = new require("../models/adminModel");
const dbContact = new contactDao();
const jwt = require("jsonwebtoken");

dbPantries.init();
db.init();

// dbAdmin.init();
dbContact.init();

// exports.entries_list = function (req, res) {
//     res.send('<h1>foodpantry Messages</h1><p>Not yet implemented: will show a list of food pantry entries.</p> ');
// }


// exports.entries_list = function (req, res) {
//     res.send('<h1>foodpantry Messages</h1><p>Not yet implemented: will show a list of food pantry entries.</p> ');
// }



// exports.landing_page = function (req, res) {
//     db.getAllEntries()
//         .then((list) => {
//             res.render('entries', {
//                 'title': 'food pantry',
//                 'entries': list
//             });
//             console.log('promise resolved');
//         })
//         .catch((err) => {
//             console.log('promise rejected', err);
//         })
// }




//ADMIN FUNCTIONS

//function for showing the admin page
exports.show_admin_page = function (req, res) {
    res.render("admin/adminpanel", {
        admin: "admin",
        user: "user",
    })



}

//function for showing the admin page for editing users
exports.show_admin_users = function (req, res) {
    dbUser.getAllEntries()
        .then((list) => {

            dbPantries.getAllEntries()
                .then((list2) => {
                    res.render("admin/adminpanelUser", {
                        admin: "admin",
                        user: "user",
                        entries: list,
                        selectedPantries: list2
                    });
                }).catch((err) => {
                    // console.log("promise rejected", err);
                    res.redirect("/login")
                });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });


}

//function for showing the admin page for editing pantrys
exports.show_admin_pantry = function (req, res) {
    dbPantries.getAllEntries()
        .then((list) => {
            res.render("admin/adminpanelPantry", {
                admin: "admin",
                user: "user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });


}

//function for showing the admin page for viewing messages
exports.show_messages = function (req, res) {
    dbContact.getAllMessages()
        .then((list) => {
            res.render("admin/adminpanelMessages", {
                admin: "admin",
                user: "user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });


}

//function for showing the admin page for editing admins
exports.show_admin_admins = function (req, res) {
    adminDao.getAllEntries()
        .then((list) => {
            res.render("admin/adminpanelAdmin", {
                admin: "admin",
                user: "user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });


}

//function for showing the admin page for viewing posts
exports.show_admin_posts = function (req, res) {
    db.getAllEntries()
        .then((list) => {
            res.render("admin/adminpanelPosts", {
                admin: "admin",
                user: "user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });


}

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


                res.render("about", {
                    user: "user"
                });
            };
        }
    });

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
                                    title: "Select Items",
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

//function for handling login
exports.handle_login = function (req, res) {
    res.redirect("/about");
};

//function for handling logining out
exports.logout = function (req, res) {
    res.clearCookie("jwt").status(200).redirect("/");
}

//Function for displaying the register page
exports.show_register_page = function (req, res) {
    res.render("user/register");
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
        response.status(400).send("Entries must have an food title.");
        return;
    }

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
            const userid = decoded.userid;
            const username = decoded.username;
            console.log('Getting Username:', username);
            console.log('Getting dec:', userid);

            var pantryTitle = "";

            console.log("grabbing specific pantry ")


            dbPantries.getEntriesById(req.body.pantryID)
                .then((list) => {


                    list.forEach(function (entry) {
                        pantryTitle = entry.pantryTitle;
                        console.log('Checking Entry: ' + pantryTitle);


                    });

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


    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.log('Error verifying token:', err);
            res.render("contact", {

                'title': 'Contact'
            });
            return;
        } else {

            try {
                const admin1 = decoded.admin.admin;

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

//function for displaying the add admin page
exports.show_addAdmin = function (req, res) {
    res.render("admin/addNewAdmin");
}

//function for adding a new admin
exports.post_addAdmin = function (req, res) {
    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const confpassword = req.body.confpassword;

    if (!email || !password) {
        return res.status(401).send('No email or no password');
    }

    if (password !== confpassword) {
        return res.status(401).send('Passwords do not match');
    }

    if (email > 200) {
        return res.status(401).send('Email is too long max lenght 200');
    }

    if (fname > 100) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (sname > 100) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (password < 8 && password > 100) {
        return res.status(401).send('password too long or short');
    }

    if (confpassword < 8 && confpassword > 100) {
        return res.status(401).send('password too long or short');
    }

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
            adminDao.create(email, fname, sname, password, confpassword);
            res.redirect('/adminpanelAdmin');


        });
    });
};

//function for displaying the add pantry page
exports.show_addPantry = function (req, res) {
    res.render("admin/addNewPantry");
}

//function for adding a new pantry
exports.post_addPantry = function (req, res) {
    const pantryTitle = req.body.pantryTitle;
    const pantryDescription = req.body.pantryDescription;
    const pantryAddress = req.body.pantryAddress;

    if (!pantryTitle || !pantryDescription) {
        return res.status(401).send('No email or no password');
    }

    dbPantries.addEntry(pantryTitle, pantryDescription, pantryAddress)

    res.redirect('/adminpanelPantry');

};

// function for updating a specific user
exports.update_user = function (req, res) {
    console.log('processing update user');
    if (!req.body.UserId) {
        res.status(400).send("Message must have an UserId.");
        return;
    }

    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const UserId = req.body.UserId;
    const ispantry = req.body.ispantry;
    const PantryID = req.body.pantryID;

    if (!email || !password) {
        return res.status(401).send('No email or no password');
    }

    if (email > 200) {
        return res.status(401).send('Email is too long max lenght 200');
    }

    if (fname > 100) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (sname > 100) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (password < 8 && password > 100) {
        return res.status(401).send('password too long or short');
    }



    try{
    console.log('adding message!');
    dbUser.update(UserId, email, fname, sname, password, ispantry, PantryID)
    console.log('redirecting!');
    res.redirect("/adminpanelUser");
    }
    catch (err) {
        console.error('Error Updating user:', err);
    }

}

// function for updating a specific pantry
exports.update_pantry = function (req, res) {
    console.log('processing update pantry');
    if (!req.body.PantryID) {
        res.status(400).send("Message must have an PantryID.");
        return;
    }

    const PantryID = req.body.PantryID;
    const pantryTitle = req.body.pantryTitle;
    const pantryDescription = req.body.pantryDescription;
    const pantryAddress = req.body.pantryAddress;



    try{
    console.log('adding message!');
    dbPantries.update(pantryTitle, pantryDescription, pantryAddress, PantryID)
    console.log('redirecting!');
    res.redirect("/adminpanelPantry");
    }
    catch (err) {
        console.error('Error updating pantry:', err);
    }

}

// function for updating a specific admin
exports.update_admin = function (req, res) {
    console.log('processing post_new_message controller');
    if (!req.body.UserId) {
        res.status(400).send("Message must have an email address.");
        return;
    }

    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const UserId = req.body.UserId;

    if (!email || !password) {
        return res.status(401).send('No email or no password');
    }

    if (email > 200) {
        return res.status(401).send('Email is too long max lenght 200');
    }

    if (fname > 100) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (sname > 100) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (password < 8 && password > 100) {
        return res.status(401).send('password too long or short');
    }


    try{
    console.log('adding message!');
    dbAdmin.update(UserId, email, fname, sname, password)
    console.log('redirecting!');
    res.redirect("/adminpanelAdmin");
    }
    catch (err) {
        console.error('Error updating admin:', err);
    }
        
}

// function for deleting a specific user
exports.post_delete_user = function (req, res) {

    try {
        console.log('deleting user', req.params.userid);
        let user = req.params.userid;
        console.log("userid", user);
        userDao.delete(user);
        res.redirect('/adminpanelUser');
    }
    catch (err) {
        console.error('Error Deleting User:', err);
    }
}

// function for deleting a specific admin
exports.post_delete_admin = function (req, res) {
    try {
        console.log('deleting admin', req.params.userid);
        let user = req.params.userid;
        console.log("userid", user);
        dbAdmin.delete(user);
        res.redirect('/adminpanelAdmin');
    }
    catch (err) {
        console.error('Error Deleting admin:', err);
    }
}

// function for deleting a specific post
exports.post_delete_posts = function (req, res) {
    try {
        console.log('deleting post', req.params.postid);
        let user = req.params.postid;
        console.log("postid", user);
        db.delete(user);
        res.redirect('/admin');
    }
    catch (err) {
        console.error('Error Deleting post:', err);
    }
}

// function for deleting a specific message
exports.post_delete_message = function (req, res) {
    try {
        console.log('deleting message', req.params._id);
        let messageid = req.params._id;
        console.log("postid", messageid);
        dbContact.delete(messageid);
        res.redirect('/admin');
    }
    catch (err) {
        console.error('Error Deleting Message:', err);
    }
}

// function for deleting a specific pantry
exports.post_delete_pantry = function (req, res) {
    try {
        console.log('deleting pantry', req.params._id);
        let pantryid = req.params._id;
        console.log("pantryid", pantryid);
        dbPantries.delete(pantryid);
        res.redirect('/admin');
    }
    catch (err) {
        console.error('Error Deleting pantry:', err);
    }
}

// function for displaying the login page
exports.show_login_page = function (req, res) {
    res.render("user/login");
};

// function for registering a new user
exports.post_new_user = function (req, res) {
    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const confpassword = req.body.confpassword;

    if (!email || !password) {
        return res.status(401).send('No email or no password');
    }

    if (password !== confpassword) {
        return res.status(401).send('Passwords do not match');
    }

    if (email > 200) {
        return res.status(401).send('Email is too long max lenght 200');
    }

    if (fname > 100) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (sname > 100) {
        return res.status(401).send('forename is too long max lenght 100');
    }

    if (password < 8 && password > 100) {
        return res.status(401).send('password too long or short');
    }

    if (confpassword < 8 && confpassword > 100) {
        return res.status(401).send('password too long or short');
    }

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