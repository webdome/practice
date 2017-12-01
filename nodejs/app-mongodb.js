const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const url = 'mongodb://localhost:27017/test';
// insertData
var insertDocument = function (db, callback) {
    db.collection('restaurants').insertOne({
        "address": {
            "street": "2 Avenue",
            "zipcode": "10075",
            "building": "1480",
            "coord": [-73.9557413, 40.7720266]
        },
        "borough": "Manhattan",
        "cuisine": "Italian",
        "grades": [{
                "date": new Date("2014-10-01T00:00:00Z"),
                "grade": "A",
                "score": 11
            },
            {
                "date": new Date("2014-01-16T00:00:00Z"),
                "grade": "B",
                "score": 17
            }
        ],
        "name": "Vella",
        "restaurant_id": 100
    }, function (err, result) {
        // console.log(result);
        assert.equal(err, null);
        // console.log("Inserted a document into the restaurants collection.");
        callback(result);
    });
};
// findData
/** 
 * db.集合.find({k1:v1,...}); 条件查询
 * db.集合.findOne({k1:v1,...}); 查询第一条
 * db.集合.find({k1:v1,...}).limit(数量); 限制数量
 * db.集合.find({k1:v1,...}).skip(数量); 跳过指定数量
 * db.集合.find({age:{'$gt':9}}); 比较查询
 * db.集合.find({age:{'gt′:9,′lt':11}}); 区间查询
 * db.集合.find({k1:v1,...}).count(); 查询数量
 * db.集合.find({k1:v1,...}).sort({"字段名":1}); 排序  1：表示升序，-1：表示降序
 * db.表名.find({k1:v1,...},{"字段名":0});  指定返回字段  参数1：返回 0：不返回
 */
var findRestaurants = function (db, callback) {
    var collection = db.collection('restaurants');
    var where = {
        restaurant_id: {
            "$lte": 10
        }
    };
    var set = {
        _id: 0,
        name: 1,
        restaurant_id: 1
    };
    collection.find(where, set).toArray(function (err, result) {
        assert.equal(err, null);
        callback(result);
    });
}
// updateData
var updateRestaurants = function (db, callback) {
    var collection = db.collection('restaurants');
    var where = {
        restaurant_id: {
            "$lt": 10
        }
    };
    var set = {
        $set: {
            restaurant_id: 10
        }
    };
    collection.updateMany(where, set, function (err, result) {
        assert.equal(err, null);
        callback(result);
    });
}

var removeRestaurants = function(db, callback) {
    var collection = db.collection('restaurants');
    var where={restaurant_id:{"$gt":10}};
    collection.remove(where,function(err, result) {
        assert.equal(err,null);
        callback(result);
    });
}

app.get('/', function (req, res) {
    res.send('<a href="/insert">插入一条</a><br><a href="/select">查找</a><br><a href="/update">更新</a><br><a href="/remove">删除</a>');
})

app.get('/insert', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insertDocument(db, function (result) {
            db.close();
            res.send(result);
        });
    });
});

app.get('/select', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        findRestaurants(db, function (result) {
            db.close();
            res.send(result);
        });
    });
});

app.get('/update', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        updateRestaurants(db, function (result) {
            db.close();
            res.send(result);
        });
    });
});

app.get('/remove',function(req,res){
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        removeRestaurants(db, function (result) {
            db.close();
            res.send(result);
        });
    });
});
app.listen(8888);