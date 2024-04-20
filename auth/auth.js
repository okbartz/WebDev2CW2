const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {

    let emailaddress = req.body.emailaddress;
    let password = req.body.password;

    userModel.lookup(emailaddress, function (err, user) {
        if (err) {
            console.log("error looking up user", err); 
            return res.status(401).send();
        } if (user) {
            authenticateUser(user)
        } else {
            // Lookup function to search for admin users
            adminModel.lookup(emailaddress, function (err, admin) {
                if (err) {
                    console.log("error looking up admin", err);
                    return res.status(401).send();
                } 
                if (admin) {
                    // If admin user is found
                    authenticateAdmin(admin);
                } else {
                    // if neither report error
                    console.log("email ", emailaddress, 
                    " not found");
                    return res.redirect("/register");
                }
            });
        }
    });
    
    function authenticateUser(user) {
        //compare provided password with stored password
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let payload = { emailaddress: user.emailaddress, username: user.fname, userid: user._id}; 
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                res.cookie("jwt", accessToken);
                //and then pass onto the next middleware
                next();
    
            } else {
                return res.render("user/login")
            }
        });
    }     

    function authenticateAdmin(admin) {
        //compare provided password with stored password
        bcrypt.compare(password, admin.password, function (err, result) {
            if (result) {
                let payload = { emailaddress: admin.emailaddress, username: admin.fname, admin:admin, adminid: admin._id}; 
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                res.cookie("jwt", accessToken);
                //and then pass onto the next middleware
                next();
    
            } else {
                return res.render("user/login")
            }
        });
    }  

}
        


exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt; if
    (!accessToken) { 
        // res.status(403).send();
        res.redirect("/login")


    } let
    payload; try
    {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next(); } catch (e) {
    //if an error occurred return request unauthorized error
    res.status(401).send();
    res.redirect("/login");
    }
    };


        exports.verifyAdmin = function (req, res, next) {
            
            const myCookieValue = req.cookies.jwt;
        
        
            jwt.verify(myCookieValue, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
                if (err) {
                    console.log('Error verifying token:', err);
                    res.redirect("/login")
                    return;
                } else {

                try {
                    if(decoded.admin.admin === "true"){
                    next(); }
                    else{
                        console.log("check if ", decoded.admin.admin)
                        res.redirect("/login");

                    }
                }catch (e) {
                    //if an error occurred return request unauthorized error
                    res.status(401).send();
                    console.log("check if ", decoded.admin.admin)
                    res.redirect("/login");
                    }

                } 
            });
        
        
    };
    

