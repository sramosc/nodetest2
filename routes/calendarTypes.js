var express = require('express');
var router = express.Router();

// GET calendar Types list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('calendarTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET calendarTypes Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('calendarTypes');
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
  var collection = db.get('calendarTypes');
  collection.remove({});
  collection.insert([
    {
      "name": "FESTIVOS NACIONALES",
      "id": 1
    },
    {
      "name": "FESTIVOS PAIS VASCO",
      "id": 2
    },
    {
      "name": "FESTIVOS MADRID",
      "id": 3
    },
    {
      "name": "FESTIVOS CATALUÑA",
      "id": 4
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: calendarTypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
