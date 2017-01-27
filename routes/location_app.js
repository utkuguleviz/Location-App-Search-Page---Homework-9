var express = require('express');
var mongo = require("mongoskin");
var bodyParser = require('body-parser');
var dialog = require("dialog");

var jsonParser = bodyParser.json();
var router = express.Router();

var db = mongo.db("mongodb://localhost:27017/location", { native_parser: true })
db.bind('location');

router.get('/', function(req, res, next){
    res.render('location_opr')
});

var add = function(req, res, next){
    var doc = {"name": req.body.name, "category": req.body.category,
        "location": {"type": "Point", "coordinates": [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] } };
        db.location.insert(doc, function(err, docInserted){
            if(err) throw err;
            dialog.info("Inserted!")
            res.redirect('/location_app');
            //return db.close();
        });
}

var update = function(req, res, next){
    var query = {"location.coordinates": [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]};
    db.location.findOne(query, function(err, doc){
        query['_id'] = doc['_id'];
        doc['name'] = req.body.name;
        doc['category'] = req.body.category;
        db.location.update(query, doc, function(err, numUpdated){
            if(err) throw err;
            dialog.info("Updated!")
            res.redirect('/location_app');
            //return db.close();
        })
    })
}

var remove = function(req, res, next){
    var query = {"location.coordinates" : [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]}
    db.location.remove(query, function(err, removed){
        if(err) throw err;
        dialog.info("Removed!")
        res.redirect('/location_app');
    })
}

var operation = function(req, res, next){
    if(req.body.type == "add"){
        add(req,res,next);
    }
    else if(req.body.type == "update"){
        update(req, res, next);
    }
    else{
       remove(req, res, next);
    }  
}



router.post('/', jsonParser, operation);

module.exports = router;