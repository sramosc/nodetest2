var express = require('express');
var router = express.Router();

// GET calendar Years list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('calendarYears');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET calendarYears Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('calendarYears');
  collection.find({}, '-_id', function (e, docs) {
    if (e != null) {
      res.json(e)
    } else {
      let result = {
        options: docs
      }
      res.json(result)      
    }
  });
});

// GET reset
router.get('/reset', function (req, res) {
  var db = req.db;
  var collection = db.get('calendarYears');
  collection.remove({});
  collection.insert([
    {
      "name": "2014",
      "id": 2014
    },
    {
      "name": "2015",
      "id": 2015
    },
    {
      "name": "2016",
      "id": 2016
    },
    {
      "name": "2017",
      "id": 2017
    },
    {
      "name": "2018",
      "id": 2018
    },
    {
      "name": "2019",
      "id": 2019
    },
    {
      "name": "2020",
      "id": 2020
    },
    {
      "name": "2021",
      "id": 2021
    },

  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: calendarYears collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
