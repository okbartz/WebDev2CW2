const Datastore = require("gray-nedb");
const bcrypt = require('bcryptjs');const pantry = require("./pantryModel");
 const
    saltRounds = 10;
class UserDAO {
    constructor(dbFilePath) {
        if
            (dbFilePath) { //embedded 
            this.db = new Datastore({
                filename: dbFilePath, autoload: true
            });
        } else { //in memory
            this.db = new Datastore();
        }
    }
    // initialize user database
    // temp password is password
    init() {
        
        var password1 = "password";

        bcrypt.hash(password1, saltRounds)
        .then(function (hash) {
            password1 = hash;

            // This will ensure that db.insert() is called after the password is hashed
            this.db.insert({
                email: 'ExampleEmail1@email.com', 
                fname: 'bob', 
                sname: 'doe', 
                password: password1,
                ispantry: "false",
                pantryid: null
            });

            this.db.insert({
                email: 'ExampleEmail2@email.com',
                fname: 'john', 
                sname: 'doe', 
                password: password1,
                    ispantry: "true",
                    pantryid: "5678"
                
            });

        }.bind(this)); // Binding 'this' to the function context

        return this;

    }

    //function for creating new users
    create(email,fname,sname,
        password,confpassword) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            var entry = {
                email: email, 
                fname: fname, 
                sname: sname,
                password: hash,
                ispantry: false
            }; 
            
            if(password === confpassword){
            that.db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert user:", email);
                }
            });
        }});
    }

    //function for updating existing users
    update(userid,email,fname,sname,
        password, ispantry, pantryid) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            
            var entry;

            if(password === ""){

                 entry = {
                    email: email, 
                    fname: fname, 
                    sname: sname,
                    ispantry: ispantry,
                    pantryid: pantryid
                }; 

            } else{
            var entry = {
                email: email, 
                fname: fname, 
                sname: sname,
                password: hash,
                ispantry: ispantry,
                pantryid: pantryid
            }; 
            }
            that.db.update({_id: userid}, 
                { $set: entry }, (err, numUsersUpdated, updatedUser) => {
                if (err) return callback(null, err);
                
            })



            
        });
    }
    
    //function for deleting users
    delete(userid) {
        this.db.remove({
            '_id':
            userid
        }, function (err, entries) {
            if (err) {
                console.log("Can't find user:", userid);
                return
                cb(null, null);
            }
        });
    }

    //function for looking up users if they exist
    lookup(email, cb) {
        this.db.find({
            'email':
                email
        }, function (err, entries) {
            if (err) {
                return
                cb(null, null);
            } else {
                if (entries.length
                    == 0) {
                    return cb(null,
                        null);
                } return cb(null, entries[0]);
            }
        });
    }

    //function for looking up the pantry id of a user
    LookUpPantryID(userID) {
        return new Promise((resolve, reject) => {
            this.db.find({"_id": userID}, function (err, entries) {
                if (err) {
                    reject(err); 
                } else {
                    if (entries.length > 0) {
                        
                        const pantryid = entries[0].pantryid;
                        console.log('function all() returns: ', pantryid);
                        resolve(pantryid); 
                    } else {
                        reject(new Error("User not found")); // Reject if user is not found
                    }
                }
            });
        });
    }

    //get all users
    getAllEntries() {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
            //use the find() function of the database to get the data,
            //error first callback function, err for error, entries for data
            var db = this.db;
            
            db.find({}, function (err, entries) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise & return the data
                } else {

                    resolve(entries);
                    //to see what the returned data looks like
                    console.log('function all() returns: ', entries);
                }
            });
        })
    }

    //get all users
    lookupUser(userID) {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
            //use the find() function of the database to get the data,
            //error first callback function, err for error, entries for data
            var db = this.db;
            
            db.find({"_id": userID}, function (err, entries) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise & return the data
                } else {

                    resolve(entries);
                    //to see what the returned data looks like
                    console.log('function lookup() returns: ', entries);
                }
            });
        })
    }

    //function for checking is a user is a pantry
     userispantry(userID) {
        return new Promise((resolve, reject) => {
            this.db.find({"_id": userID}, function (err, entries) {
                if (err) {
                    reject(err); // If there's an error, reject the promise
                } else {
                    if (entries.length > 0) {
                        // Assuming `_id` is unique and there's only one entry
                        const ispantry = entries[0].ispantry;
                        console.log('function all() returns: ', ispantry);
                        resolve(ispantry); // Resolve the promise with the value of ispantry
                    } else {
                        reject(new Error("User not found")); // Reject if user is not found
                    }
                }
            });
        });
    }


} const dao = new
    UserDAO(); dao.init();
module.exports = dao;
