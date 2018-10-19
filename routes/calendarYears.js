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
      "id": "1"
    },
    {
      "name": "2015",
      "id": "2"
    },
    {
      "name": "2016",
      "id": "3"
    },
    {
      "name": "2017",
      "id": "4"
    },
    {
      "name": "2018",
      "id": "5"
    },
    {
      "name": "2019",
      "id": "6"
    },
    {
      "name": "2020",
      "id": "7"
    },
    {
      "name": "2021",
      "id": "8"
    },

  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: calendarYears collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
