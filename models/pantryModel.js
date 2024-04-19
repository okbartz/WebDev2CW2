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

    //function for initializing pantry database
    init() {
        this.db.insert({
            pantryTitle: 'Main Pantry',
            pantryDescription: 'Something something',
            pantryAddress: "g52 something",
            _id: "1234"
        });
        console.log('db entry main pantry');
        this.db.insert({
            pantryTitle: 'Pantry 1',
            pantryDescription: 'Something something',
            pantryAddress: "g51 something",
            _id: "5678"
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

    //function for updating pantry details
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

    //function for adding a new pantry entry
    addEntry(pantryTitle, pantryDescription, pantryAddress) {
        var entry = {
            pantryTitle: pantryTitle, 
                pantryDescription: pantryDescription, 
                pantryAddress: pantryAddress,
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


    //function for getting pantry by id
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


    //function for deleting specific pantrys
    delete(pantryID) {
        this.db.remove({
            '_id':
            pantryID
        }, function (err, entries) {
            if (err) {
                console.log("Can't find pantry:", pantryID);
                return
                cb(null, null);
            }
        });
    }



}

const dao = new
 pantry(); dao.init();
module.exports = dao;

