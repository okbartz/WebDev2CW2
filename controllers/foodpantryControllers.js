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


exports.entries_list = function (req, res) {
    res.send('<h1>foodpantry Messages</h1><p>Not yet implemented: will show a list of food pantry entries.</p> ');
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

exports.show_admin_page = function (req, res) {
            res.render("adminpanel", {
                admin: "admin",
                user:"user",
            })
       
        

}

exports.show_admin_users = function (req, res) {
    dbUser.getAllEntries()
        .then((list) => {
            res.render("adminpanelUser", {
                admin: "admin",
                user:"user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });
        

}

exports.show_admin_pantry = function (req, res) {
    dbPantries.getAllEntries()
        .then((list) => {
            res.render("adminpanelPantry", {
                admin: "admin",
                user:"user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });
        

}

exports.show_messages = function (req, res) {
    dbContact.getAllMessages()
        .then((list) => {
            res.render("adminpanelMessages", {
                admin: "admin",
                user:"user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });
        

}

exports.show_admin_admins = function (req, res) {
    adminDao.getAllEntries()
        .then((list) => {
            res.render("adminpanelAdmin", {
                admin: "admin",
                user:"user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });
        

}

exports.show_admin_posts = function (req, res) {
    db.getAllEntries()
        .then((list) => {
            res.render("adminpanelPosts", {
                admin: "admin",
                user:"user",
                entries: list
            });
            console.log("promise resolved");
        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });
        

}


exports.show_about_page = function (req, res) {
    
    const myCookieValue = req.cookies['jwt'];


    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.log('Error verifying token:', err);
            res.render("about");
            return;
        } else {
            
            try {
                const admin1 = decoded.admin.admin;

                if(admin1 === "true"){
                res.render("about", {
                    user:"user",
                    admin:"admin"
                });

                } 
              } catch (error) {
                console.error(error);
                const username = decoded.username;
                console.log('Getting Username:', username);
                console.log('Getting dec:', decoded);

            
                res.render("about", {
                user:"user"
                });
              };


            

            
            
        }
    });
    
    
    
    
    
}

exports.loggedIn_landing = function (req, res) {
    const myCookieValue = req.cookies['jwt'];

    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
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

                    // Check the value of isPantry1 and render the appropriate view
                    if (isPantry1 === true) {
                        console.log('ITS true');
                        db.getAllEntries()
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
                    } else  {
                        console.log('ITS FALse');
                        db.getAllEntries()
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
                    // Handle any errors from userispantry
                    console.error('Error:', error);
                    res.redirect("/about");
                });
        }
    });
};

exports.handle_login = function (req, res) {
    res.redirect("/about");
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
            if(!decoded.userid){
                res.status(500).send("Error not a user");
            return;
            }
            const userid = decoded.userid;
            const username = decoded.username;
            console.log('Getting Username:', username);
            console.log('Getting dec:', userid);

            // Perform database operation after getting email
            db.addEntry(req.body.foodtitle, req.body.foodimg, req.body.foodexp, req.body.fooddesc, username,userid);
            res.redirect("/loggedIn");
        }
    });
}

exports.new_message = function (req, res) {
    const myCookieValue = req.cookies['jwt'];


    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.log('Error verifying token:', err);
            res.render("contact",{

                'title': 'Contact'
            });
            return;
        } else {

            try {
                const admin1 = decoded.admin.admin;

                if(admin1 === "true"){
                res.render("contact", {
                    'title': 'Contact',
                    user:"user",
                    admin:"admin"
                });

                } 
              } catch (error) {


            const username = decoded.username;
            console.log('Getting Username:', username);
            console.log('Getting dec:', decoded);

            
            res.render("contact", {
                'title': 'Contact',
                user:"user"
            });
            }
        
        }
    });
}

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

exports.update_user = function (req, res) {
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
    const ispantry = req.body.ispantry;
    const PantryID = req.body.pantryID;
    


    console.log('adding message!');
    dbUser.update(UserId,email,fname,sname,password,ispantry,PantryID)
    console.log('redirecting!');
    res.redirect("/adminPanelUser");

}


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
    


    console.log('adding message!');
    dbAdmin.update(UserId,email,fname,sname,password)
    console.log('redirecting!');
    res.redirect("/adminPanelAdmin");

}

exports.post_delete_user = function (req, res) {
    console.log('deleting user', req.params.userid);
    let user = req.params.userid;
    console.log("userid", user);
    userDao.delete(user);
    res.redirect('/adminPanelUser');

}

exports.post_delete_admin = function (req, res) {
    console.log('deleting admin', req.params.userid);
    let user = req.params.userid;
    console.log("userid", user);
    dbAdmin.delete(user);
    res.redirect('/adminPanelAdmin');

}

exports.post_delete_posts = function (req, res) {
    console.log('deleting post', req.params.postid);
    let user = req.params.postid;
    console.log("postid", user);
    db.delete(user);
    res.redirect('/admin');

}

exports.post_delete_message = function (req, res) {
    console.log('deleting message', req.params._id);
    let messageid = req.params._id;
    console.log("postid", messageid);
    dbContact.delete(messageid);
    res.redirect('/admin');

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
        return res.status(401).send('No email or no password');
    }

    if (password !== confpassword) {
        return res.status(401).send('Passwords do not match');
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

            // If user and admin don't exist, create the new user
            userDao.create(email, fname, sname, password, confpassword);
            res.redirect('/login');


        });
    });
};

exports.show_user_entries = function (req, res) {
    console.log('filtering author name', req.params.userid);
    let user = req.params.userid;
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


//PANTRY

exports.update_itempantry = function (req, res) {

    let itemid = req.params.itemID;

    const myCookieValue = req.cookies['jwt'];

    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.error('Error verifying token:', err);
            res.status(500).send("Error verifying token");
            return;
        } else {

            if(!decoded.userid){
                res.status(500).send("Error not a user");
            return;
            }

            const itemID = itemid;
            const pantryID = decoded.userid;
            const currentPantryName = decoded.username; 


            console.log('changing pantry!');
            db.updatePantry(itemID,pantryID,currentPantryName)
            console.log('redirecting!');
            res.redirect("/loggedin");

        }
    });
}