var express = require('express');
var mongo = require("mongoskin");
var bodyParser = require('body-parser');

var router = express.Router();
var jsonParser = bodyParser.json();

var currLong = 0;
var currLat = 0;

var db = mongo.db("mongodb://localhost:27017/location", { native_parser: true })
db.bind('location');

router.get('/', function (req, res, next) {
    res.render('search_nearest');
});

var search = function(req, res, next){
    if(req.body.searchform == undefined)//start search
        res.render('start_search', { longitude: req.body.user_longitude, latitude:  req.body.user_latitude});
    else{//search result calculation
        var searchText = req.body.searchtext + '';
        var query = {
                    "location.coordinates": { "$geoWithin": { "$center": [ [parseFloat(req.body.longitude), parseFloat(req.body.latitude)], 10 ] } } ,
                    "$text" : { "$search" : "Restaurant"}
                }
        db.location.find(query).limit(3).toArray(function(err, results) {
            var sendText = '';
            for(let i= 0; i < 3; i++){
                sendText += 'Name: ' + results[i].name +' Category: '+ results[i].category+ ' Location: '+ results[i].location.coordinates + '<br/>'; 
            }
            res.send(sendText);
        }); 
    }
}

router.post("/", jsonParser, search);

module.exports = router;