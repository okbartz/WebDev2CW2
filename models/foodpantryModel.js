const nedb = require('gray-nedb');
const userDao = require('./userModel.js');

class foodpantry {
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
            foodtitle: 'Apple',
            foodimg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/1200px-Red_Apple.jpg',
            foodexp: '2020-02-16',
            published: '2020-02-16',
            fooddesc: '12 pack',
            user: 'Peter',
            userid: 'AAAA',
            currentPantryid: null,
            currentPantryName: null
        });
        //for later debugging
        console.log('db entry Peter inserted');
        this.db.insert({
            foodtitle: 'Chicken',
            foodimg: 'https://i1.pickpik.com/photos/583/632/1023/chicken-hen-poultry-range-86ac9b1f29db7767b2bf282e3328a171.jpg',
            foodexp: '2025-02-16',
            published: '2025-02-16',
            fooddesc: 'Red',
            user: 'Ann',
            userid: 'BBBB',
            currentPantryid: null,
            currentPantryName: null
        });
        //for later debugging
        console.log('db entry Ann inserted');
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

                    entries.forEach(function(entry) {
                        var foodexp1 = entry.foodexp;
                        console.log('Checking Entry: ' + foodexp1);
                        if((checkOOD(foodexp1)) === true){
                        console.log("is Expired: " + checkOOD(foodexp1))
                        
                        db.remove({foodexp: foodexp1});
                        

                    }

                
                    });

                    resolve(entries);
                    //to see what the returned data looks like
                    console.log('function all() returns: ', entries);
                }
            });
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

    getEntriesByUser(userid) {
        return new Promise((resolve, reject) => {
            this.db.find({
                'userid': userid
            }, function (err, entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log('getEntriesByUser returns: ', entries);
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

    updatePantry(itemsid,currentPantryid,currentPantryName) {
        const that = this;
        
            let itemid = itemsid;
            
            var entry = {
                currentPantryid: currentPantryid, 
                currentPantryName: currentPantryName, 
            }; 
            
            console.log("updating items pantry")
            that.db.update({_id: itemid}, 
                { $set: entry }, (err, numUsersUpdated, updatedUser) => {
                if (err) return callback(null, err);
                
            });

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



function checkOOD(date){
    var CurrentDate = new Date();
    var ExpiryDate = new Date(date);
    
    console.log("current date: "+ CurrentDate);
    console.log("expiry date:" + ExpiryDate);
    console.log(CurrentDate + " > " + ExpiryDate);

 if(CurrentDate > ExpiryDate){
     return true;
 }
 else{
     return false;
 }



 }

module.exports = foodpantry;

