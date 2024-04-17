const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt'); 
const userDao = require('./userModel.js');

const saltRounds = 10;

class AdminDAO {
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
   
    init() {
        this.db.insert({
            admin: 'true',
            email: 'ExampleEmail3@email.com', 
            fname: 'bob', 
            sname: 'doe', 
            password: "$2b$10$NwOTFkWPsGKKy3eP8WJZUuidqW46ZAD26xzWaPdzdbFHCy3Yk1Cxi"
        });
        this.db.insert({
            admin: 'true',
            email: 'ExampleEmail2@email.com',
            fname: 'john', 
            sname: 'doe', 
            password:
                '$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S'
        }); return
        this;
    }

    create(email,fname,sname,
        password,confpassword) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            var entry = {
                admin: 'true',
                email: email, 
                fname: fname, 
                sname: sname,
                password: hash,
            }; 
            
            if(password === confpassword){
            that.db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert user:", email);
                }
            });
        }});
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

    update(userid,email,fname,sname,
        password) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            var entry = {
                userid: userid,
                email: email, 
                fname: fname, 
                sname: sname,
                password: hash,
                admin: true
            }; 
            
            that.db.update({_id: userid}, 
                { $set: entry }, (err, numUsersUpdated, updatedUser) => {
                if (err) return callback(null, err);
                
            })



            
        });
    }

} const dao = new
    AdminDAO(); dao.init();
module.exports = dao;
