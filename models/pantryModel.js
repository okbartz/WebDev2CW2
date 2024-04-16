const nedb = require('gray-nedb');
const userDao = require('./userModel.js');

class pantry {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({
                filename: dbFilePath,
                autoload: true
            });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }
    }

    init() {
        this.db.insert({
            pantryTitle: 'Main Pantry',
            pantryDescription: 'Something something',
            pantryAddress: "g52 something",
            
        });
        console.log('db entry main pantry');
        this.db.insert({
            pantryTitle: 'Pantry 1',
            pantryDescription: 'Something something',
            pantryAddress: "g51 something",
            
        });
        console.log('db entry pantry 1 pantry');
    }

    //a function to return all entries from the database
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

    update(pantryTitle,pantryDescription,pantryAddress,pantryID) {
        const that = this;
        
            var entry = {
                pantryTitle: pantryTitle, 
                pantryDescription: pantryDescription, 
                pantryAddress: pantryAddress,
            }; 
            
            that.db.update({_id: pantryID}, 
                { $set: entry }, (err, numUsersUpdated, updatedUser) => {
                if (err) return callback(null, err);
                
            })



            
        
    }

    addEntry(foodtitle, foodimg, foodexp, fooddesc, user, userid) {
        var entry = {
            foodtitle: foodtitle,
            foodimg: foodimg,
            foodexp: foodexp,
            published: new Date().toISOString().split('T')[0],
            fooddesc: fooddesc,
            user: user,
            userid: userid
        }
        console.log('entry created', entry);
        this.db.insert(entry, function (err, doc) {
            if (err) {
                console.log('Error inserting document', subject);
            } else {
                console.log('document inserted into the database', doc);
            }
        })
    }

    getEntriesById(pantryId) {
        return new Promise((resolve, reject) => {
            this.db.find({
                '_id': pantryId
            }, function (err, entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log('getEntriesById returns: ', entries);
                }
            })
        })
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries.user);
                    console.log('getEntriesByUser returns: ', entries);
                }
            })
        })
    }

    delete(itemid) {
        this.db.remove({
            '_id':
            itemid
        }, function (err, entries) {
            if (err) {
                console.log("Can't find user:", itemid);
                return
                cb(null, null);
            }
        });
    }



}







 

module.exports = pantry;

