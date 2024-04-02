const bcrypt = require('bcrypt');
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
        } if (!user) {
            console.log("email ",
            user, " not found");
            return res.redirect("/register");
        }
        //compare provided password with stored password
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let payload = { emailaddress: user.emailaddress, username: user.fname}; 
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                res.cookie("jwt", accessToken);
                //and then pass onto the next middleware
                next();
    
            } else {
                return res.render("user/login")
            }
        });
    });
            
};


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

