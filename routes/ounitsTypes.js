var express = require('express');
var router = express.Router();

// GET calendar Types list
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.get('oUnitsTypes');
  collection.find({}, '-_id', function (e, docs) {
    res.json(docs);
  });
});

// GET calendarTypes Modal list
router.get('/selection', function (req, res) {
  var db = req.db;
  var collection = db.get('oUnitsTypes');
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
  var collection = db.get('oUnitsTypes');
  collection.remove({});
  collection.insert([
    {
      "name": "TIPO 1",
      "id": 1
    },
    {
      "name": "TIPO 2",
      "id": 2
    },
    {
      "name": "TIPO 3",
      "id": 3
    },
    {
      "name": "TIPO 4",
      "id": 4
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: 'OK: oUnitsTypes collection has been correctly initialized' } : { msg: 'KO: ' + err }
    );
  });
});

module.exports = router;
