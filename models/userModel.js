const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt'); const
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
    // for the demo the password is the bcrypt of the username
    init() {

        this.db.insert({
            email: 'ExampleEmail1@email.com', 
            fname: 'bob', 
            sname: 'doe', 
            password: "$2b$10$NwOTFkWPsGKKy3eP8WJZUuidqW46ZAD26xzWaPdzdbFHCy3Yk1Cxi",
            ispantry: false
        });
        
        this.db.insert({
            email: 'ExampleEmail2@email.com',
            fname: 'john', 
            sname: 'doe', 
            password:
                '$2b$10$NwOTFkWPsGKKy3eP8WJZUuidqW46ZAD26xzWaPdzdbFHCy3Yk1Cxi',
                ispantry: true
        }); return
        this;
    }

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

    update(userid,email,fname,sname,
        password, ispantry) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            var entry = {
                userid: userid,
                email: email, 
                fname: fname, 
                sname: sname,
                password: hash,
                ispantry: ispantry
            }; 
            
            that.db.update({_id: userid}, 
                { $set: entry }, (err, numUsersUpdated, updatedUser) => {
                if (err) return callback(null, err);
                
            })



            
        });
    }
    
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
