const nedb = require('gray-nedb');
const userDao = require('./userModel.js');

class contactDao {
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
            emailaddress: 'ex@email.co',
            subject: 'messageTest',
            message: 'TestMessage',
            published: '2020-02-16',
        });
        //for later debugging
        console.log('db entry mes1 inserted');
        this.db.insert({
            emailaddress: 'ex@email.co',
            subject: 'messageTest2',
            message: 'messageTestMessageTest',
            published: '2020-02-16',
        });
        //for later debugging
        console.log('db entry mes2 inserted');
    }

    //a function to return all messages from the database
    getAllMessages() {
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


    addMessage(emailaddress, subject1, message) {
        const that = this;
        var entry = {
            emailaddress: emailaddress,
            subject: subject1,
            message: message,
            published: "new Date().toISOString().split('T')[0]"
        };
        console.log('entry created', entry);
        that.db.insert(entry, function (err, doc) {
            if (err) {
                console.log('Error inserting document');
            } else {
                console.log('document inserted into the database', doc);
            }
        });
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


    delete(messageid) {
        this.db.remove({
            '_id':
            messageid
        }, function (err, entries) {
            if (err) {
                console.log("Can't find message:", messageid);
                return
                cb(null, null);
            }
        });
    }



}


module.exports = contactDao;

