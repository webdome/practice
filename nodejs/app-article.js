const app = require('express')()
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient
const dbUrl = 'mongodb://localhost:27017/test'

function MongoConnect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(dbUrl, (err, db) => {
            if (err) reject(err)
            resolve(db)
        })
    })
}

var getList = function (db, callback) {
    var collection = db.collection('crud');
    var where = {}
    var set = {}
    collection.find(where, set).toArray(function (err, result) {
        assert.equal(err, null);
        callback(result);
    });
}

app.get('/',(req,res)=>{
    MongoConnect().then((db) => {
        getList(db, function (result) {
            db.close();
            res.send(result);
        });
    }).catch((err) => {
        res.send('fail');
    })
})

app.listen(8888)