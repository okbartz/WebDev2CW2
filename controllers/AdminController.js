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
const e = require('express');



//DELETE FUNCTIONS

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
        let postid = req.params.postid;
        console.log("postid", postid);
        db.delete(postid);
        res.redirect('/adminpanelPosts');
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
        res.redirect('/adminpanelMessages');
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
        res.redirect('/adminpanelPantry');
    }
    catch (err) {
        console.error('Error Deleting pantry:', err);
    }
}


//EDIT FUNCTIONS

// function for updating a specific user
exports.update_user = function (req, res) {
    console.log('processing update user');
    if (!req.body.UserId) {
        res.status(400).send("Field must have an UserId.");
        return;
    }

    //Getting Variables
    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const UserId = req.body.UserId;
    const ispantry = req.body.ispantry;
    const PantryID = req.body.pantryID;

    //Validating Variables
    if (!email ) {
        return res.status(401).send('No email');
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


    //Updating user
    try{
    console.log('updating user!');
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
        res.status(400).send("Field must have an PantryID.");
        return;
    }

    //getting variables
    const PantryID = req.body.PantryID;
    const pantryTitle = req.body.pantryTitle;
    const pantryDescription = req.body.pantryDescription;
    const pantryAddress = req.body.pantryAddress;

    //validating variables
    if (pantryTitle > 100) {
        return res.status(401).send('Pantry Title is too long');
    }

    if (pantryDescription > 100) {
        return res.status(401).send('Pantry Title is too long');
    }

    if (pantryAddress > 200) {
        return res.status(401).send('Pantry Address is too long');
    }
    

    //Updating pantry
    try{
    console.log('updating pantry!');
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
        res.status(400).send("Admin must have an user id.");
        return;
    }

    //Getting Variables
    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const UserId = req.body.UserId;

    //Validating Variables
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


    //Updating admin
    try{
    console.log('updating admin!');
    dbAdmin.update(UserId, email, fname, sname, password)
    console.log('redirecting!');
    res.redirect("/adminpanelAdmin");
    }
    catch (err) {
        console.error('Error updating admin:', err);
    }
        
}

// function for updating a specific post
exports.update_post = function (req, res) {
    console.log('processing post_new_message controller');
    if (!req.body.postid) {
        res.status(400).send("Post must have an id.");
        return;
    }

    //Getting Variables
    const foodtitle = req.body.foodtitle;
    const foodimg = req.body.foodimg;
    const foodexp = req.body.foodexp;
    const fooddesc = req.body.fooddesc;
    const postid = req.body.postid;
    const pantryID1 = req.body.pantryID;

    //Validating Variables
    if (!foodtitle || !foodexp || !fooddesc) {
        return res.status(401).send('No foodtitle or no foodtitle or fooddesc');
    }

    if(fooddesc > 300){
        return res.status(401).send('Food descrition too long');

    }

    
    try{
    

    var pantryTitle = "";

    dbPantries.getEntriesById(req.body.pantryID)
    .then((list) => {

        //Setting pantry title variable
        list.forEach(function (entry) {
            pantryTitle = entry.pantryTitle;
            console.log('Checking Entry: ' + pantryTitle);


        });

        //updating the post entry
        console.log('updating post!');
        db.update(postid, foodtitle, foodimg, foodexp, fooddesc,pantryID1, pantryTitle)
        console.log('redirecting!');
        res.redirect("/adminpanelPosts");
    })



    }
    catch (err) {
        console.error('Error updating post:', err);
    }
        
}

//function for grabbing details of user and inserting into fields
exports.get_user_details = function (req, res) {
    console.log('Copying Details', req.params.userid);
    let userID = req.params.userid;
   //looking for the selected user
    userDao.lookupUser(userID)
        .then((SpecificUserList) => {
            //Getting all the user entries
            dbUser.getAllEntries()
            .then((UserList) => {
    
                //getting all the pantry entries
                dbPantries.getAllEntries()
                    .then((PantryList) => {

                        //Initializing variables
                        var emailvalue1
                        var userid1 
                        var fname1 
                        var sname1 
                        var ispant1 
                        var pantid1 
                           
                        //Setting Variables
                        SpecificUserList.forEach(function(entry) {
                            console.log("Getting email:", entry.email);
                            console.log("Getting first name:", entry.fname);
                            console.log("Getting second name:", entry.fname);
                            
                            console.log("Getting ispantry name:", entry.ispantry);
                            console.log("Getting pantryid name:", entry.pantryid);
            
                            emailvalue1 = entry.email
                            userid1 = entry._id
                            fname1 = entry.fname
                            sname1 = entry.sname
                            ispant1 = entry.ispantry
                            pantid1 = entry.pantryid
                            console.log("email value: ", emailvalue1)
            
                        });

                        //Displaying the page and setting all the input fields
                        res.render("admin/adminpanelUser", {
                            admin: "admin",
                            user: "user",
                            entries: UserList,
                            selectedPantries: PantryList,
                            
                            emailvalue: emailvalue1,
                            idvalue: userid1,
                            fnamevalue: fname1,
                            snamevalue: sname1,
                            ispantvalue: ispant1,
                            pantidvalue: pantid1
                            
                        });
                    }).catch((err) => {
                        // console.log("promise rejected", err);
                        res.redirect("/adminpanelUser")
                    });
                console.log("promise resolved");
            })
            .catch((err) => {
                // console.log("promise rejected", err);
                res.redirect("/login")
            });

                
    

        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/adminpanel")
        });



}

//function for grabbing details of admin and inserting into fields
exports.get_admin_details = function (req, res) {
    console.log('Copying Details', req.params.userid);
    let userID = req.params.userid;
    //looking for the selected admin
    adminDao.lookupUser(userID)
        .then((SpecificUserList) => {
            //Getting all the admin entries
            dbAdmin.getAllEntries()
            .then((UserList) => {

                        //Initializing variables
                        var emailvalue1
                        var userid1 
                        var fname1 
                        var sname1 
                        
                        
                        //Setting Variables
                        SpecificUserList.forEach(function(entry) {
                            console.log("Getting email:", entry.email);
                            console.log("Getting first name:", entry.fname);
                            console.log("Getting second name:", entry.fname);
                            
                            console.log("Getting ispantry name:", entry.ispantry);
                            console.log("Getting pantryid name:", entry.pantryid);
            
                            emailvalue1 = entry.email
                            userid1 = entry._id
                            fname1 = entry.fname
                            sname1 = entry.sname
                            
                           
                            console.log("email value: ", emailvalue1)
            
                        });

                        //Displaying the page and setting all the input fields
                        res.render("admin/adminpanelAdmin", {
                            admin: "admin",
                            user: "user",
                            entries: UserList,
                            
                            emailvalue: emailvalue1,
                            idvalue: userid1,
                            fnamevalue: fname1,
                            snamevalue: sname1,
                            
                            
                            
                        });
                    
                console.log("promise resolved");
            })
            .catch((err) => {
                // console.log("promise rejected", err);
                res.redirect("/adminpanelAdmin")
            });

                
    

        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/adminpanel")
        });



}

//function for grabbing details of pantry and inserting into fields
exports.get_pantry_details = function (req, res) {
    console.log('Copying Details', req.params.pantryid);
    let Pantryid = req.params.pantryid;
    //looking for the selected pantry
    pantryDAO.getEntriesById(Pantryid)
        .then((SpecificPantryList) => {
            //Getting all the pantry entries
            dbPantries.getAllEntries()
            .then((pantryList) => {

                       //Initializing variables
                        var pantId1
                        var pantTitle1
                        var pantDesc1 
                        var pantAddress1 
                        
                        
                        //Setting Variables
                        SpecificPantryList.forEach(function(entry) {
                           
                            
                            pantId1 = entry._id
                            pantTitle1 = entry.pantryTitle
                            pantDesc1 = entry.pantryDescription
                            pantAddress1 = entry.pantryAddress
                            
                           
            
                        });

                        //Displaying the page and setting all the input fields
                        res.render("admin/adminpanelPantry", {
                            admin: "admin",
                            user: "user",
                            entries: pantryList,
                            
                            pantIDvalue: pantId1,
                            pantTitleValue: pantTitle1,
                            pantDescValue: pantDesc1,
                            pantAddressValue: pantAddress1,
                            
                            
                            
                        });
                    
                console.log("promise resolved");
            })
            .catch((err) => {
                // console.log("promise rejected", err);
                res.redirect("/adminpanelPantry")
            });

                
    

        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/adminpanel")
        });


}

//function for grabbing details of posts and inserting into fields
exports.get_post_details = function (req, res) {
    console.log('Copying Details', req.params.postid);
    let Postid = req.params.postid;
    //looking for the selected pantry
    db.getEntriesById(Postid)
        .then((SpecificPostList) => {
            //Getting all the pantry entries
            db.getAllEntries()
            .then((postlist) => {

                pantryDAO.getAllEntries().then(
                    (selectPantries) => {
                        
            
                    

                       //Getting Variables
                        var foodtitle1 
                        var foodimg1 
                        var foodexp1 
                        var fooddesc1 
                        var postid1
                        var pantryID1 
                        
                        
                        //Setting Variables
                        SpecificPostList.forEach(function(entry) {
                           
                            
                            pantryID1 = entry.currentPantryid
                            foodtitle1 = entry.foodtitle
                            foodimg1 = entry.foodimg
                            foodexp1 = entry.foodexp
                            fooddesc1 = entry.fooddesc
                            postid1 = entry._id
                            
                            
                           
            
                        });

                        //Displaying the page and setting all the input fields
                        res.render("admin/adminpanelPosts", {
                            admin: "admin",
                            user: "user",
                            entries: postlist,
                            selectedPantries: selectPantries,
                            
                            pantryIDValue: pantryID1,
                            postTitleValue: foodtitle1,
                            postIMGValue: foodimg1,
                            postExpValue: foodexp1,
                            postDescValue: fooddesc1,
                            postPostIdValue: postid1,
                           
                            
                            
                        });
                    
                console.log("promise resolved");

                }).catch((err) => {
                console.log('error handling posts', err);
             });
                    
            })
            .catch((err) => {
                // console.log("promise rejected", err);
                res.redirect("/adminpanelPosts")
            });

                
    

        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/adminpanel")
        });


}

//ADD FUNCTIONS

//function for displaying the add admin page
exports.show_addAdmin = function (req, res) {
    res.render("admin/addNewAdmin", {
        'user': 'user',
        'admin': 'admin',
        

    });
}

//function for adding a new admin
exports.post_addAdmin = function (req, res) {
    //Getting all the variables
    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const confpassword = req.body.confpassword;

    //Validating all the variables
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

    //Checking if a user or admin already exists
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
    res.render("admin/addNewPantry", {
        'user': 'user',
        'admin': 'admin',
        

    });
}

//function for adding a new pantry
exports.post_addPantry = function (req, res) {
    const pantryTitle = req.body.pantryTitle;
    const pantryDescription = req.body.pantryDescription;
    const pantryAddress = req.body.pantryAddress;

    if (!pantryTitle || !pantryDescription) {
        return res.status(401).send('No email or no password');
    }

        //validating variables
        if (pantryTitle > 100) {
            return res.status(401).send('Pantry Title is too long');
        }
    
        if (pantryDescription > 100) {
            return res.status(401).send('Pantry Title is too long');
        }
    
        if (pantryAddress > 200) {
            return res.status(401).send('Pantry Address is too long');
        }


    dbPantries.addEntry(pantryTitle, pantryDescription, pantryAddress)

    res.redirect('/adminpanelPantry');

};

//function for displaying the add admin page
exports.show_addUser = function (req, res) {
    res.render("admin/addNewUser", {
        'user': 'user',
        'admin': 'admin',
        

    });
}

//function for adding a new admin
exports.post_addUser = function (req, res) {
    //Getting all the variables
    const email = req.body.emailaddress;
    const fname = req.body.forename;
    const sname = req.body.surname;
    const password = req.body.pass;
    const confpassword = req.body.confpassword;

    //Validating all the variables
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

    //Checking if a user or admin already exists
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
            res.redirect('/adminpanelUser');


        });
    });
};

