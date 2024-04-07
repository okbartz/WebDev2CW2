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
} const dao = new
    AdminDAO(); dao.init();
module.exports = dao;
