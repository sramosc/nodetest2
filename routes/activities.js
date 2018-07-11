var express = require('express');
var router = express.Router();

// GET activities list
router.get('/listActivities', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  collection.find({}, {}, function (e, docs) {
    res.json(docs);
  });
});

// GET resetCollectionActivities
router.get('/resetCollectionActivities', function (req, res) {
  var db = req.db;
  var collection = db.get('activities');
  collection.remove({});
  collection.insert([
    {
      "activity_id": "1",
      "activity_name": "actividad 1"
    },
    {
      "activity_id": "2",
      "activity_name": "actividad 2"
    },
    {
      "activity_id": "3",
      "activity_name": "actividad 3"
    },
    {
      "activity_id": "4",
      "activity_name": "actividad 4"
    },
    {
      "activity_id": "5",
      "activity_name": "actividad 5"
    },
    {
      "activity_id": "6",
      "activity_name": "actividad 6"
    }
  ], function (err, result) {
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