//function for displaying the add post page
exports.show_addPost = function (req, res) {
    dbPantries.getAllEntries().then(
        (entries) => {
            res.render('admin/addNewPost', {
                'user': 'user',
                'admin': 'admin',
                'selectedPantries': entries

            });

            console.log(entries);

        }).catch((err) => {
            console.log('error handling posts', err);
        });
}

exports.post_addPost = function (req, res) {
    console.log('processing post-new_entry controller');
    if (!req.body.foodtitle) {
        response.status(400).send("Entries must have an food title.");
        return;
    }

    //Getting the jwt cookie
    const myCookieValue = req.cookies['jwt'];

    //Checking if the cookie exists
    jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.error('Error verifying token:', err);
            res.status(500).send("Error verifying token");
            return;
        } else {
            if (!decoded.adminid) {
                res.status(500).send("Error not a admin");
                return;
            }

            //getting admin information
            const adminid = decoded.adminid;
            const username = decoded.username;
            console.log('Getting Username:', username);
            console.log('Getting dec:', adminid);

            //initalizing variable
            var pantryTitle = "";

            console.log("grabbing specific pantry ")


            dbPantries.getEntriesById(req.body.pantryID)
                .then((list) => {

                    //setting pantry title
                    list.forEach(function (entry) {
                        pantryTitle = entry.pantryTitle;
                        console.log('Checking Entry: ' + pantryTitle);


                    });

                    //adding the new post entry
                    db.addEntry(req.body.foodtitle, req.body.foodimg, req.body.foodexp, req.body.fooddesc, username, adminid, req.body.pantryID, pantryTitle);
                    res.redirect("/adminpanelPosts");
                })
                .catch((err) => {
                    console.log('promise rejected', err);
                })


        }
    });
}





//ADMIN PAGES

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
    
    //Getting all the pantry's
    dbPantries.getAllEntries()
        .then((pantrylist) => {
            
            //getting all the entries
            db.getAllEntries()
                    .then((list) => {
                        res.render("admin/adminpanelPosts", {
                            admin: "admin",
                            user: "user",
                            entries: list,
                            selectedPantries: pantrylist

                        });
                        console.log("promise resolved");
                    })
                    .catch((err) => {
                        // console.log("promise rejected", err);
                        res.redirect("/login")
                    });


        })
        .catch((err) => {
            // console.log("promise rejected", err);
            res.redirect("/login")
        });
    
    
    


}